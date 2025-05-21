import { AuthorityList } from '@/services/ant-design-pro/authAdmin'; // 权限API
import {
  saveList,
  saveTenantRole,
  tenantPermissionsList,
  tenantRoleList,
  updateTenantRoleById,
  deleteByIds
} from '@/services/ant-design-pro/merchant'; // 角色API
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space, message } from 'antd';
import { useIntl } from 'umi';
import React, { useEffect, useState } from 'react';
import AddCategoryModal from './component/AddCategoryModal'; // 模态框组件
import Dispense from './component/Dispense'; // 权限分配组件

// **表格列定义**
const getColumns = (handleEdit: (record: any) => void, handleDispense: (record: any) => void, intl: any) => [
  { 
    title: intl.formatMessage({ id: 'allocation.table.id' }), 
    dataIndex: 'roleId', 
    key: 'roleId' 
  },
  { 
    title: intl.formatMessage({ id: 'allocation.table.categoryName' }), 
    dataIndex: 'roleName', 
    key: 'roleName' 
  },
  { 
    title: intl.formatMessage({ id: 'allocation.table.categoryDescription' }), 
    dataIndex: 'describe', 
    key: 'describe' 
  },
  {
    title: intl.formatMessage({ id: 'allocation.table.action' }),
    key: 'action',
    render: (_: any, record: any) => (
      <Space>
        <Button type="link" onClick={() => handleEdit(record)}>
          {intl.formatMessage({ id: 'allocation.action.edit' })}
        </Button>
        <Button type="primary" onClick={() => handleDispense(record)}>
          {intl.formatMessage({ id: 'allocation.action.permissionAssign' })}
        </Button>
      </Space>
    ),
  },
];

const Allocation: React.FC = () => {
  const intl = useIntl();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null); // 当前编辑的角色
  const [disVisible, setDisVisible] = useState(false); // 权限分配模态框
  const [rolePermissions, setRolePermissions] = useState<string[]>([]); // 角色已分配权限
  const [allPermissions, setAllPermissions] = useState<string[]>([]); // 所有权限数据
  const [roleId, setRoleId] = useState<string[]>([]); 
  // **获取角色列表**
  const fetchRoleList = async () => {
    try {
      setLoading(true);
      let data = { pageNo: 1, pageSize: 10 };
      const response = await tenantRoleList(data);
      if (response?.data) setDataSource(response.data.list);
    } catch (error) {
      console.error(intl.formatMessage({ id: 'allocation.message.fetchListFailed' }), error);
    } finally {
      setLoading(false);
    }
  };

  // **获取所有权限**
  const fetchPermissions = async () => {
    try {
      const res = await AuthorityList({ pageNo: 1, pageSize: 1000 });
      if (res?.data) setAllPermissions(res.data.list || []);
    } catch (error) {
      console.error(intl.formatMessage({ id: 'allocation.message.fetchPermissionsFailed' }), error);
    }
  };

  useEffect(() => {
    fetchRoleList();
    fetchPermissions();
  }, []);

  // **添加角色**
  const handleAdd = () => {
    setEditingRecord(null); // 进入新增模式
    setModalVisible(true);
  };

  // **修改角色**
  const handleEdit = (record: any) => {
    setEditingRecord(record); // 进入编辑模式
    setModalVisible(true);
  };

  // **关闭模态框**
  const handleCancel = () => {
    setModalVisible(false);
  };

  // **提交新增/修改**
  const handleSubmit = async (formData: any) => {
    try {
      if (editingRecord) {
        // 调用更新 API
        let resp = await updateTenantRoleById({ roleId: editingRecord.roleId, ...formData });
        if (resp.code === '0') message.success(intl.formatMessage({ id: 'allocation.message.updateSuccess' }));
      } else {
        // 调用新增 API
        let res = await saveTenantRole(formData);
        if (res.code === '0') message.success(intl.formatMessage({ id: 'allocation.message.createSuccess' }));
      }

      fetchRoleList(); // 重新加载数据
      handleCancel();
    } catch (error) {
      message.error(intl.formatMessage({ id: 'allocation.message.operationFailed' }));
    }
  };

  // **获取角色已分配的权限**
  const getRolePermissions = async (record: any) => {
    try {
      const res = await tenantPermissionsList({ roleId: record.roleId, pageNo: 1, pageSize: 1000 });
      if (res.code === '0') {
        setRoleId(res.data.list)
        const checkedKeys = res.data.list.map((item: any) => item.permissionsId);
        setRolePermissions(checkedKeys);
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'allocation.message.fetchRolePermissionsFailed' }), error);
    }
  };

  // **打开权限分配弹窗**
  const handleDispense = async (record: any) => {
    setEditingRecord(record);
    await getRolePermissions(record);
    setDisVisible(true);
  };

  // **提交角色权限分配**
  const handleSubmitDis = async (values: any) => {
    console.log(values.permissions)
    try {
      // **计算新增的权限 (去掉已分配的)**
      const newPermissions = values.permissions.filter(
        (item: string) => !rolePermissions.includes(item)
      );

      // 获取移除的权限
      const removedPermissions = rolePermissions.filter(
        (permId) => !values.permissions.includes(permId)
      );

      if (newPermissions.length === 0 && removedPermissions.length === 0) {
        message.info(intl.formatMessage({ id: 'allocation.message.noPermissionChanges' }));
        setDisVisible(false);
        return;
      }

      // **组装新增权限提交数据**
      let data = newPermissions.map((item: string) => ({
        roleId: editingRecord ? editingRecord.roleId : '',
        permissionsId: item,
      }));

      // 调用保存接口
      if (newPermissions.length > 0) {
        const res = await saveList(data);
        if (res.code !== '0') {
          message.error(intl.formatMessage({ id: 'allocation.message.permissionAssignFailed' }));
          return;
        }
      }

      // 调用删除接口
      if (removedPermissions.length > 0) {
        const allID = roleId.filter(item => removedPermissions.includes(item.permissionsId));
        const deleteRes = await deleteByIds(allID.map(item => item.id));
        if (deleteRes.code !== '0') {
          message.error(intl.formatMessage({ id: 'allocation.message.permissionRemoveFailed' }));
          return;
        }
      }

      message.success(intl.formatMessage({ id: 'allocation.message.permissionUpdateSuccess' }));
      setDisVisible(false);
    } catch (error) {
      console.log(error)
      message.error(intl.formatMessage({ id: 'allocation.message.permissionRequestFailed' }));
    }
  };

  return (
    <PageContainer>
      <ProTable
        rowKey="roleId"
        search={false}
        loading={loading}
        toolBarRender={() => [
          <Button type="primary" key="add" onClick={handleAdd}>
            {intl.formatMessage({ id: 'allocation.button.add' })}
          </Button>,
        ]}
        columns={getColumns(handleEdit, handleDispense, intl)}
        dataSource={dataSource}
        pagination={false}
      />

      {/* 添加/编辑角色弹窗 */}
      <AddCategoryModal
        visible={modalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        editingRecord={editingRecord}
      />

      {/* 权限分配弹窗 */}
      <Dispense
        visible={disVisible}
        onClose={() => setDisVisible(false)}
        onSubmit={handleSubmitDis}
        initialValues={{ ...(editingRecord || {}), permissions: rolePermissions }}
        allPermissions={allPermissions}
      />
    </PageContainer>
  );
};

export default Allocation;
