import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Form, Input, Button, Select, InputNumber, message, Table, Space, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

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

  const items: TabsProps['items'] = [
    {
      key: 'increase',
      label: '增加资产',
      icon: <PlusOutlined />,
      children: (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ operation: 'increase' }}
        >
          <Form.Item name="operation" hidden>
            <Input />
          </Form.Item>
          
          <Form.Item
            name="userId"
            label="用户ID"
            rules={[{ required: true, message: '请输入用户ID' }]}
          >
            <Input placeholder="请输入用户ID或用户名" />
          </Form.Item>
          
          <Form.Item
            name="currency"
            label="币种"
            rules={[{ required: true, message: '请选择币种' }]}
          >
            <Select placeholder="请选择币种">
              <Option value="BTC">BTC</Option>
              <Option value="ETH">ETH</Option>
              <Option value="USDT">USDT</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="amount"
            label="数量"
            rules={[{ required: true, message: '请输入数量' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入增加数量" />
          </Form.Item>
          
          <Form.Item
            name="reason"
            label="原因"
            rules={[{ required: true, message: '请输入原因' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入调整原因" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'decrease',
      label: '减少资产',
      icon: <MinusOutlined />,
      children: (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ operation: 'decrease' }}
        >
          <Form.Item name="operation" hidden>
            <Input />
          </Form.Item>
          
          <Form.Item
            name="userId"
            label="用户ID"
            rules={[{ required: true, message: '请输入用户ID' }]}
          >
            <Input placeholder="请输入用户ID或用户名" />
          </Form.Item>
          
          <Form.Item
            name="currency"
            label="币种"
            rules={[{ required: true, message: '请选择币种' }]}
          >
            <Select placeholder="请选择币种">
              <Option value="BTC">BTC</Option>
              <Option value="ETH">ETH</Option>
              <Option value="USDT">USDT</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="amount"
            label="数量"
            rules={[{ required: true, message: '请输入数量' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入减少数量" />
          </Form.Item>
          
          <Form.Item
            name="reason"
            label="原因"
            rules={[{ required: true, message: '请输入原因' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入调整原因" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'history',
      label: '操作记录',
      children: (
        <Table
          columns={[
            { title: '操作ID', dataIndex: 'id', key: 'id' },
            { title: '用户ID', dataIndex: 'userId', key: 'userId' },
            { title: '操作类型', dataIndex: 'type', key: 'type' },
            { title: '币种', dataIndex: 'currency', key: 'currency' },
            { title: '数量', dataIndex: 'amount', key: 'amount' },
            { title: '原因', dataIndex: 'reason', key: 'reason' },
            { title: '操作人', dataIndex: 'operator', key: 'operator' },
            { title: '操作时间', dataIndex: 'operateTime', key: 'operateTime' },
          ]} 
          dataSource={[]} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <Card>
        <Tabs defaultActiveKey="increase" items={items} />
      </Card>
    </PageContainer>
  );
};

export default AssetAdjustment; 