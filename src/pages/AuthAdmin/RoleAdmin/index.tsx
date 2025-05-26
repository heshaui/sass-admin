import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space, message, Popconfirm, Modal } from 'antd';
import { useIntl } from '@umijs/max';
import { useState, useEffect } from 'react';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { roleList,saveRole,deleteRoleById,updateRoleById,AuthorityList,savePermissionsList,permissionsParams,deleteTenantByIdList} from '@/services/ant-design-pro/authAdmin';
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
  const [roleId, setRoleId] = useState<string[]>([]); // ✅ 角色ID
  const isAdmin = process.env.UMI_APP_ADMIN_FLAG === '1';
const isMerchant = process.env.UMI_APP_MERCHANT_FLAG === '1';
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
    if (res?.data) {
      if(isAdmin){
        const adminList=res.data.list.filter((item:any)=>item.systemType==='1'||item.systemType==='3');
        setAllPermissions(adminList);
      }else{
        const merchantList=res.data.list.filter((item:any)=>item.systemType==='2'||item.systemType==='3');
        setAllPermissions(merchantList);
      }
    }
  } catch (error) {
    console.error('Failed to fetch permissions:', error);
  }
};

// 📌 获取某个角色的已分配权限
const getRoleInfo = async (record) => {
  try {
    const res = await permissionsParams({ roleId: record.roleId, pageNo: 1, pageSize: 10000 });
    if (res.code==='0') {
     
      setRoleId(res.data.list)
       // ✅ 提取 permissionsId
      const checkedKeys = res.data.list.map((item) => item.permissionsId);
      console.log(checkedKeys)
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
      const res= await updateRoleById({ ...editingRecord, ...values });
      if(res.code==='0'){
        message.success('角色编辑成功');
      }else{
        message.error('角色编辑失败');
      }
    } else {
     const res= await saveRole(values);
      if(res.code==='0'){
        message.success('角色新建成功');
      }else{
        message.error('角色新建失败');
      }
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
const handleDelete = (roleId) => {
  Modal.confirm({
    title: '删除确认',
    content: '确定要删除该角色吗？此操作不可恢复。',
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await deleteRoleById({ roleId });
        if(res.code === '0'){
          message.success('角色删除成功');
          await getRoleList();
        } else {
          message.error('删除失败');
        }
      } catch (error) {
        message.error('删除失败');
      }
    }
  });
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
    // 获取新增的权限
    const newPermissions = values.permissions.filter(
      (permId) => !rolePermissions.includes(permId)
    );
      
    // 获取移除的权限
    const removedPermissions = rolePermissions.filter(
      (permId) => !values.permissions.includes(permId)
    );

    const allID=roleId.filter(item=>removedPermissions.includes(item.permissionsId)) 

    
    // 如果没有变化，直接返回
    if (newPermissions.length === 0 && removedPermissions.length === 0) {
      message.info("权限配置没有变化");
      setDisVisible(false);
      return;
    }
    
    // 处理新增权限
    if (newPermissions.length > 0) {
      const addRes = await savePermissionsList({
        roleId: editingRecord.roleId,
        permissionsIds: newPermissions,
      });
      
      if (addRes.code !== '0') {
        message.error('新增权限失败');
        return;
      }
    }
    
    // 处理移除权限
    if (removedPermissions.length > 0) {
      const ids= allID.map(item => item.id).join(',');

      const deleteRes = await deleteTenantByIdList(ids);
      
      if (deleteRes.code !== '0') {
        message.error('移除权限失败');
        return;
      }
    }
    
    message.success('权限分配成功');
    setDisVisible(false);
    await getRoleList(); // ✅ 刷新角色列表，确保权限生效
  } catch (error) {
    message.error('操作失败');
    console.error(error);
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
        await getRoleList({ 
          pageNo: params.current, 
          pageSize: params.pageSize,
          roleName: params.roleName // 添加roleName参数 
        });
        return {
          data: [],
          success: true,
        };
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
        <Button 
          key="create" 
          icon={<PlusOutlined />} 
          type="primary" 
          onClick={() => {
            setEditingRecord(null); // 清空编辑记录，确保打开新建表单时不带入之前的数据
            setModalVisible(true);
          }}
        >
          新建
        </Button>,
      ]}
    />
    <RoleModal
      key={editingRecord ? `edit-${editingRecord.roleId}` : 'create-new'}
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