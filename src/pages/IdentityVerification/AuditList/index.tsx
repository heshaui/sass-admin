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
      copyable: true,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '证件类型',
      dataIndex: 'idType',
      key: 'idType',
      valueEnum: {
        idcard: { text: '身份证' },
        passport: { text: '护照' },
        other: { text: '其他证件' },
      },
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      valueType: 'dateTime',
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        pending: { text: '待审核', status: 'warning' },
        approved: { text: '已通过', status: 'success' },
        rejected: { text: '已拒绝', status: 'error' },
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
            data: res.data.list || [],
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: res.success,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: res.data.total,
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