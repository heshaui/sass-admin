import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {  Form,Button, Select,message } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';

const { Option } = Select;

const AssetAdjustment: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = (values: any) => {
    setLoading(true);
    console.log('提交的数据:', values);
    
    // 这里添加调用API的逻辑
    setTimeout(() => {
      message.success('资产调整成功');
      form.resetFields();
      setLoading(false);
    }, 1000);
  };

  // 定义ProTable的列
  const columns: ProColumns[] = [
    { title: '编号', dataIndex: 'id', key: 'id', search: false },
    { 
      title: '币种', 
      dataIndex: 'currency', 
      key: 'currency',
      valueEnum: {
        'BTC': { text: 'BTC' },
        'ETH': { text: 'ETH' },
        'USDT': { text: 'USDT' },
      },
    },
    { title: '金额', dataIndex: 'amount', key: 'amount', search: false },
    { title: '备注', dataIndex: 'reason', key: 'reason' },
    { title: '操作人', dataIndex: 'operator', key: 'operator' },
    { 
      title: '时间', 
      dataIndex: 'operateTime', 
      key: 'operateTime',
      valueType: 'dateTime',
    },
  ];

  // 模拟数据
  const mockData = [
    { id: 10, currency: 'BTC', amount: '0.5', reason: '系统奖励', operator: '管理员', operateTime: '2023-06-15 10:30:45' },
    { id: 9, currency: 'ETH', amount: '2.0', reason: '活动奖励', operator: '管理员', operateTime: '2023-06-14 15:20:30' },
    // 可以添加更多模拟数据
  ];

  return (
    <PageContainer>
      <ProTable
        columns={columns}
        request={async (params, sorter, filter) => {
          // 这里可以替换为实际的API请求
          return {
            data: mockData,
            success: true,
            total: mockData.length,
          };
        }}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
        toolBarRender={() => [
          <Button key="button" type="primary">
            增减操作
          </Button>,
        ]}
        search={{
          labelWidth: 'auto',
        }}
      />
    </PageContainer>
  );
};

export default AssetAdjustment; 