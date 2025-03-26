import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table } from 'antd';

const RiskControlAlerts: React.FC = () => {
  // 假设的表格数据和列定义
  const columns = [
    {
      title: '报警ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '报警类型',
      dataIndex: 'alertType',
      key: 'alertType',
    },
    {
      title: '报警内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '触发时间',
      dataIndex: 'triggerTime',
      key: 'triggerTime',
    },
    {
      title: '处理状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <a>查看详情</a>
      ),
    },
  ];
  
  const data = [];
  
  return (
    <PageContainer>
      <Card title="报警记录" bordered={false}>
        <Table columns={columns} dataSource={data} rowKey="id" />
      </Card>
    </PageContainer>
  );
};

export default RiskControlAlerts; 