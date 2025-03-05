import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Dropdown, Menu, Button, Tag, Space, message, Select, Modal } from 'antd';
import { PlusOutlined, ReloadOutlined,DownOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { employeeList,saveEmployee,deleteEmployeeById,enableEmployee,offEmployee,resetPassword,updateEmployeeById,sendGoogleKey,bindGoogleKey,relieveGoogleKey} from '@/services/ant-design-pro/authAdmin';
import UserModal from './component/UserModal'; // 引入UserModal
import ResetPasswordModal from './component/ResetPasswordModal';
import ResetGoogleModal from './component/ResetGoogleModal';
import BindGoogleModal from './component/BindGoogleModal'; // 引入绑定谷歌验证弹框
import { roleList as fetchRoleListApi } from '@/services/ant-design-pro/authAdmin';

const UserAdmin: React.FC = () => {
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);
   const [modalVisible, setModalVisible] = useState(false); // 控制用户弹框
   const [resetPasswordVisible, setResetPasswordVisible] = useState(false); // 控制重置密码弹框
   const [resetGoogleVisible, setResetGoogleVisible] = useState(false); // 控制重置谷歌弹框
   const [bindGoogleVisible, setBindGoogleVisible] = useState(false); // 控制绑定谷歌弹框
   const [editingRecord, setEditingRecord] = useState(null); // 当前操作的记录
   const [roleOptions, setRoleOptions] = useState([]); // 添加角色选项状态
 
   // 获取角色列表
   const getRoleList = async () => {
     try {
       const res = await fetchRoleListApi();
       if (res?.data) {
         setRoleOptions(res.data || []);
       }
     } catch (error) {
       console.error('获取角色列表失败:', error);
     }
   };

   useEffect(() => {
     getRoleList(); // 获取角色列表
   }, []);
    
  // 表格的列配置
  const columns = [
    {
      title: '管理员ID',
      dataIndex: 'id',
      key: 'id',
      search:false
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      search:false
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      search:false,
      filters: roleOptions.map(role => ({ text: role.roleName, value: role.roleId })),
      onFilter: (value, record) => record.role === Number(value),
      render: (roleId) => {
        const role = roleOptions.find(r => r.roleId === Number(roleId));
        return role ? role.roleName : roleId;
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (text ? text : '--'),
    },
    {
      title: '2FA',
      dataIndex: 'googleCode',
      key: 'googleCode',
      render: (text) => {
        return text && text !== '-' ? (
          <Tag color="green">已开启</Tag>
        ) : (
          <Tag color="red">未开启</Tag>
        );
      },
      filters: [
        { text: '已开启', value: 'enabled' },
        { text: '未开启', value: 'disabled' },
      ],
      onFilter: (value, record) => {
        if (value === 'enabled') {
          return record.googleCode && record.googleCode !== '';
        }
        return !record.googleCode || record.googleCode === '';
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        0: { text: '禁用', status: 'Error' },
        1: { text: '正常', status: 'Success' }
      },
      filters: true,
      onFilter: true,
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      search:false,
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="edit" onClick={() => handleEdit(record)}>
                修改
              </Menu.Item>
              <Menu.Item
                key="resetPassword"
                onClick={() => {
                  setEditingRecord(record);
                  Modal.confirm({
                    title: '确认重置密码',
                    content: '您确定要重置该用户的密码吗？',
                    onOk: async () => {
                      try {
                        await resetPassword({ id: record.id });
                        message.success('密码重置成功');
                      } catch (error) {
                        message.error('密码重置失败');
                      }
                    },
                  });
                }}
              >
                重置密码
              </Menu.Item>
              {(!record.googleCode || record.googleCode === '-') && (
                <Menu.Item
                  key="bindGoogle"
                  onClick={() => {
                    setEditingRecord(record);
                    setBindGoogleVisible(true);
                  }}
                >
                  绑定谷歌
                </Menu.Item>
              )}
              {record.googleCode && record.googleCode !== '-' && (
                <Menu.Item
                  key="resetGoogle"
                  onClick={() => {
                    setEditingRecord(record);
                    setResetGoogleVisible(true);
                  }}
                >
                  重置谷歌
                </Menu.Item>
              )}
              <Menu.Item key="delete" onClick={() => handleDelete(record.id)} danger>
                删除
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button>
            操作 <DownOutlined />
          </Button>
        </Dropdown>
      ),
    },
  ];

  const getUserList = async (params = { pageNo: 1, pageSize: 10 }) => {
    setLoading(true);
    try {
      const queryParams = { ...params };
      
      const res = await employeeList(queryParams);
      if (res?.data) {
        setData(res.data.list || []);
        return {
          data: res.data.list || [],
          total: res.data.total || 0,
          success: true,
        };
      }
      return {
        data: [],
        total: 0,
        success: false,
      };
    } catch (error) {
      console.error('获取用户列表失败:', error);
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
    const handleSubmit = async (values) => {
      console.log('values',values);
      try {
        if (editingRecord) {
          // 编辑用户
         const res= await updateEmployeeById({ ...editingRecord, ...values });
          if(res.code==='0'){
            message.success('用户编辑成功');
          }else{
            message.error('用户编辑失败');
          }
        } else {
          // 新建用户
        const res=  await saveEmployee(values);
          if(res.code==='0'){
            message.success('用户新建成功');
          }else{
            message.error('用户新建失败');
          }

          
        }
        setModalVisible(false);  // 关闭弹窗
        setEditingRecord(null);  // 清空编辑记录
        getUserList();  // 刷新用户列表
      } catch (error) {
        message.error('操作失败');
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
        await deleteEmployeeById({ userId });
        message.success('用户删除成功');
        getUserList();  // 刷新用户列表
      } catch (error) {
        message.error('删除失败');
      }
    };

// 重置密码
const handleResetPassword = async (values) => {
  try {
   const res= await resetPassword({ id: editingRecord.id });
    if(res.code==='0'){
      message.success('密码重置成功');
    }else{
      message.error('密码重置失败');
    }
    setResetPasswordVisible(false);
  } catch (error) {
    message.error('密码重置失败');
  }
};

// 重置谷歌
const handleResetGoogleAuth = async () => {
  try {
    const res=await relieveGoogleKey({ code: editingRecord.googleCode});
    if(res.code==='0'){
      message.success('谷歌身份验证重置成功');
    }else{
      message.error('谷歌身份验证重置失败');
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
  const handleBindGoogleAuth = async (values) => {
    try {
      if (!editingRecord) return;
      
      const params = {
        googleCode: values.googleCode,
      };
      
      const res = await bindGoogleKey(params);
      if (res.code === '0') {
        message.success('谷歌验证绑定成功');
        setBindGoogleVisible(false);
        getUserList(); // 刷新列表
      } else {
        message.error(res.msg || '谷歌验证绑定失败');
      }
    } catch (error) {
      console.error('绑定谷歌验证失败:', error);
      message.error('谷歌验证绑定失败');
    }
  };

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
          <Button key="create" icon={<PlusOutlined />} type="primary" onClick={() => setModalVisible(true)}>
            新建
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
      <BindGoogleModal
        visible={bindGoogleVisible}
        onClose={() => setBindGoogleVisible(false)}
        onSubmit={handleBindGoogleAuth}
        userId={editingRecord?.id}
      />
    </PageContainer>
  );
};

export default UserAdmin;