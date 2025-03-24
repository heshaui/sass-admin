import React from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Card, Input, DatePicker } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';

const { RangePicker } = DatePicker;

interface RewardRecord {
  key: string;
  serialNumber: number;
  uid: string;
  accountNumber: string;
  inviterId: string;
  orderId: string;
  fee: string;
  commissionRate: string;
  commissionAmount: string;
  actualCommissionAmount: string;
  usdtValue: number;
  distributionType: '手动' | '自动';
  distributionTime: string;
}

const mockData: RewardRecord[] = [
  {
    key: '1',
    serialNumber: 3,
    uid: '123123',
    accountNumber: '123*456',
    inviterId: '789456',
    orderId: '123',
    fee: '1 USDT',
    commissionRate: '20%',
    commissionAmount: '0.2 USDT',
    actualCommissionAmount: '60 BITT',
    usdtValue: 1.01,
    distributionType: '手动',
    distributionTime: '2022-12-16 12:12:12',
  },
  {
    key: '2',
    serialNumber: 2,
    uid: '123123',
    accountNumber: '123*456',
    inviterId: '789456',
    orderId: '123',
    fee: '1 TRX',
    commissionRate: '20%',
    commissionAmount: '0.2 TRX',
    actualCommissionAmount: '60 BITT',
    usdtValue: 5.01,
    distributionType: '自动',
    distributionTime: '2022-12-16 12:12:12',
  },
  {
    key: '3',
    serialNumber: 1,
    uid: '123123',
    accountNumber: '123*456',
    inviterId: '789456',
    orderId: '123',
    fee: '1 TRX',
    commissionRate: '20%',
    commissionAmount: '0.2 TRX',
    actualCommissionAmount: '52.03 BITT',
    usdtValue: 5.21,
    distributionType: '自动',
    distributionTime: '2022-12-16 12:12:12',
  },
];

const RewardRecords: React.FC = () => {
  const columns: ProColumns<RewardRecord>[] = [
    {
      title: '编号',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      search: false,
    },
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
      search: false,
    },
    {
      title: '注册账号',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
      search: false,
    },
    {
      title: '邀请人ID',
      dataIndex: 'inviterId',
      key: 'inviterId',
      render: (text) => <a>{text}</a>,
      search: false,
    },
    {
      title: '订单ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text) => <a>{text}</a>,
      search: false,
    },
    {
      title: '手续费',
      dataIndex: 'fee',
      key: 'fee',
      search: false,
    },
    {
      title: '返佣比例',
      dataIndex: 'commissionRate',
      key: 'commissionRate',
      search: false,
    },
    {
      title: '返佣金额',
      dataIndex: 'commissionAmount',
      key: 'commissionAmount',
      search: false,
    },
    {
      title: '实际返佣金额',
      dataIndex: 'actualCommissionAmount',
      key: 'actualCommissionAmount',
      search: false,
    },
    {
      title: 'USDT估值',
      dataIndex: 'usdtValue',
      key: 'usdtValue',
      search: false,
    },
    {
      title: '发放类型',
      dataIndex: 'distributionType',
      key: 'distributionType',
      valueEnum: {
        '手动': { text: '手动' },
        '自动': { text: '自动' },
      },
      formItemProps: {
        label: '发放类型',
      },
    },
    {
      title: '发放时间',
      dataIndex: 'distributionTime',
      key: 'distributionTime',
      valueType: 'dateTime',
      formItemProps: {
        label: '发放时间',
      },
      renderFormItem: () => <RangePicker placeholder={['年/月/日', '年/月/日']} />,
    },
  ];

  return (
    <PageContainer title="发放记录">
      <ProTable<RewardRecord>
        columns={columns}
        dataSource={mockData}
        rowKey="key"
        pagination={{
          pageSize: 10,
        }}
        headerTitle="发放记录"
        request={async (params) => {
          console.log(params);
          // 这里应该是实际的API请求
          // 现在使用mockData模拟
          return {
            data: mockData,
            success: true,
            total: mockData.length,
          };
        }}
      />
    </PageContainer>
  );
};

export default RewardRecords; 