import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Form, Input, Button, Select, InputNumber, message, Table, Divider } from 'antd';
import { SwapOutlined } from '@ant-design/icons';

const { Option } = Select;

const TransferTool: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [transferRecords, setTransferRecords] = useState<any[]>([]);

  const onFinish = (values: any) => {
    setLoading(true);
    console.log('提交的转账数据:', values);
    
    // 模拟API调用
    setTimeout(() => {
      message.success('转账申请已提交');
      
      // 添加到转账记录
      const newRecord = {
        id: Date.now().toString(),
        fromUser: values.fromUser,
        toUser: values.toUser,
        currency: values.currency,
        amount: values.amount,
        reason: values.reason,
        status: '成功',
        operateTime: new Date().toLocaleString(),
      };
      
      setTransferRecords([newRecord, ...transferRecords]);
      form.resetFields();
      setLoading(false);
    }, 1000);
  };

  const columns = [
    { title: '转账ID', dataIndex: 'id', key: 'id' },
    { title: '转出用户', dataIndex: 'fromUser', key: 'fromUser' },
    { title: '转入用户', dataIndex: 'toUser', key: 'toUser' },
    { title: '币种', dataIndex: 'currency', key: 'currency' },
    { title: '数量', dataIndex: 'amount', key: 'amount' },
    { title: '原因', dataIndex: 'reason', key: 'reason' },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { title: '操作时间', dataIndex: 'operateTime', key: 'operateTime' },
  ];

  return (
    <PageContainer>
      <Card title="用户间转账">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="fromUser"
            label="转出用户"
            rules={[{ required: true, message: '请输入转出用户ID' }]}
          >
            <Input placeholder="请输入转出用户ID或用户名" />
          </Form.Item>
          
          <Form.Item
            name="toUser"
            label="转入用户"
            rules={[{ required: true, message: '请输入转入用户ID' }]}
          >
            <Input placeholder="请输入转入用户ID或用户名" />
          </Form.Item>
          
          <Form.Item
            name="currency"
            label="币种"
            rules={[{ required: true, message: '请选择币种' }]}
          >
            <Select placeholder="请选择转账币种">
              <Option value="BTC">BTC</Option>
              <Option value="ETH">ETH</Option>
              <Option value="USDT">USDT</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="amount"
            label="转账数量"
            rules={[{ required: true, message: '请输入转账数量' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入转账数量" />
          </Form.Item>
          
          <Form.Item
            name="reason"
            label="转账原因"
            rules={[{ required: true, message: '请输入转账原因' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入转账原因" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} icon={<SwapOutlined />}>
              提交转账申请
            </Button>
          </Form.Item>
        </Form>
      </Card>
      
      <Divider />
      
      <Card title="转账记录">
        <Table 
          columns={columns} 
          dataSource={transferRecords} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </PageContainer>
  );
};

export default TransferTool; 