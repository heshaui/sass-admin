import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Table } from 'antd';

const RiskControlSuggestions: React.FC = () => {
  // 假设的表格数据和列定义
  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '建议类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <a>处理</a>
      ),
    },
  ];
  
  const data = [];
  
  return (
    <PageContainer>
      <Card title="处理建议" bordered={false}>
        <Table columns={columns} dataSource={data} rowKey="id" />
      </Card>
    </PageContainer>
  );
};

export default RiskControlSuggestions; 