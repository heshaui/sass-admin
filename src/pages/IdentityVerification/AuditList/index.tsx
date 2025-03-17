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

const AuditList: React.FC = () => {
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
      message.error('获取详情失败');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateUserIdentityVerificationById({
        id,
        status: 'approved',
      });
      message.success('已通过审核');
      actionRef.current?.reload();
      setVisible(false);
      setShowList(true);
    } catch (error) {
      message.error('操作失败');
      console.error(error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateUserIdentityVerificationById({
        id,
        status: 'rejected',
      });
      message.success('已拒绝审核');
      actionRef.current?.reload();
      setVisible(false);
      setShowList(true);
    } catch (error) {
      message.error('操作失败');
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
          返回列表
        </Button>
      )}
      <span>审核详情</span>
    </div>
  );

  const columns: ProColumns<any>[] = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      search: false,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      search: false,
    },
    {
      title: '真实姓名',
      search: false,
      renderText: (record: any) => {
        return record?.firstName + ' ' + record?.surname;
      },
    },
    {
      title: '国家/地区',
      dataIndex: 'countryId',
      key: 'countryId',
      search: false,
    },
    // {
    //   title: '证件类型',
    //   dataIndex: 'cardType',
    //   key: 'cardType',
    // },
    {
      title: '提交时间',
      dataIndex: 'currentCheckTime',
      key: 'currentCheckTime',
      valueType: 'dateTime',
    },
    {
      title: '首次审核时间',
      dataIndex: 'currentCheckTime',
      key: 'currentCheckTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '最近审核时间',
      dataIndex: 'currentCheckTime',
      key: 'currentCheckTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '认证状态',
      dataIndex: 'authStatus',
      key: 'authStatus',
      valueEnum:{
        0:'驳回',
        1:'通过',
        2:'未审核'
      },
      renderText: (text: number) => {
        return text === 0 ? '驳回' : text === 1 ? '通过' : '未审核';
      },
    },
    {
      title: '操作',
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
            查看
          </Button>
          {record.status === 'pending' && (
            <>
              <Button 
                type="primary" 
                size="small" 
                icon={<CheckOutlined />} 
                onClick={() => handleApprove(record.id)}
              >
                通过
              </Button>
              <Button 
                danger 
                size="small" 
                icon={<CloseOutlined />} 
                onClick={() => handleReject(record.id)}
              >
                拒绝
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
          headerTitle="审核列表"
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
              <span>已选择 {selectedRowKeys.length} 项</span>
              <Button type="link" onClick={onCleanSelected}>取消选择</Button>
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