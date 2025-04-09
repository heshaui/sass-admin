import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Form, Input, Select, DatePicker, Button, Table, Tag, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface DepositRecord {
  id: string;
  userId: string;
  coin: string;
  network: string;
  amount: number;
  address: string;
  txId: string;
  confirmations: string;
  status: string;
  completedTime: string;
  addressType: 'internal' | 'external';
  blockHeight?: number | string;
}

const DepositManage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  
  // 模拟数据
  const mockData: DepositRecord[] = [
    {
      id: '0003',
      userId: '741852',
      coin: 'USDT',
      network: 'ERC20',
      amount: 23.03,
      address: '这是一个地址',
      txId: '这是一个TxID',
      confirmations: '18/20',
      status: '确认中',
      completedTime: '--',
      addressType: 'external',
      blockHeight: '3',
    },
    {
      id: '0002',
      userId: '936685',
      coin: 'TRX',
      network: 'TRX',
      amount: 0.3214,
      address: '这是一个地址',
      txId: '这是一个TxID',
      confirmations: '20/20',
      status: '已到账',
      completedTime: '2022-12-12 12:12:12',
      addressType: 'internal',
      blockHeight: '5',
    },
    {
      id: '0001',
      userId: '852147',
      coin: 'USDT',
      network: 'TRC20',
      amount: 23.00,
      address: '这是一个地址',
      txId: '这是一个TxID',
      confirmations: '20/20',
      status: '已到账',
      completedTime: '2022-12-12 12:12:12',
      addressType: 'internal',
      blockHeight: '1314',
    },
  ];

  const columns: ColumnsType<DepositRecord> = [
    {
      title: '充值单号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId) => (
        <a onClick={() => navigate(`/user-management/user-list?userId=${userId}`)}>{userId}</a>
      ),
    },
    {
      title: '币种',
      dataIndex: 'coin',
      key: 'coin',
    },
    {
      title: '网络名称',
      dataIndex: 'network',
      key: 'network',
    },
    {
      title: '数量',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      render: (_, record) => (
        <Space>
          <Tag color={record.addressType === 'internal' ? 'success' : 'error'}>
            {record.addressType === 'internal' ? '内' : '外'}
          </Tag>
          <a>{_}</a>
          {record.blockHeight && <span className="block-tag">{record.blockHeight}</span>}
        </Space>
      ),
    },
    {
      title: 'TxID',
      dataIndex: 'txId',
      key: 'txId',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '确认数',
      dataIndex: 'confirmations',
      key: 'confirmations',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        if (text === '确认中') {
          return <span style={{ color: '#d48806' }}>{text}</span>;
        }
        return <span>{text}</span>;
      }
    },
    {
      title: '到账时间',
      dataIndex: 'completedTime',
      key: 'completedTime',
    },
  ];

  const onFinish = (values: any) => {
    console.log('Search values:', values);
    setLoading(true);
    // 这里应该调用API获取数据
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <PageContainer>
      <Card title="充币管理">
        <Form
          form={form}
          layout="horizontal"
          onFinish={onFinish}
          style={{ marginBottom: 24 }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            <Form.Item name="coin" style={{ width: 240, marginBottom: 16 }}>
              <Select placeholder="币种" allowClear>
                <Option value="USDT">USDT</Option>
                <Option value="BTC">BTC</Option>
                <Option value="ETH">ETH</Option>
                <Option value="TRX">TRX</Option>
              </Select>
            </Form.Item>
            
            <Form.Item name="userId" style={{ width: 240, marginBottom: 16 }}>
              <Input placeholder="用户ID" />
            </Form.Item>
            
            <Form.Item name="network" style={{ width: 240, marginBottom: 16 }}>
              <Select placeholder="网络名称" allowClear>
                <Option value="ERC20">ERC20</Option>
                <Option value="TRC20">TRC20</Option>
                <Option value="BTC">BTC</Option>
                <Option value="TRX">TRX</Option>
              </Select>
            </Form.Item>
            
            <Form.Item name="status" style={{ width: 240, marginBottom: 16 }}>
              <Select placeholder="充值状态" allowClear>
                <Option value="确认中">确认中</Option>
                <Option value="已到账">已到账</Option>
                <Option value="失败">失败</Option>
              </Select>
            </Form.Item>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            <Form.Item name="addressOrTxId" style={{ width: 240, marginBottom: 16 }}>
              <Input placeholder="到账地址、TxID" />
            </Form.Item>
            
            <Form.Item name="dateRange" style={{ width: 464, marginBottom: 16 }}>
              <RangePicker style={{ width: '100%' }} placeholder={['年/月/日', '年/月/日']} />
            </Form.Item>
            
            <Form.Item style={{ marginBottom: 16 }}>
              <Button type="primary" htmlType="submit" loading={loading} style={{ width: 120, background: '#e8a662', borderColor: '#e8a662' }}>
                搜索
              </Button>
            </Form.Item>
          </div>
        </Form>
        
        <Table 
          columns={columns} 
          dataSource={mockData} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </Card>
    </PageContainer>
  );
};

export default DepositManage;