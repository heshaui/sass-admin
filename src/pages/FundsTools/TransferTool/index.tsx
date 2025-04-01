import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Form, Input, Button, Select, InputNumber, message, Table, Divider } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { walletTypeList } from '@/services/ant-design-pro/fundsTools';

const { Option } = Select;

const TransferTool: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [transferRecords, setTransferRecords] = useState<any[]>([]);
  const [availableBalance, setAvailableBalance] = useState<number>(1000);
  const [walletList, setWalletList] = useState<any[]>([]);

  const walletData = async () => {
    const res = await walletTypeList();
    if (res.code === '0' ) {
      setWalletList(res.data.list);
    }
  };

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

  useEffect(() => {
    walletData();
  }, []);

  return (
    <PageContainer>
      <Card title="用户间转账">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Form.Item
              name="fromUser"
              label="转出账户"
              rules={[{ required: true, message: '请选择转出账户' }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="请选择转出账户">
                {walletList.map((item: any) => (
                  <Option key={item.id} value={item.id}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <div style={{ display: 'flex', justifyContent: 'center', padding: '0 20px', marginTop: '20px' }}>
              <SwapOutlined style={{ fontSize: '20px', color: '#aaa' }} />
            </div>
            
            <Form.Item
              name="toUser"
              label="转入账户"
              rules={[{ required: true, message: '请选择转入账户' }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="请选择转入账户">
                <Option value="client">邀请返佣账户</Option>
                {/* 可以添加更多选项 */}
              </Select>
            </Form.Item>
          </div>
          
          <Form.Item
            name="currency"
            label="币种"
            rules={[{ required: true, message: '请选择币种' }]}
          >
            <Select placeholder="请选择转账币种">
              <Option value="USDT">USDT</Option>
              <Option value="BTC">BTC</Option>
              <Option value="ETH">ETH</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="amount"
            label="转账金额"
            rules={[{ required: true, message: '请输入转账金额' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} placeholder="请输入" />
          </Form.Item>
          
          <div style={{ marginTop: '-15px', marginBottom: '15px' }}>
            <span>可用: {availableBalance} USDT</span>
          </div>
          
          <Form.Item
            name="reason"
            label="备注"
            rules={[{ required: true, message: '请输入备注' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入" />
          </Form.Item>
          
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <Button htmlType="button" onClick={() => form.resetFields()}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                确认
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
      


    </PageContainer>
  );
};

export default TransferTool; 