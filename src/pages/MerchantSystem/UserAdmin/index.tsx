import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Dropdown, Menu, Button, Tag, message, Modal } from 'antd';
import { PlusOutlined,DownOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useIntl } from 'umi';
import { bindGoogleKey,relieveGoogleKey} from '@/services/ant-design-pro/authAdmin';
import { getTenantEmployeeList,saveTenantEmployee,restPasswordTenantEmployee,deleteTenantEmployeeById,updateTenantEmployeeById,getTomeMenuParams} from '@/services/ant-design-pro/merchantSystem';

import UserModal from './component/UserModal'; // 引入UserModal
import ResetPasswordModal from './component/ResetPasswordModal';
import ResetGoogleModal from './component/ResetGoogleModal';
import GoogleCode from '@/components/GoogleCode'
import { getTenantRoleList } from '@/services/ant-design-pro/merchantSystem';
import { clearAllCookies } from '@/utils';
import { sendGoogleKey } from '@/services/ant-design-pro/authAdmin';
const UserAdmin: React.FC = () => {
   const intl = useIntl();
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);
   const [modalVisible, setModalVisible] = useState(false); // 控制用户弹框
   const [resetPasswordVisible, setResetPasswordVisible] = useState(false); // 控制重置密码弹框
   const [resetGoogleVisible, setResetGoogleVisible] = useState(false); // 控制重置谷歌弹框
   const [bindGoogleVisible, setBindGoogleVisible] = useState(false); // 控制绑定谷歌弹框
   const [editingRecord, setEditingRecord] = useState(null); // 当前操作的记录
   const [roleOptions, setRoleOptions] = useState([]); // 添加角色选项状态
    const [googleCodeVisible, setGoogleCodeVisible] = useState(false);
    const [googleCodeData, setGoogleCodeData] = useState<any>(null);
  
   // 获取角色列表
   const getRoleList = async () => {
     try {
      let data = { pageNo: 1, pageSize: 1000 };
       const res = await getTenantRoleList(data);
       if (res.code==='0') {
         setRoleOptions(res.data.list || []);
       }
     } catch (error) {
       console.error(`${intl.formatMessage({ id: 'merchantSystem.userAdmin.message.fetchRoles.failed' })}`, error);
     }
   };

   useEffect(() => {
     getRoleList(); // 获取角色列表
   }, []);
    
  // 表格的列配置
  const columns = [
    {
      title: intl.formatMessage({ id: 'merchantSystem.userAdmin.column.id' }),
      dataIndex: 'id',
      key: 'id',
      search:false
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.userAdmin.column.nickname' }),
      dataIndex: 'nickname',
      key: 'nickname',
    },
    // {
    //   title: intl.formatMessage({ id: 'merchantSystem.userAdmin.column.remark' }),
    //   dataIndex: 'remark',
    //   key: 'remark',
    //   search:false
    // },
    {
      title: intl.formatMessage({ id: 'merchantSystem.userAdmin.column.role' }),
      dataIndex: 'role',
      key: 'role',
      filters: roleOptions.map(role => ({ text: role.roleName, value: role.roleId })),
      onFilter: (value, record) => Number(record.role) === Number(value),
      render: (roleId) => {
        const role = roleOptions.find(r => Number(r.roleId)=== Number(roleId));
        return role ? role.roleName : roleId;
      },
      valueEnum: roleOptions.reduce((acc, role) => {
        acc[role.roleId] = { text: role.roleName, value: role.roleId }; 
        return acc;
      }, {} as Record<number, { text: string; value: number }>),
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.userAdmin.column.phone' }),
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.userAdmin.column.email' }),
      dataIndex: 'email',
      key: 'email',
      render: (text) => (text ? text : '--'),
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.userAdmin.column.2fa' }),
      dataIndex: 'googleCode',
      key: 'googleCode',
      search:false,
      render: (text) => {
        return text && text !== '-' ? (
          <Tag color="green">{intl.formatMessage({ id: 'merchantSystem.userAdmin.status.enabled' })}</Tag>
        ) : (
          <Tag color="red">{intl.formatMessage({ id: 'merchantSystem.userAdmin.status.disabled' })}</Tag>
        );
      },
      filters: [
        { text: intl.formatMessage({ id: 'merchantSystem.userAdmin.status.enabled' }), value: 'enabled' },
        { text: intl.formatMessage({ id: 'merchantSystem.userAdmin.status.disabled' }), value: 'disabled' },
      ],
      onFilter: (value, record) => {
        if (value === 'enabled') {
          return record.googleCode && record.googleCode !== '';
        }
        return !record.googleCode || record.googleCode === '';
      },
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.userAdmin.column.status' }),
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        0: { text: intl.formatMessage({ id: 'merchantSystem.userAdmin.status.disabled.label' }), status: 'Error' },
        1: { text: intl.formatMessage({ id: 'merchantSystem.userAdmin.status.normal' }), status: 'Success' }
      },
      filters: true,
      onFilter: true,
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.userAdmin.column.operations' }),
      key: 'action',
      search:false,
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="edit" onClick={() => handleEdit(record)}>
                {intl.formatMessage({ id: 'merchantSystem.userAdmin.button.edit' })}
              </Menu.Item>
              <Menu.Item
                key="resetPassword"
                onClick={() => {
                  setEditingRecord(record);
                  Modal.confirm({
                    title: intl.formatMessage({ id: 'merchantSystem.userAdmin.modal.resetPassword.title' }),
                    content: intl.formatMessage({ id: 'merchantSystem.userAdmin.modal.resetPassword.content' }),
                    onOk: async () => {
                      try {
                        await restPasswordTenantEmployee({ id: record.id });
                        message.success(intl.formatMessage({ id: 'merchantSystem.userAdmin.message.resetPassword.success' }));
                      } catch (error) {
                        message.error(intl.formatMessage({ id: 'merchantSystem.userAdmin.message.resetPassword.failed' }));
                      }
                    },
                  });
                }}
              >
                {intl.formatMessage({ id: 'merchantSystem.userAdmin.button.resetPassword' })}
              </Menu.Item>
              {record.googleCode && record.googleCode !== '-' && (
                <Menu.Item
                  key="resetGoogle"
                  onClick={() => {
                    setEditingRecord(record);
                    setResetGoogleVisible(true);
                  }}
                >
                  {intl.formatMessage({ id: 'merchantSystem.userAdmin.button.resetGoogle' })}
                </Menu.Item>
              )}
              <Menu.Item key="delete" onClick={() => handleDelete(record.id)} danger>
                {intl.formatMessage({ id: 'merchantSystem.userAdmin.button.delete' })}
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button>
            {intl.formatMessage({ id: 'merchantSystem.userAdmin.button.operations' })} <DownOutlined />
          </Button>
        </Dropdown>
      ),
    },
  ];

  const getUserList = async (params = { pageNo: 1, pageSize: 10 }) => {
    setLoading(true);
    try {
      const queryParams = { ...params };
      
      const res = await getTenantEmployeeList(queryParams);
      if (res?.data) {
        setData(res.data.list || []);
        return {
          data: res.data.list || [],
          total: res.data.count || 0,
          success: true,
        };
      }
      return {
        data: [],
        total: 0,
        success: false,
      };
    } catch (error) {
      console.error(`${intl.formatMessage({ id: 'merchantSystem.userAdmin.message.fetchUsers.failed' })}`, error);
      return {
        data: [],
        total: 0,
        success: false,
      };
    } finally {
      setLoading(false);
    }
  }

    // 新建/编辑用户提交
    const handleSubmit = async (values: any) => {
      console.log('values',values);
      try {
        if (editingRecord) {
          // 编辑用户
         const res= await updateTenantEmployeeById({ ...editingRecord, ...values });
          if(res.code==='0'){
            message.success(intl.formatMessage({ id: 'merchantSystem.userAdmin.message.editUser.success' }));
          }else{
            message.error(res.message || intl.formatMessage({ id: 'merchantSystem.userAdmin.message.editUser.failed' }));
          }
        } else {
          // 新建用户
        const res=  await saveTenantEmployee(values);
          if(res.code==='0'){
            message.success(intl.formatMessage({ id: 'merchantSystem.userAdmin.message.createUser.success' }));
          }else{
            message.error(res.message || intl.formatMessage({ id: 'merchantSystem.userAdmin.message.createUser.failed' }));
          }

          
        }
        setModalVisible(false);  // 关闭弹窗
        setEditingRecord(null);  // 清空编辑记录
        getUserList();  // 刷新用户列表
      } catch (error) {
        message.error(intl.formatMessage({ id: 'merchantSystem.userAdmin.message.operation.failed' }));
      }
    };
  
    // 编辑用户
    const handleEdit = (record) => {
      setEditingRecord(record);  // 设置编辑记录
      setModalVisible(true);  // 打开弹窗
    };
  
    // 删除用户
    const handleDelete = async (userId) => {
      try {
        // 调用API删除用户
       const res= await deleteTenantEmployeeById({ userId });
        if(res.code==='0'){
          message.success(intl.formatMessage({ id: 'merchantSystem.userAdmin.message.deleteUser.success' }));
          getUserList();  // 刷新用户列表
        }else{
          message.error(intl.formatMessage({ id: 'merchantSystem.userAdmin.message.deleteUser.failed' }));
        }
      } catch (error) {
        message.error(intl.formatMessage({ id: 'merchantSystem.userAdmin.message.delete.failed' }));
      }
    };

