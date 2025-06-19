import React, { useState } from 'react';
import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import { Button, Space, Modal, message, Form } from 'antd';
import { useIntl } from '@umijs/max';
import MerchantEdit from './component/MerchantEdit';
import ServerAdmin from './component/ServerAdmin';
import ConvertToPaid from './component/ConvertToPaid';
import {
  saveTenant,
  tenantList,
  updateTenantById,
  saveTenantRoot,
  updatePaymentStatusById,
} from '@/services/ant-design-pro/merchant';
import dayjs from 'dayjs';

const Free: React.FC = () => {
  const intl = useIntl();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [serverModalVisible, setServerModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [convertModalVisible, setConvertModalVisible] = useState(false);
  const [merchantData, setMerchantData] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [form] = Form.useForm();

  // **获取商户列表**
  const fetchMerchantList = async (params?: any) => {
    setLoading(true);
    try {
      const res = await tenantList({
        pageNo: params.current || 1,
        pageSize: params.pageSize || 10,
        tenantId: params.tenantId,
        tenantName: params.tenantName,
        tenantStatus: params.tenantStatus,
      });
      if (res.code === '0') {
        setMerchantData(res.data.list || []);
        setPagination({
          ...pagination,
          current: params.current || 1,
          total: res.data.count || 0,
        });
      } else {
        message.error(intl.formatMessage({ id: 'free.message.fetchMerchantFailed' }));
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'free.message.requestError' }));
    } finally {
      setLoading(false);
    }
  };

  // **打开编辑弹窗**
  const handleEdit = (record: any) => {
    setIsCreating(false);
    setCurrentRecord(record);
    setEditModalVisible(true);
  };

  // **打开新建弹窗**
  const handleCreate = () => {
    setIsCreating(true);
    setCurrentRecord(null);
    setEditModalVisible(true);
  };

  // **关闭模态框时清除表单内容**
  const handleCloseModal = () => {
    setEditModalVisible(false);
    setCurrentRecord(null);
  };

  // **打开服务器管理弹窗**
  const handleServerConfig = (record: any) => {
    setCurrentRecord(record);
    setServerModalVisible(true);
  };

  // **提交商户表单**
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (isCreating) {
        await saveTenant(values);
        message.success(intl.formatMessage({ id: 'free.message.createSuccess' }));
      } else {
        await updateTenantById(values);
        message.success(intl.formatMessage({ id: 'free.message.updateSuccess' }));
      }

      // 重新获取列表数据
      fetchMerchantList();

      // 关闭弹窗
      handleCloseModal();

      // 如果是新建模式，直接重置表单
      if (isCreating) {
        form.resetFields();
      }
    } catch (error) {
      message.error(
        intl.formatMessage({ id: 'free.message.operationFailed' }) +
          '：' +
          (error as Error)?.message,
      );
    } finally {
      setLoading(false);
    }
  };

  // **提交服务器配置**
  const handleServerSubmit = async (values: any) => {
    let data = {
      tenantId: currentRecord.tenantId,
      tenantHost: values.tenantHost,
    };
    let res = await updateTenantById(data);
    if (res.code === '0') {
      message.success(intl.formatMessage({ id: 'free.message.serverConfigUpdated' }));
      setServerModalVisible(false);
    } else {
      message.error(res.message);
    }
  };

  const handleConvertToPaid = (record: any) => {
    setCurrentRecord(record);
    setConvertModalVisible(true);
  };

  // **提交 "转为正式商户" 操作**
  const handleConvertSubmit = async (values: any) => {
    // console.log("转为正式商户:", values);
    //
    let data = {
      tenantId: currentRecord.tenantId,
      paymentStatus: 1,
      tenantEndTime: dayjs(values.tenantEndTime).valueOf(),
    };
    let res = await updatePaymentStatusById(data);
    if (res.code === '0') {
      message.success(intl.formatMessage({ id: 'free.message.convertSuccess' }));
      setConvertModalVisible(false);
      fetchMerchantList();
    } else {
      message.error(res.message);
    }
  };

  const handleSave = async (record: any) => {
    Modal.confirm({
      title: intl.formatMessage({ id: 'free.modal.createRoot.title' }),
      content: intl.formatMessage({ id: 'free.modal.createRoot.content' }),
      onOk: async () => {
        let data = {
          tenantId: record.tenantId,
          email: record.tenantEmail,
          phone: record.tenantPhone,
          nickname: record.tenantContact,
        };
        const res = await saveTenantRoot(data);
        if (res.code === '0') {
          message.success(intl.formatMessage({ id: 'free.message.rootAccountCreated' }));
        } else {
          message.error(intl.formatMessage({ id: 'free.message.rootAccountFailed' }));
        }
      },
      onCancel() {
        // 用户取消操作
      },
    });
  };

  // **表格列配置**
  const columns: ProColumns<any>[] = [
    { title: intl.formatMessage({ id: 'free.table.merchantId.column' }), dataIndex: 'tenantId' },
    {
      title: intl.formatMessage({ id: 'free.table.exchangeName.column' }),
      dataIndex: 'tenantName',
    },
    {
      title: intl.formatMessage({ id: 'free.table.contact.column' }),
      dataIndex: 'tenantContact',
      search: false, // 禁用搜索
    },
    {
      title: intl.formatMessage({ id: 'free.table.serviceTime.column' }),
      dataIndex: 'serviceTime',
      search: false, // 禁用搜索
      render: (_, record) => (
        <div>
          <div>
            {intl.formatMessage({ id: 'free.table.registrationTime.label' })}：
            {record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') : '--'}
          </div>
          <div>
            {intl.formatMessage({ id: 'free.table.activationTime.label' })}：
            {record.tenantStartTime
              ? dayjs(record.tenantStartTime).format('YYYY-MM-DD HH:mm:ss')
              : '--'}
          </div>
          <div>
            {intl.formatMessage({ id: 'free.table.expiryTime.label' })}：
            {record.tenantEndTime
              ? dayjs(record.tenantEndTime).format('YYYY-MM-DD HH:mm:ss')
              : '--'}
          </div>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'free.table.serviceStatus' }),
      dataIndex: 'tenantStatus',
      valueType: 'select',
      valueEnum: {
        1: { text: intl.formatMessage({ id: 'free.table.serviceStatus.notStarted' }) },
        0: { text: intl.formatMessage({ id: 'free.table.serviceStatus.overdue' }) },
      },
      render: (_, record) => (
        <div>
          {record.tenantStatus === 1
            ? intl.formatMessage({ id: 'free.table.serviceStatus.notStarted' })
            : intl.formatMessage({ id: 'free.table.serviceStatus.overdue' })}
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'free.table.paymentStatus' }),
      dataIndex: 'paymentStatus',
      search: false,
      render: (_, record) => {
        if (record.paymentStatus === 1) {
          return <div>{intl.formatMessage({ id: 'free.table.paymentStatus.paid' })}</div>;
        } else {
          return <div>{intl.formatMessage({ id: 'free.table.paymentStatus.notStarted' })}</div>;
        }
      },
    },
    {
      title: intl.formatMessage({ id: 'free.table.action' }),
      search: false,
      dataIndex: 'action',
      render: (_, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>
            {intl.formatMessage({ id: 'free.table.action.edit' })}
          </a>
          {record.paymentStatus !== 1 ? (
            <a onClick={() => handleConvertToPaid(record)}>
              {intl.formatMessage({ id: 'free.table.action.convert' })}
            </a>
          ) : (
            ''
          )}
          <a onClick={() => handleServerConfig(record)}>
            {intl.formatMessage({ id: 'free.table.action.serverConfig' })}
          </a>
          {!record.isRootTenant && (
            <a onClick={() => handleSave(record)}>
              {intl.formatMessage({ id: 'free.table.action.createRoot' })}
            </a>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      {/* 表格 */}
      <ProTable
        rowKey="tenantId"
        columns={columns}
        dataSource={merchantData}
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => {
            fetchMerchantList({ current: page, pageSize });
          },
        }}
        search={{ labelWidth: 'auto' }}
        request={async (params) => {
          await fetchMerchantList(params);
          return {
            data: merchantData,
            success: true,
            total: pagination.total,
          };
        }}
        toolBarRender={() => [
          <Button type="primary" key="new" onClick={handleCreate}>
            + {intl.formatMessage({ id: 'free.button.new' })}
          </Button>,
        ]}
      />

      {/* 商户编辑弹窗 */}
      <Modal
        title={intl.formatMessage({
          id: isCreating ? 'free.modal.createTitle' : 'free.modal.editTitle',
        })}
        open={editModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
        destroyOnClose={true}
      >
        <MerchantEdit
          form={form}
          record={currentRecord}
          isCreating={isCreating}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* 服务器管理弹窗 */}
      <ServerAdmin
        visible={serverModalVisible}
        onCancel={() => setServerModalVisible(false)}
        onSubmit={handleServerSubmit}
        initialValues={currentRecord}
      />
      <ConvertToPaid
        visible={convertModalVisible}
        onCancel={() => setConvertModalVisible(false)}
        onSubmit={handleConvertSubmit}
        initialValues={currentRecord}
      />
    </PageContainer>
  );
};

export default Free;
