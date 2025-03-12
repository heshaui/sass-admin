import React, { useState, useRef } from 'react';
import { Button, Space, message } from 'antd';
import { PageContainer,ProTable } from '@ant-design/pro-components';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { 
  getUserIdentityVerificationList, 
  getUserIdentityVerificationDetail,
  updateUserIdentityVerificationById 
} from '@/services/ant-design-pro/IdentityVerification';
import AuditDetailModal from './components/AuditDetailModal';

const AuditList: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const actionRef = useRef<ActionType>();
  
  const handleView = async (record: any) => {
    try {
      // 获取详细信息
      const detail = await getUserIdentityVerificationDetail({ id: record.id });
      setCurrentRecord(detail.data || record);
      setVisible(true);
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
    } catch (error) {
      message.error('操作失败');
      console.error(error);
    }
  };

  const handleSuccess = () => {
    setVisible(false);
    actionRef.current?.reload();
  };

  const columns: ProColumns<any>[] = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '用户名',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: '证件类型',
      dataIndex: 'cardType',
      key: 'cardType',
    },
    {
      title: '提交时间',
      dataIndex: 'currentCheckTime',
      key: 'currentCheckTime',
      valueType: 'dateTime',
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'authStatus',
      key: 'authStatus',
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
                onClick={() => handleView(record)}
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
    <PageContainer title="身份认证审核列表">
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
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: res.code==='0'?true:false,
            // 不传会使用 data 的长度，如果是分页一定要传
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
      
      <AuditDetailModal 
        visible={visible}
        record={currentRecord}
        onCancel={() => setVisible(false)}
        onSuccess={handleSuccess}
      />
    </PageContainer>
  );
};

export default AuditList; 