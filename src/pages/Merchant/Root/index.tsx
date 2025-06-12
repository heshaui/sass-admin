import React, { useEffect, useState } from 'react';
import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import { Space, message, Modal } from 'antd';
import { useIntl } from '@umijs/max';
import RootModal from './component/RootModal';
import {
  tenantRootList,
  updatePasswordById,
  updateGoogleById,
  updateTenantRootById,
  updateRoleById,
} from '@/services/ant-design-pro/merchant';

const Root: React.FC = () => {
  const intl = useIntl();
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);

  const getList = async (params: any = {}) => {
    const { current, pageSize, ...restParams } = params;
    let data = {
      pageNo: current || 1,
      pageSize: pageSize || 10,
      ...restParams,
    };
    const res = await tenantRootList(data);
    if (res.code === '0') {
      setDataSource(res.data.list);
      return {
        data: res.data.list,
        success: true,
        total: res.data.count,
      };
    } else {
      message.error(intl.formatMessage({ id: 'merchant.message.fetchListFailed' }));
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  const resetPassword = async (id: string) => {
    Modal.confirm({
      title: intl.formatMessage({ id: 'merchant.message.resetPassword' }),
      content: intl.formatMessage({ id: 'merchant.message.resetPasswordConfirm' }),
      okText: intl.formatMessage({ id: 'merchant.common.confirm' }),
      cancelText: intl.formatMessage({ id: 'merchant.common.cancel' }),
      onOk: async () => {
        const res = await updatePasswordById(id);
        if (res.code === '0') {
          message.success(intl.formatMessage({ id: 'merchant.message.resetPasswordSuccess' }));
        } else {
          message.error(intl.formatMessage({ id: 'merchant.message.resetPasswordFailed' }));
        }
      },
    });
  };

  const resetGoogle = async (id: string) => {
    Modal.confirm({
      title: intl.formatMessage({ id: 'merchant.message.resetGoogle' }),
      content: intl.formatMessage({ id: 'merchant.message.resetGoogleConfirm' }),
      okText: intl.formatMessage({ id: 'merchant.common.confirm' }),
      cancelText: intl.formatMessage({ id: 'merchant.common.cancel' }),
      onOk: async () => {
        const res = await updateGoogleById(id);
        if (res.code === '0') {
          message.success(intl.formatMessage({ id: 'merchant.message.resetGoogleSuccess' }));
        } else {
          message.error(intl.formatMessage({ id: 'merchant.message.resetGoogleFailed' }));
        }
      },
    });
  };

  const changeStatus = async (id: string, status: number) => {
    Modal.confirm({
      title:
        status === 1
          ? intl.formatMessage({ id: 'merchant.message.confirmEnableLogin' })
          : intl.formatMessage({ id: 'merchant.message.confirmDisableLogin' }),
      content:
        status === 1
          ? intl.formatMessage({ id: 'merchant.message.enableLoginConfirm' })
          : intl.formatMessage({ id: 'merchant.message.disableLoginConfirm' }),
      okText: intl.formatMessage({ id: 'merchant.common.confirm' }),
      cancelText: intl.formatMessage({ id: 'merchant.common.cancel' }),
      onOk: async () => {
        let data = {
          id: id,
          status: status,
        };
        const res = await updateTenantRootById(data);
        if (res.code === '0') {
          if (status === 1) {
            message.success(intl.formatMessage({ id: 'merchant.message.enableLoginSuccess' }));
          } else {
            message.success(intl.formatMessage({ id: 'merchant.message.disableLoginSuccess' }));
          }
          await getList();
        } else {
          message.error(intl.formatMessage({ id: 'merchant.message.updateStatusFailed' }));
        }
      },
    });
  };
  // **角色分配**
  const handleRoleAssign = (record: any) => {
    setCurrentRecord(record);
    setModalVisible(true);
  };

  // **提交角色分配**
  const handleRoleSubmit = async (roleId: string) => {
    try {
      const data = { id: currentRecord.id, roleIds: roleId };
      const res = await updateRoleById(data);
      console.log(res);
      if (res.code === '0') {
        message.success(intl.formatMessage({ id: 'merchant.message.roleAssignSuccess' }));
        getList();
      } else {
        message.error(intl.formatMessage({ id: 'merchant.message.roleAssignFailed' }));
      }
    } catch (error) {
      console.error(error);
      message.error(intl.formatMessage({ id: 'merchant.message.roleAssignError' }));
    } finally {
      setModalVisible(false);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  // **表格列配置**
  const columns: ProColumns<any>[] = [
    {
      title: intl.formatMessage({ id: 'merchant.table.id' }),
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({ id: 'merchant.table.exchangeName' }),
      dataIndex: 'tenantName',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'merchant.common.status' }),
      dataIndex: 'status',
      search: false,
      render: (_, record) => {
        return record.status === 1
          ? intl.formatMessage({ id: 'merchant.status.normal' })
          : intl.formatMessage({ id: 'merchant.status.frozen' });
      },
    },
    {
      title: intl.formatMessage({ id: 'merchant.table.contact' }),
      dataIndex: 'tenantContact',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'merchant.table.email' }),
      dataIndex: 'email',
    },
    {
      title: intl.formatMessage({ id: 'merchant.table.phone' }),
      dataIndex: 'phone',
    },
    {
      title: intl.formatMessage({ id: 'merchant.common.status' }),
      dataIndex: 'status',
      valueType: 'select',
      render: (_, record) => {
        return record.status === 1
          ? intl.formatMessage({ id: 'merchant.status.normal' })
          : intl.formatMessage({ id: 'merchant.status.banned' });
      },
      valueEnum: {
        [intl.formatMessage({ id: 'merchant.status.normal' })]: {
          text: intl.formatMessage({ id: 'merchant.status.normal' }),
          status: '1',
        },
        [intl.formatMessage({ id: 'merchant.status.banned' })]: {
          text: intl.formatMessage({ id: 'merchant.status.banned' }),
          status: '0',
        },
      },
    },
    {
      title: intl.formatMessage({ id: 'merchant.common.createTime' }),
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'merchant.common.operation' }),
      dataIndex: 'action',
      search: false,
      render: (_, record) => (
        <Space>
          {record.status === 1 ? (
            <a style={{ color: 'red' }} onClick={() => changeStatus(record.id, 0)}>
              {intl.formatMessage({ id: 'merchant.action.banLogin' })}
            </a>
          ) : (
            <a style={{ color: 'green' }} onClick={() => changeStatus(record.id, 1)}>
              {intl.formatMessage({ id: 'merchant.action.allowLogin' })}
            </a>
          )}
          <a onClick={() => resetPassword(record.id)}>
            {intl.formatMessage({ id: 'merchant.action.resetPassword' })}
          </a>
          <a onClick={() => resetGoogle(record.id)}>
            {intl.formatMessage({ id: 'merchant.action.resetGoogle' })}
          </a>
          <a onClick={() => handleRoleAssign(record)}>
            {intl.formatMessage({ id: 'merchant.action.assignRole' })}
          </a>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      {/* 表格 */}
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 10 }}
        search={{ labelWidth: 'auto' }}
        request={getList}
        toolBarRender={() => []}
      />

      <RootModal
        visible={modalVisible}
        currentRecord={currentRecord}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleRoleSubmit}
      />
    </PageContainer>
  );
};

export default Root;
