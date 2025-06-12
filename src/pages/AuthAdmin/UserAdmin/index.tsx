import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Dropdown, Menu, Button, Tag, message, Modal } from 'antd';
import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import {
  employeeList,
  saveEmployee,
  deleteEmployeeById,
  resetPassword,
  updateEmployeeById,
  bindGoogleKey,
  relieveGoogleKey,
} from '@/services/ant-design-pro/authAdmin';
import UserModal from './component/UserModal'; // 引入UserModal
import ResetPasswordModal from './component/ResetPasswordModal';
import ResetGoogleModal from './component/ResetGoogleModal';
import BindGoogleModal from './component/BindGoogleModal'; // 引入绑定谷歌验证弹框
import { useIntl } from '@umijs/max';
import { roleList as fetchRoleListApi } from '@/services/ant-design-pro/authAdmin';

//@ts-ignore
import { clearAllCookies } from '@/utils';

const UserAdmin: React.FC = () => {
  const intl = useIntl();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // 控制用户弹框
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false); // 控制重置密码弹框
  const [resetGoogleVisible, setResetGoogleVisible] = useState(false); // 控制重置谷歌弹框
  const [bindGoogleVisible, setBindGoogleVisible] = useState(false); // 控制绑定谷歌弹框
  const [editingRecord, setEditingRecord] = useState<API.AuthAdminUserAdminListItem | null>(null); // 当前操作的记录
  const [roleOptions, setRoleOptions] = useState<API.RoleListItem[]>([]); // 添加角色选项状态
  const [showGoogleKey, setShowGoogleKey] = useState(false);

  // 表格的列配置
  const columns: ProColumns<API.AuthAdminUserAdminListItem>[] = [
    {
      title: intl.formatMessage({ id: 'userAdmin.table.id' }),
      dataIndex: 'id',
      key: 'id',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'userAdmin.table.nickname' }),
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: intl.formatMessage({ id: 'userAdmin.table.remark' }),
      dataIndex: 'remark',
      key: 'remark',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'userAdmin.table.role' }),
      dataIndex: 'role',
      key: 'role',
      search: false,
      filters: roleOptions.map((role) => ({ text: role.roleName, value: String(role.roleId) })),
      onFilter: (value, record) => {
        if (!record.role) return false;
        const userRoles = String(record.role).split(',').map(Number);
        return userRoles.includes(Number(value));
      },
      render: (_, record: API.AuthAdminUserAdminListItem) => {
        if (!record.role) return '-';
        const ids = String(record.role).split(',').map(Number);
        const roles = roleOptions.filter((r) => ids.includes(Number(r.roleId)));
        return roles.map((r) => r.roleName).join(', ') || '-';
      },
    },
    {
      title: intl.formatMessage({ id: 'userAdmin.table.phone' }),
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: intl.formatMessage({ id: 'userAdmin.table.email' }),
      dataIndex: 'email',
      key: 'email',
      render: (_, record: API.AuthAdminUserAdminListItem) => record.email || '-',
    },
    {
      title: '2FA',
      dataIndex: 'googleCode',
      key: 'googleCode',
      search: false,
      render: (_, record: API.AuthAdminUserAdminListItem) => {
        return record.googleCode && record.googleCode !== '-' ? (
          <Tag color="green">
            {intl.formatMessage({ id: 'userAdmin.table.googleCode.enabled' })}
          </Tag>
        ) : (
          <Tag color="red">{intl.formatMessage({ id: 'userAdmin.table.googleCode.disabled' })}</Tag>
        );
      },
      filters: [
        {
          text: intl.formatMessage({ id: 'userAdmin.table.googleCode.enabled' }),
          value: 'enabled',
        },
        {
          text: intl.formatMessage({ id: 'userAdmin.table.googleCode.disabled' }),
          value: 'disabled',
        },
      ],
      onFilter: (value, record) => {
        if (value === 'enabled') {
          return !!(record.googleCode && record.googleCode !== '');
        }
        return !record.googleCode || record.googleCode === '';
      },
    },
    {
      title: intl.formatMessage({ id: 'userAdmin.table.status' }),
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        0: { text: intl.formatMessage({ id: 'userAdmin.table.status.disabled' }), status: 'Error' },
        1: {
          text: intl.formatMessage({ id: 'userAdmin.table.status.enabled' }),
          status: 'Success',
        },
      },
      filters: true,
      onFilter: true,
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'userAdmin.table.actions' }),
      key: 'action',
      search: false,
      render: (_: any, record: API.AuthAdminUserAdminListItem) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="edit" onClick={() => handleEdit(record)}>
                {intl.formatMessage({ id: 'userAdmin.table.actions.edit' })}
              </Menu.Item>
              <Menu.Item
                key="resetPassword"
                onClick={() => {
                  setEditingRecord(record);
                  Modal.confirm({
                    title: intl.formatMessage({ id: 'userAdmin.modal.resetPasswordTitle' }),
                    content: intl.formatMessage({
                      id: 'userAdmin.table.actions.resetPassword.confirm',
                    }),
                    onOk: async () => {
                      try {
                        await resetPassword({ id: record.id });
                        message.success(
                          intl.formatMessage({ id: 'userAdmin.messages.resetPasswordSuccess' }),
                        );
                      } catch (error) {
                        message.error(
                          intl.formatMessage({ id: 'userAdmin.messages.resetPasswordError' }),
                        );
                      }
                    },
                  });
                }}
              >
                {intl.formatMessage({ id: 'userAdmin.table.actions.resetPassword' })}
              </Menu.Item>
              {(!record.googleCode || record.googleCode === '-') && (
                <Menu.Item
                  key="bindGoogle"
                  onClick={() => {
                    setEditingRecord(record);
                    setBindGoogleVisible(true);
                  }}
                >
                  {intl.formatMessage({ id: 'userAdmin.table.actions.bindGoogle' })}
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
                  {intl.formatMessage({ id: 'userAdmin.table.actions.resetGoogle' })}
                </Menu.Item>
              )}
              <Menu.Item key="delete" onClick={() => handleDelete(record.id)} danger>
                {intl.formatMessage({ id: 'userAdmin.table.actions.delete' })}
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button>
            {intl.formatMessage({ id: 'userAdmin.table.actions' })} <DownOutlined />
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
      console.error(intl.formatMessage({ id: 'userAdmin.messages.getUserListError' }), error);
      return {
        data: [],
        total: 0,
        success: false,
      };
    } finally {
      setLoading(false);
    }
  };

  // 新建/编辑用户提交
  const handleSubmit = async (values: API.AuthAdminUserAdminListItem) => {
    console.log('values', values);
    try {
      if (editingRecord) {
        // 编辑用户
        const res = await updateEmployeeById({ ...editingRecord, ...values });
        if (res.code === '0') {
          message.success(intl.formatMessage({ id: 'userAdmin.messages.editSuccess' }));
        } else {
          message.error(intl.formatMessage({ id: 'userAdmin.messages.editError' }));
        }
      } else {
        // 新建用户
        const res = await saveEmployee(values);
        if (res.code === '0') {
          message.success(intl.formatMessage({ id: 'userAdmin.messages.createSuccess' }));
        } else if (res.code === '11111') {
          message.error(res.message);
        } else {
          message.error(intl.formatMessage({ id: 'userAdmin.messages.createError' }));
        }
      }
      setModalVisible(false); // 关闭弹窗
      setEditingRecord(null); // 清空编辑记录
      getUserList(); // 刷新用户列表
    } catch (error) {
      message.error(intl.formatMessage({ id: 'userAdmin.messages.operationError' }));
    }
  };

  // 编辑用户
  const handleEdit = (record: API.AuthAdminUserAdminListItem) => {
    setEditingRecord(record); // 设置编辑记录
    setModalVisible(true); // 打开弹窗
  };

  // 删除用户
  const handleDelete = async (userId: number) => {
    try {
      // 调用API删除用户
      await deleteEmployeeById({ userId });
      message.success(intl.formatMessage({ id: 'userAdmin.messages.deleteSuccess' }));
      getUserList(); // 刷新用户列表
    } catch (error) {
      message.error(intl.formatMessage({ id: 'userAdmin.messages.deleteError' }));
    }
  };

  // 重置密码
  const handleResetPassword = async () => {
    if (!editingRecord) return;
    try {
      const res = await resetPassword({ id: editingRecord.id });
      if (res.code === '0') {
        message.success(intl.formatMessage({ id: 'userAdmin.messages.resetPasswordSuccess' }));
      } else {
        message.error(intl.formatMessage({ id: 'userAdmin.messages.resetPasswordError' }));
      }
      setResetPasswordVisible(false);
    } catch (error) {
      message.error(intl.formatMessage({ id: 'userAdmin.messages.resetPasswordError' }));
    }
  };

  // 重置谷歌
  const handleResetGoogleAuth = async () => {
    try {
      if (!editingRecord) return;
      const res = await relieveGoogleKey({ id: editingRecord.id });
      if (res.code === '0') {
        message.success(intl.formatMessage({ id: 'userAdmin.messages.resetGoogleSuccess' }));
      } else {
        message.error(intl.formatMessage({ id: 'userAdmin.messages.resetGoogleError' }));
      }
      setResetGoogleVisible(false);
    } catch (error) {
      message.error(intl.formatMessage({ id: 'userAdmin.messages.resetGoogleError' }));
    }
  };

  // 处理绑定谷歌验证
  const handleBindGoogleAuth = async (values: any) => {
    try {
      if (!editingRecord) return;

      const params = {
        googleCode: values.googleCode,
      };

      const res = await bindGoogleKey(params);
      if (res.code === '0') {
        message.success(intl.formatMessage({ id: 'userAdmin.messages.bindGoogleSuccess' }));
        setBindGoogleVisible(false);
        getUserList(); // 刷新列表
        clearAllCookies();
        window.location.reload();
      } else {
        message.error(
          res.message || intl.formatMessage({ id: 'userAdmin.messages.bindGoogleError' }),
        );
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'userAdmin.messages.bindGoogleError.detail' }), error);
      message.error(intl.formatMessage({ id: 'userAdmin.messages.bindGoogleError' }));
    }
  };

  const getRoleList = async () => {
    try {
      let data = {
        pageNo: 1,
        pageSize: 10000,
      };
      const res = await fetchRoleListApi(data);
      if (res?.data) {
        setRoleOptions(res.data.list || []);
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'userAdmin.messages.getRoleListError' }), error);
    }
  };

  useEffect(() => {
    getRoleList(); // 获取角色列表
  }, []);

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
          <Button
            key="create"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setModalVisible(true)}
          >
            {intl.formatMessage({ id: 'userAdmin.actions.create' })}
          </Button>,
        ]}
      />
      {/* 用户弹框 */}
      <UserModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialValues={editingRecord}
        setBindGoogleVisible={setBindGoogleVisible}
        setShowGoogleKey={setShowGoogleKey}
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
        showGoogleKey={showGoogleKey}
        onClose={() => setBindGoogleVisible(false)}
        onSubmit={handleBindGoogleAuth}
        userId={editingRecord?.id || null}
      />
    </PageContainer>
  );
};

export default UserAdmin;