// 重置密码
const handleResetPassword = async (values) => {
  try {
   const res= await restPasswordTenantEmployee({ id: editingRecord.id });
    if(res.code==='0'){
      message.success(intl.formatMessage({ id: 'merchantSystem.userAdmin.message.resetPassword.success' }));
    }else{
      message.error(intl.formatMessage({ id: 'merchantSystem.userAdmin.message.resetPassword.failed' }));
    }
    setResetPasswordVisible(false);
  } catch (error) {
    message.error('密码重置失败');
  }
};

// 重置谷歌
const handleResetGoogleAuth = async () => {
  try {
    const res=await relieveGoogleKey({ id: editingRecord.id});
    if(res.code==='0'){
      message.success(intl.formatMessage({ id: 'merchantSystem.userAdmin.message.resetGoogle.success' }));
      getUserList();  // 刷新用户列表
    }else{
      message.error(intl.formatMessage({ id: 'merchantSystem.userAdmin.message.resetGoogle.failed' }));
    }
    setResetGoogleVisible(false);
  } catch (error) {
    message.error('谷歌身份验证重置失败');
  }
};
  
    useEffect(() => {
      getUserList();  // 获取用户列表
    }, []);

  // 处理绑定谷歌验证
  const handleBindGoogleAuth = async (values: any) => {
    try {
      if (!editingRecord) return;
      
      const params = {
        googleCode: values.googleCode,
      };
      
      const res = await bindGoogleKey(params);
      if (res.code === '0') {
        message.success(intl.formatMessage({ id: 'merchantSystem.userAdmin.message.bindGoogle.success' }));
        setBindGoogleVisible(false);
        getUserList(); // 刷新列表
      } else {
        message.error(res.msg || intl.formatMessage({ id: 'merchantSystem.userAdmin.message.bindGoogle.failed' }));
      }
    } catch (error) {
      console.error(`${intl.formatMessage({ id: 'merchantSystem.userAdmin.message.bindGoogle.error' })}`, error);
      message.error(intl.formatMessage({ id: 'merchantSystem.userAdmin.message.bindGoogle.failed' }));
    }
  };

  const getGoogleCode=async()=>{
    const res=await sendGoogleKey();
    if(res.code==='0'){
        
        setGoogleCodeData(res.data);
        setGoogleCodeVisible(true);
    }else{
        message.error(res.message);
    }
    
  }
  const handleGoogleCodeSuccess = async (code: string) => {

    
    const res=await bindGoogleKey({ googleCode: code });
    if(res.code==='0'&&res.data){
      message.success(intl.formatMessage({ id: 'merchantSystem.userAdmin.message.bind.success' }));
      clearAllCookies();
      window.location.reload();


    }else{
      message.error(res.message);
    }
    setGoogleCodeVisible(false);
  }
  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        columns={columns}
        scroll={{ x: 'max-content' }}
        dataSource={data}
        loading={loading}
        request={async (params, sorter, filter) => {
          // 转换参数格式，适配后端API
          const queryParams = {
            pageNo: params.current || 1,
            pageSize: params.pageSize || 10,
            nickname: params.nickname,
            phone: params.phone,
            email: params.email,
            status: params.status, // 确保状态参数正确传递
            role: params.role,
            // 可以添加其他需要的搜索参数
          };
          return await getUserList(queryParams);
        }}
        search={{
          labelWidth: 'auto',
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
              setEditingRecord(null); // 清空编辑记录
              setModalVisible(true);
            }}
          >
            {intl.formatMessage({ id: 'merchantSystem.userAdmin.button.create' })}
          </Button>,
        ]}
      />
        {/* 用户弹框 */}
       <UserModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialValues={editingRecord}
        roleOptions={roleOptions}
      />

      {/* 重置密码弹框 */}
      <ResetPasswordModal
        visible={resetPasswordVisible}
        onClose={() => setResetPasswordVisible(false)}
        onSubmit={handleResetPassword}
      />

      {/* 重置谷歌弹框 */}
      <ResetGoogleModal
        visible={resetGoogleVisible}
        onClose={() => setResetGoogleVisible(false)}
        onSubmit={handleResetGoogleAuth}
      />
      
      {/* 绑定谷歌弹框 */}
      <GoogleCode
       visible={googleCodeVisible} 
       qrCodeUrl={googleCodeData?.codeUri} 
       secretKey={googleCodeData?.secretKey} 
       onSubmit={handleGoogleCodeSuccess} 
       onCancel={() => setGoogleCodeVisible(false)}
      />
    </PageContainer>
  );
};

export default UserAdmin;