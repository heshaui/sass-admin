import React, { useState, useRef } from 'react';
import { Button, Space, message } from 'antd';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { CheckOutlined, CloseOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { 
  getUserIdentityVerificationList, 
  getUserIdentityVerificationDetail,
  updateUserIdentityVerificationById 
} from '@/services/ant-design-pro/IdentityVerification';
import AuditDetailCard from './components/AuditDetailModal';
import dayjs from 'dayjs';
import { useIntl } from 'umi';

const AuditList: React.FC = () => {
  const intl = useIntl();
  const [visible, setVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [showList, setShowList] = useState(true);
  const actionRef = useRef<ActionType>();
  
  const handleView = async (record: any) => {
    try {
      // 获取详细信息
      const detail = await getUserIdentityVerificationDetail({ id: record.id });
      setCurrentRecord(detail.data || record);
      setVisible(true);
      setShowList(false);
    } catch (error) {
      console.error(error);
      message.error(intl.formatMessage({ id: 'auditList.message.getDetailFailed' }));
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateUserIdentityVerificationById({
        id,
        status: 'approved',
      });
      message.success(intl.formatMessage({ id: 'auditList.message.approveSuccess' }));
      actionRef.current?.reload();
      setVisible(false);
      setShowList(true);
    } catch (error) {
      message.error(intl.formatMessage({ id: 'auditList.message.operationFailed' }));
      console.error(error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateUserIdentityVerificationById({
        id,
        status: 'rejected',
      });
      message.success(intl.formatMessage({ id: 'auditList.message.rejectSuccess' }));
      actionRef.current?.reload();
      setVisible(false);
      setShowList(true);
    } catch (error) {
      message.error(intl.formatMessage({ id: 'auditList.message.operationFailed' }));
      console.error(error);
    }
  };

  const handleSuccess = () => {
    setVisible(false);
    setShowList(true);
    actionRef.current?.reload();
  };

  const handleBackToList = () => {
    setVisible(false);
    setShowList(true);
  };

  const cardTitle = (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {!showList && (
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBackToList}
          style={{ marginRight: '12px', padding: 0 }}
        >
          {intl.formatMessage({ id: 'auditList.backToList' })}
        </Button>
      )}
      <span>{intl.formatMessage({ id: 'auditList.cardTitle' })}</span>
    </div>
  );

  const columns: ProColumns<any>[] = [
    {
      title: intl.formatMessage({ id: 'auditList.column.id' }),
      dataIndex: 'id',
      key: 'id',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'auditList.column.account' }),
      dataIndex: 'account',
      key: 'account',
      hideInTable: true,
    },
    {
      title: intl.formatMessage({ id: 'auditList.column.userId' }),
      dataIndex: 'userId',
      key: 'userId',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'auditList.column.realName' }),
      search: false,
      renderText: (record: any) => {
        return record?.firstName + ' ' + record?.surname;
      },
    },
    {
      title: intl.formatMessage({ id: 'auditList.column.country' }),
      dataIndex: 'country',
      key: 'country',
      search: false,
    },
    // {
    //   title: intl.formatMessage({ id: 'auditList.column.cardType' }),
    //   dataIndex: 'cardType',
    //   key: 'cardType',
    // },
    {
      title: intl.formatMessage({ id: 'auditList.column.createTime' }),
      dataIndex: 'createTime',
      key: 'createTime',
      valueType: 'dateTime',

      
    },
    {
      title: intl.formatMessage({ id: 'auditList.column.firstCheckTime' }),
      dataIndex: 'firstCheckTime',
      key: 'firstCheckTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'auditList.column.currentCheckTime' }),
      dataIndex: 'currentCheckTime',
      key: 'currentCheckTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'auditList.column.authStatus' }),
      dataIndex: 'authStatus',
      key: 'authStatus',
      valueEnum:{
        0: intl.formatMessage({ id: 'auditList.status.rejected' }),
        1: intl.formatMessage({ id: 'auditList.status.approved' }),
        2: intl.formatMessage({ id: 'auditList.status.pending' }),
        3: intl.formatMessage({ id: 'auditList.status.pending' })
      },
      renderText: (text: number) => {
        return text === 0 ? intl.formatMessage({ id: 'auditList.status.rejected' }) : 
               text === 1 ? intl.formatMessage({ id: 'auditList.status.approved' }) : 
               text === 2 || text === 3 ? intl.formatMessage({ id: 'auditList.status.pending' }) : '';
      },
    },
    {
      title: intl.formatMessage({ id: 'auditList.column.action' }),
      key: 'action',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />} 
            onClick={() => handleView(record)}
          >
            {intl.formatMessage({ id: 'auditList.button.view' })}
          </Button>
          {record.status === 'pending' && (
            <>
              <Button 
                type="primary" 
                size="small" 
                icon={<CheckOutlined />} 
                onClick={() => handleApprove(record.id)}
              >
                {intl.formatMessage({ id: 'auditList.button.approve' })}
              </Button>
              <Button 
                danger 
                size="small" 
                icon={<CloseOutlined />} 
                onClick={() => handleReject(record.id)}
              >
                {intl.formatMessage({ id: 'auditList.button.reject' })}
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      {showList && (
        <ProTable<any>
          headerTitle={intl.formatMessage({ id: 'auditList.title' })}
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 120,
          }}
          request={async (params, sorter, filter) => {
            // 转换为后端接口需要的参数格式
            const queryParams = {
              pageSize: params.pageSize,
              pageNo: params.current,
              ...params,
              // 处理时间字段，转换为时间戳格式
              createTime: params.createTime ? dayjs(params.createTime).valueOf() : undefined,
              // 处理排序
              sorter: sorter && Object.keys(sorter).length ? JSON.stringify(sorter) : undefined,
              filter: filter && Object.keys(filter).length ? JSON.stringify(filter) : undefined,
            };
            
            const res = await getUserIdentityVerificationList(queryParams);
            return {
              data: res.data || [],
              success: res.code==='0'?true:false,
              total: res.data.length,
            };
          }}
          columns={columns}
          tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
            <Space>
              <span>{intl.formatMessage({ id: 'auditList.tableAlert.selected' }, { count: selectedRowKeys.length })}</span>
              <Button type="link" onClick={onCleanSelected}>{intl.formatMessage({ id: 'auditList.button.cancelSelection' })}</Button>
            </Space>
          )}
        />
      )}
      
      {visible && (
        <AuditDetailCard
          visible={visible}
          record={currentRecord}
          onClose={handleBackToList}
          onSuccess={handleSuccess}
          title={cardTitle}
        />
      )}
    </PageContainer>
  );
};

export default AuditList; 