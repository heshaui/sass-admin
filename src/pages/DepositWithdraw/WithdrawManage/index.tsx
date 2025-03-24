import React from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Card, Button, Tag, Space } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';

interface WithdrawRecord {
  key: string;
  orderNo: string;
  userId: string;
  coinType: string;
  network: string;
  amount: number;
  fee: number;
  actualAmount: number;
  minerFee: string;
  address: string;
  txId: string;
  riskLevel: number;
  riskDesc: string;
  status: string;
  withdrawTime: string;
}

const WithdrawManage: React.FC = () => {
  // 模拟数据
  const mockData: WithdrawRecord[] = [
    {
      key: '1',
      orderNo: '0003',
      userId: '741852',
      coinType: 'USDT',
      network: 'ERC20',
      amount: 20.00,
      fee: 1,
      actualAmount: 19.00,
      minerFee: '0.0001ETH',
      address: '这是一个地址',
      txId: '-',
      riskLevel: 7,
      riskDesc: '这是一个风控原因XXXX',
      status: '待审核',
      withdrawTime: '2022-12-12 12:12:12',
    },
    {
      key: '2',
      orderNo: '0002',
      userId: '936685',
      coinType: 'TRX',
      network: 'TRX',
      amount: 20.00,
      fee: 1,
      actualAmount: 0.3214,
      minerFee: '1.00TRX',
      address: '这是一个地址',
      txId: '-',
      riskLevel: 5,
      riskDesc: '这是一个风控原因',
      status: '已拒绝',
      withdrawTime: '2022-12-12 12:12:12',
    },
    {
      key: '3',
      orderNo: '0001',
      userId: '852147',
      coinType: 'USDT',
      network: 'TRC20',
      amount: 20.00,
      fee: 1,
      actualAmount: 19.00,
      minerFee: '0.0001TRX',
      address: '这是一个地址',
      txId: '这是一个TxID',
      riskLevel: 0,
      riskDesc: '-',
      status: '完成',
      withdrawTime: '2022-12-12 12:12:12',
    },
    {
      key: '4',
      orderNo: '0003',
      userId: '741852',
      coinType: 'USDT',
      network: 'ERC20',
      amount: 20.00,
      fee: 1,
      actualAmount: 19.00,
      minerFee: '0.0001ETH',
      address: '这是一个地址',
      txId: '-',
      riskLevel: 0,
      riskDesc: '-',
      status: '已撤销',
      withdrawTime: '2022-12-12 12:12:12',
    },
  ];

  // 模拟请求函数
  const fetchWithdrawData = async (params: any) => {
    console.log('查询参数:', params);
    // 这里应该是真实的API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: mockData,
          success: true,
          total: mockData.length,
        });
      }, 500);
    });
  };

  const columns: ProColumns<WithdrawRecord>[] = [
    { 
      title: '提现单号', 
      dataIndex: 'orderNo', 
      key: 'orderNo',
      hideInSearch: true
    },
    { 
      title: '用户ID', 
      dataIndex: 'userId', 
      key: 'userId',
      render: (text) => <a>{text}</a>,
      fieldProps: {
        placeholder: 'UID'
      }
    },
    { 
      title: '币种', 
      dataIndex: 'coinType', 
      key: 'coinType',
      valueEnum: {
        '': { text: '全部' },
        'USDT': { text: 'USDT' },
        'TRX': { text: 'TRX' },
        'BTC': { text: 'BTC' }
      }
    },
    { 
      title: '网络名称', 
      dataIndex: 'network', 
      key: 'network',
      valueEnum: {
        '': { text: '全部' },
        'ERC20': { text: 'ERC20' },
        'TRC20': { text: 'TRC20' },
        'TRX': { text: 'TRX' }
      }
    },
    { 
      title: '提现数量', 
      dataIndex: 'amount', 
      key: 'amount',
      hideInSearch: true
    },
    { 
      title: '手续费', 
      dataIndex: 'fee', 
      key: 'fee',
      hideInSearch: true
    },
    { 
      title: '实际到账', 
      dataIndex: 'actualAmount', 
      key: 'actualAmount',
      hideInSearch: true
    },
    { 
      title: '实际矿工费', 
      dataIndex: 'minerFee', 
      key: 'minerFee',
      hideInSearch: true
    },
    { 
      title: '地址/TxId', 
      dataIndex: 'address', 
      key: 'address',
      render: (text) => <a>{text}</a>,
      fieldProps: {
        placeholder: '到账地址、TxID'
      },
      hideInTable: true
    },
    { 
      title: '地址', 
      dataIndex: 'address', 
      key: 'address',
      render: (text) => <a>{text}</a>,
      hideInSearch: true
    },
    { 
      title: 'TxID', 
      dataIndex: 'txId', 
      key: 'txId', 
      render: (text) => text !== '-' ? <a>{text}</a> : text,
      hideInSearch: true
    },
    { 
      title: '风控等级', 
      dataIndex: 'riskLevel', 
      key: 'riskLevel',
      hideInSearch: true
    },
    { 
      title: '风控说明', 
      dataIndex: 'riskDesc', 
      key: 'riskDesc',
      hideInSearch: true
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        let color = 'blue';
        if (status === '已拒绝') color = 'red';
        if (status === '完成') color = 'green';
        if (status === '已撤销') color = 'gray';
        return <Tag color={color}>{status}</Tag>;
      },
      valueEnum: {
        '': { text: '全部' },
        '待审核': { text: '待审核', status: 'Processing' },
        '已拒绝': { text: '已拒绝', status: 'Error' },
        '完成': { text: '完成', status: 'Success' },
        '已撤销': { text: '已撤销', status: 'Default' }
      }
    },
    { 
      title: '提现时间', 
      dataIndex: 'withdrawTime', 
      key: 'withdrawTime',
      valueType: 'dateTimeRange',
      hideInTable: true
    },
    { 
      title: '提现时间', 
      dataIndex: 'withdrawTime', 
      key: 'withdrawTime',
      hideInSearch: true
    },
    { 
      title: '操作', 
      key: 'action',
      hideInSearch: true,
      render: (_, record) => (
        <Space size="middle">
          {record.status === '待审核' ? <Button type="primary" size="small">审核</Button> : <Button type="link">详情</Button>}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card title="提币申核">
        <ProTable<WithdrawRecord>
          columns={columns}
          request={fetchWithdrawData}
          rowKey="key"
          pagination={{
            pageSize: 10,
          }}
          search={{
            labelWidth: 'auto',
            defaultCollapsed: false,
          }}
          options={{
            density: false,
            fullScreen: true,
            reload: true,
          }}
          scroll={{ x: 'max-content' }}
          dateFormatter="string"
        />
      </Card>
    </PageContainer>
  );
};

export default WithdrawManage; 