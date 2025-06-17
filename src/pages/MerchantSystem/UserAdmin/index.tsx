import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Dropdown, Menu, Button, Tag, message, Modal } from 'antd';
import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import { useState, useEffect, useCallback } from 'react';
import { useIntl } from '@umijs/max';
import { relieveGoogleKey } from '@/services/ant-design-pro/authAdmin';
import {
  getTenantEmployeeList,
  saveTenantEmployee,
  restPasswordTenantEmployee,
  deleteTenantEmployeeById,
  updateTenantEmployeeById,
} from '@/services/ant-design-pro/merchantSystem';
import { getTenantRoleList } from '@/services/ant-design-pro/merchantSystem';
import UserModal from './component/UserModal';
import ResetPasswordModal from './component/ResetPasswordModal';
import ResetGoogleModal from './component/ResetGoogleModal';

interface UserRecord {
  id: number;
  nickname: string;
  role: number;
  phone: string;
  email: string;
  googleCode: string;
  status: number;
}

interface RoleOption {
  roleId: number;
  roleName: string;
}

const UserAdmin: React.FC = () => {
  const intl = useIntl();
  const [data, setData] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false);
  const [resetGoogleVisible, setResetGoogleVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<UserRecord | null>(null);
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
  const [pagination, setPagination] = useState({
    pageNo: 1, // 当前页
    pageSize: 10, // 每页显示条数
    count: 0, // 总数
  });

  // 获取角色列表
  const getRoleList = useCallback(async () => {
    try {
      const res = await getTenantRoleList({
        pageNo: pagination.pageNo,
        pageSize: pagination.pageSize,
      });
      if (res.code === '0') {
        setRoleOptions(res.data?.list || []);
        setPagination((prev) => ({
          ...prev,
          count: res.data?.count || 0,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      message.error(
        intl.formatMessage({ id: 'merchantSystem.userAdmin.message.fetchRoles.failed' }),
      );
    }
  }, [intl]);

  // 获取用户列表
  const getUserList = useCallback(
    async (params: any = {}) => {
      setLoading(true);
      try {
        const queryParams = {
          pageNo: params.pageNo || pagination.pageNo,
          pageSize: params.pageSize || pagination.pageSize,
          phone: params.phone,
          email: params.email,
          nickname: params.nickname,
          role: params.role,
          status: params.status,
        };

        const res = await getTenantEmployeeList(queryParams);
        if (res?.data) {
          setData(res.data.list || []);
          setPagination({
            pageNo: queryParams.pageNo,
            pageSize: queryParams.pageSize,
            count: res.data.count || 0,
          });
        }
        return {
          data: res?.data?.list || [],
          count: res?.data?.count || 0,
          success: true,
        };
      } catch (error) {
        console.error('Failed to fetch users:', error);
        message.error(
          intl.formatMessage({ id: 'merchantSystem.userAdmin.message.fetchUsers.failed' }),
        );
        return {
          data: [],
          count: 0,
          success: false,
        };
      } finally {
        setLoading(false);
      }
    },
    [intl, pagination.pageNo, pagination.pageSize],
  );

  // 初始化数据
  useEffect(() => {
    getRoleList();
  }, []);

  // 编辑用户
  const handleEdit = (record: UserRecord) => {
    setEditingRecord(record);
    setModalVisible(true);
  };

  // 删除用户
  const handleDelete = async (userId: number) => {
    Modal.confirm({
      title: intl.formatMessage({ id: 'merchantSystem.userAdmin.modal.delete.title' }),
      content: intl.formatMessage({ id: 'merchantSystem.userAdmin.modal.delete.content' }),
      onOk: async () => {
        try {
          const res = await deleteTenantEmployeeById({ userId });
          if (res.code === '0') {
            message.success(
              intl.formatMessage({ id: 'merchantSystem.userAdmin.message.deleteUser.success' }),
            );
            getUserList();
          } else {
            throw new Error(res.message);
          }
        } catch (error) {
          message.error(
            intl.formatMessage({ id: 'merchantSystem.userAdmin.message.deleteUser.failed' }),
          );
        }
      },
    });
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    try {
      let res;
      if (editingRecord) {
        res = await updateTenantEmployeeById({ ...editingRecord, ...values });
      } else {
        res = await saveTenantEmployee(values);
      }

      if (res.code === '0') {
        message.success(
          intl.formatMessage({
            id: editingRecord
              ? 'merchantSystem.userAdmin.message.editUser.success'
              : 'merchantSystem.userAdmin.message.createUser.success',
          }),
        );
        setModalVisible(false);
        setEditingRecord(null);
        getUserList();
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      message.error(
        intl.formatMessage({ id: 'merchantSystem.userAdmin.message.operation.failed' }),
      );
    }
  };

  // 重置密码
  const handleResetPassword = async () => {
    if (!editingRecord) return;

    try {
      const res = await restPasswordTenantEmployee({ id: editingRecord.id });
      if (res.code === '0') {
        message.success(
          intl.formatMessage({ id: 'merchantSystem.userAdmin.message.resetPassword.success' }),
        );
        setResetPasswordVisible(false);
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      message.error(
        intl.formatMessage({ id: 'merchantSystem.userAdmin.message.resetPassword.failed' }),
      );
    }
  };

  // 重置谷歌验证
  const handleResetGoogleAuth = async () => {
    if (!editingRecord) return;

    try {
      const res = await relieveGoogleKey({ id: editingRecord.id });
      if (res.code === '0') {
        message.success(
          intl.formatMessage({ id: 'merchantSystem.userAdmin.message.resetGoogle.success' }),
        );
        setResetGoogleVisible(false);
        getUserList();
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      message.error(
        intl.formatMessage({ id: 'merchantSystem.userAdmin.message.resetGoogle.failed' }),
      );
    }
  };

  // 表格列配置
  const columns = [
    {
      title: intl.formatMessage({ id: 'language.table.column.index' }),
      key: 'index',
      render: (_: any, __: any, index: number) =>
        (pagination.pageNo - 1) * pagination.pageSize + index + 1,
      search: false,
      width: 80,
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.userAdmin.column.nickname' }),
      dataIndex: 'nickname',
      key: 'nickname',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.userAdmin.column.role' }),
      dataIndex: 'role',
      key: 'role',
      search: false,
      render: (_: any, record: UserRecord) => {
        const role = roleOptions.find((r) => Number(r.roleId) === Number(record.role));
        return role?.roleName || record.role;
      },
      filters: roleOptions.map((role) => ({
        text: role.roleName,
        value: role.roleId,
      })),
      onFilter: (value: any, record: UserRecord) => Number(record.role) === Number(value),
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.userAdmin.column.phone' }),
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.userAdmin.column.email' }),
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => email || '--',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.userAdmin.column.2fa' }),
      dataIndex: 'googleCode',
      key: 'googleCode',
      search: false,
      render: (_: any, record: UserRecord) => (
        <Tag color={record.googleCode && record.googleCode !== '-' ? 'green' : 'red'}>
          {intl.formatMessage({
            id:
              record.googleCode && record.googleCode !== '-'
                ? 'merchantSystem.userAdmin.status.enabled'
                : 'merchantSystem.userAdmin.status.disabled',
          })}
        </Tag>
      ),
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.userAdmin.column.status' }),
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        0: {
          text: intl.formatMessage({ id: 'merchantSystem.userAdmin.status.disabled.label' }),
          status: 'Error',
        },
        1: {
          text: intl.formatMessage({ id: 'merchantSystem.userAdmin.status.normal' }),
          status: 'Success',
        },
      },
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.userAdmin.column.operations' }),
      key: 'action',
      search: false,
      fixed: 'right',
      width: 150,
      render: (_: any, record: UserRecord) => (
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
                  setResetPasswordVisible(true);
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
            {intl.formatMessage({ id: 'merchantSystem.userAdmin.button.operations' })}
            <DownOutlined />
          </Button>
        </Dropdown>
      ),
    },
  ];

  useEffect(() => {
    getUserList(); // 获取用户列表
  }, []);

  return (
    <PageContainer>
      <ProTable<UserRecord>
        rowKey="id"
        columns={columns}
        scroll={{ x: 'max-content' }}
        dataSource={data}
        loading={loading}
        request={(params) => getUserList(params)}
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false,
        }}
        options={{
          density: false,
          fullScreen: true,
          reload: () => getUserList(),
          setting: true,
        }}
        pagination={{
          current: pagination.pageNo,
          pageSize: pagination.pageSize,
          total: pagination.count,
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setPagination((prev) => ({ ...prev, pageNo: page, pageSize, count: pagination.count }));
          },
        }}
        toolBarRender={() => [
          <Button
            key="create"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setEditingRecord(null);
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
    </PageContainer>
  );
};

export default UserAdmin;
