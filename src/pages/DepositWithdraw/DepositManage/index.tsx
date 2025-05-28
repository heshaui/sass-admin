import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Form, Input, Select, DatePicker, Button, Table, Tag, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'umi';

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
  const intl = useIntl();
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
      address: intl.formatMessage({ id: 'deposit.mock.address' }),
      txId: intl.formatMessage({ id: 'deposit.mock.txId' }),
      confirmations: '18/20',
      status: intl.formatMessage({ id: 'deposit.status.confirming' }),
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
      address: intl.formatMessage({ id: 'deposit.mock.address' }),
      txId: intl.formatMessage({ id: 'deposit.mock.txId' }),
      confirmations: '20/20',
      status: intl.formatMessage({ id: 'deposit.status.completed' }),
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
      address: intl.formatMessage({ id: 'deposit.mock.address' }),
      txId: intl.formatMessage({ id: 'deposit.mock.txId' }),
      confirmations: '20/20',
      status: intl.formatMessage({ id: 'deposit.status.completed' }),
      completedTime: '2022-12-12 12:12:12',
      addressType: 'internal',
      blockHeight: '1314',
    },
  ];

  const columns: ColumnsType<DepositRecord> = [
    {
      title: intl.formatMessage({ id: 'deposit.column.id' }),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'deposit.column.userId' }),
      dataIndex: 'userId',
      key: 'userId',
      render: (userId) => (
        <a onClick={() => navigate(`/user-management/user-list?userId=${userId}`)}>{userId}</a>
      ),
    },
    {
      title: intl.formatMessage({ id: 'deposit.column.coin' }),
      dataIndex: 'coin',
      key: 'coin',
    },
    {
      title: intl.formatMessage({ id: 'deposit.column.network' }),
      dataIndex: 'network',
      key: 'network',
    },
    {
      title: intl.formatMessage({ id: 'deposit.column.amount' }),
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: intl.formatMessage({ id: 'deposit.column.address' }),
      dataIndex: 'address',
      key: 'address',
      render: (_, record) => (
        <Space>
          <Tag color={record.addressType === 'internal' ? 'success' : 'error'}>
            {record.addressType === 'internal' 
              ? intl.formatMessage({ id: 'deposit.address.internal' }) 
              : intl.formatMessage({ id: 'deposit.address.external' })}
          </Tag>
          <a>{_}</a>
          {record.blockHeight && <span className="block-tag">{record.blockHeight}</span>}
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'deposit.column.txId' }),
      dataIndex: 'txId',
      key: 'txId',
      render: (text) => <a>{text}</a>,
    },
    {
      title: intl.formatMessage({ id: 'deposit.column.confirmations' }),
      dataIndex: 'confirmations',
      key: 'confirmations',
    },
    {
      title: intl.formatMessage({ id: 'deposit.column.status' }),
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        if (text === intl.formatMessage({ id: 'deposit.status.confirming' })) {
          return <span style={{ color: '#d48806' }}>{text}</span>;
        }
        return <span>{text}</span>;
      }
    },
    {
      title: intl.formatMessage({ id: 'deposit.column.completedTime' }),
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
      <Card title={intl.formatMessage({ id: 'deposit.title' })}>
        <Form
          form={form}
          layout="horizontal"
          onFinish={onFinish}
          style={{ marginBottom: 24 }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            <Form.Item name="coin" style={{ width: 240, marginBottom: 16 }}>
              <Select placeholder={intl.formatMessage({ id: 'deposit.form.coin.placeholder' })} allowClear>
                <Option value="USDT">USDT</Option>
                <Option value="BTC">BTC</Option>
                <Option value="ETH">ETH</Option>
                <Option value="TRX">TRX</Option>
              </Select>
            </Form.Item>
            
            <Form.Item name="userId" style={{ width: 240, marginBottom: 16 }}>
              <Input placeholder={intl.formatMessage({ id: 'deposit.form.userId.placeholder' })} />
            </Form.Item>
            
            <Form.Item name="network" style={{ width: 240, marginBottom: 16 }}>
              <Select placeholder={intl.formatMessage({ id: 'deposit.form.network.placeholder' })} allowClear>
                <Option value="ERC20">ERC20</Option>
                <Option value="TRC20">TRC20</Option>
                <Option value="BTC">BTC</Option>
                <Option value="TRX">TRX</Option>
              </Select>
            </Form.Item>
            
            <Form.Item name="status" style={{ width: 240, marginBottom: 16 }}>
              <Select placeholder={intl.formatMessage({ id: 'deposit.form.status.placeholder' })} allowClear>
                <Option value={intl.formatMessage({ id: 'deposit.status.confirming' })}>
                  {intl.formatMessage({ id: 'deposit.status.confirming' })}
                </Option>
                <Option value={intl.formatMessage({ id: 'deposit.status.completed' })}>
                  {intl.formatMessage({ id: 'deposit.status.completed' })}
                </Option>
                <Option value={intl.formatMessage({ id: 'deposit.status.failed' })}>
                  {intl.formatMessage({ id: 'deposit.status.failed' })}
                </Option>
              </Select>
            </Form.Item>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            <Form.Item name="addressOrTxId" style={{ width: 240, marginBottom: 16 }}>
              <Input placeholder={intl.formatMessage({ id: 'deposit.form.addressOrTxId.placeholder' })} />
            </Form.Item>
            
            <Form.Item name="dateRange" style={{ width: 464, marginBottom: 16 }}>
              <RangePicker 
                style={{ width: '100%' }} 
                placeholder={[
                  intl.formatMessage({ id: 'deposit.form.dateRange.placeholder.start' }), 
                  intl.formatMessage({ id: 'deposit.form.dateRange.placeholder.end' })
                ]} 
              />
            </Form.Item>
            
            <Form.Item style={{ marginBottom: 16 }}>
              <Button type="primary" htmlType="submit" loading={loading} style={{ width: 120, background: '#e8a662', borderColor: '#e8a662' }}>
                {intl.formatMessage({ id: 'deposit.form.button.search' })}
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