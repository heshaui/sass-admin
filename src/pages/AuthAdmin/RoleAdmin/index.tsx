import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space, message } from 'antd';
import { useIntl } from '@umijs/max';
import { useState, useEffect } from 'react';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { roleList,saveRole,deleteRoleById,updateRoleById,AuthorityList,savePermissionsList,permissionsParams} from '@/services/ant-design-pro/authAdmin';
import RoleModal from './component/RoleModal';  // 引入RoleModal
import Dispense from './component/Dispense'
const RoleAdmin: React.FC = () => {
  const intl = useIntl();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); 
  const [editingRecord, setEditingRecord] = useState(null); 
  const [allPermissions, setAllPermissions] = useState<string[]>([]); 
  const [disVisible, setDisVisible] = useState(false);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]); // ✅ 角色已分配的权限
  // 表格的列配置
  const columns = [
    {
      title: '角色ID',
      dataIndex: 'roleId',
      key: 'roleId',
      search: false,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '描述',
      dataIndex: 'describe',
      key: 'describe',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      search: false,
      valueEnum: {
        0: { text: '禁用', status: 'Error' },
        1: { text: '启用', status: 'Success' },
      },
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <Button  type="primary" onClick={() => handleDispense(record)}>权限分配</Button>
          <Button  type="primary" onClick={() => handleEdit(record)}>修改</Button>
          <Button danger onClick={() => handleDelete(record.roleId)}>删除</Button>
        </Space>
      ),
    },
  ];

 // 📌 获取角色列表
 const getRoleList = async (params = { pageNo: 1, pageSize: 10 }) => {
  setLoading(true);
  try {
    const res = await roleList(params);
    if (res?.data) setData(res.data.list || []);
  } catch (error) {
    console.error('Failed to fetch roles:', error);
  } finally {
    setLoading(false);
  }
};

// 📌 获取所有权限（加载时调用一次）
const fetchPermissions = async () => {
  try {
    const res = await AuthorityList({ pageNo: 1, pageSize: 1000 });
    if (res?.data) setAllPermissions(res.data.list || []);
  } catch (error) {
    console.error('Failed to fetch permissions:', error);
  }
};

// 📌 获取某个角色的已分配权限
const getRoleInfo = async (record) => {
  try {
    const res = await permissionsParams({ roleId: record.roleId, pageNo: 1, pageSize: 10000 });
    if (res?.data) {
      // ✅ 提取 permissionsId
      const checkedKeys = res.data.list.map((item) => item.permissionsId);
      setRolePermissions(checkedKeys);
    }
  } catch (error) {
    console.error('Failed to fetch role permissions:', error);
  }
};

// 📌 新建/编辑角色提交
const handleSubmit = async (values) => {
  try {
    if (editingRecord) {
      await updateRoleById({ ...editingRecord, ...values });
      message.success('角色编辑成功');
    } else {
      await saveRole(values);
      message.success('角色新建成功');
    }
    setModalVisible(false);
    setEditingRecord(null);
    await getRoleList(); // ✅ 刷新角色列表
  } catch (error) {
    message.error('操作失败');
  }
};

// 📌 编辑角色
const handleEdit = (record) => {
  setEditingRecord(record);
  setModalVisible(true);
};

// 📌 删除角色
const handleDelete = async (roleId) => {
  try {
    await deleteRoleById({ roleId });
    message.success('角色删除成功');
    await getRoleList();
  } catch (error) {
    message.error('删除失败');
  }
};

// 📌 角色权限分配（打开弹框 + 获取角色权限）
const handleDispense = async (record) => {
  setEditingRecord(record);
  await getRoleInfo(record);
  setDisVisible(true);
};

// 📌 提交权限分配
const handleSubmitDis = async (values) => {
  try {
    await savePermissionsList({ roleId: editingRecord.roleId, permissionsIds: values.permissions });
    message.success('权限分配成功');
    setDisVisible(false);
    await getRoleList(); // ✅ 刷新角色列表，确保权限生效
  } catch (error) {
    message.error('操作失败');
  }
};

useEffect(() => {
  fetchPermissions(); 
}, []);


return (
  <PageContainer>
    <ProTable
      rowKey="roleId"
      columns={columns}
      dataSource={data}
      scroll={{ x: 'max-content' }}
      loading={loading}
      request={async (params) => {
        await getRoleList({ pageNo: params.current, pageSize: params.pageSize });
      }}
      options={{
        density: false,
        fullScreen: true,
        reload: false,
        setting: false,
      }}
      pagination={{
        showQuickJumper: true,
        defaultPageSize: 10,
        showSizeChanger: true,
      }}
      toolBarRender={() => [
        <Button key="search" type="primary">
          查询
        </Button>,
        <Button key="reset" icon={<ReloadOutlined />}>
          重置
        </Button>,
        <Button key="create" icon={<PlusOutlined />} type="primary" onClick={() => setModalVisible(true)}>
          新建
        </Button>,
      ]}
    />
    <RoleModal
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      onSubmit={handleSubmit}
      initialValues={editingRecord}
    />
    <Dispense
      visible={disVisible}
      onClose={() => setDisVisible(false)}
      onSubmit={handleSubmitDis}
      initialValues={{ ...editingRecord, permissions: rolePermissions }} // ✅ 传递回显数据
      allPermissions={allPermissions}
    />
  </PageContainer>
);
};

export default RoleAdmin;