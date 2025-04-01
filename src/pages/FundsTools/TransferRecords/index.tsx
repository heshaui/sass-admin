import React, { useEffect, useState } from 'react';
import { Card, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PageContainer } from '@ant-design/pro-layout';
import { useIntl } from 'umi';

interface TransferRecord {
  key: string;
  time: string;
  fromAccount: string;
  fromAccountType: string;
  toAccount: string;
  toAccountType: string;
  amount: string;
  remark: string;
  operator: string;
}

const TransferRecords: React.FC = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<TransferRecord[]>([]);

  useEffect(() => {
    // 模拟数据加载
    setLoading(true);
    // 这里应该是从API获取数据，这里用模拟数据代替
    setTimeout(() => {
      const mockData: TransferRecord[] = [
        {
          key: '1',
          time: '2025-12-12 12:12:12',
          fromAccount: '1232',
          fromAccountType: '用户账户：现货账户',
          toAccount: '52698',
          toAccountType: '用户账户：现货账户',
          amount: '10USDT',
          remark: '123',
          operator: '马克',
        },
        {
          key: '2',
          time: '2025-12-12 12:12:12',
          fromAccount: '1232',
          fromAccountType: '公司总账户',
          toAccount: '52698',
          toAccountType: '用户账户：现货账户',
          amount: '10USDT',
          remark: '123',
          operator: '马克',
        },
        {
          key: '3',
          time: '2025-12-12 12:12:12',
          fromAccount: '1232',
          fromAccountType: '公司总账户',
          toAccount: '52698',
          toAccountType: '邀请返佣账户',
          amount: '10USDT',
          remark: '邀请返佣',
          operator: '马克',
        },
      ];
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const columns: ColumnsType<TransferRecord> = [
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '转出账户',
      dataIndex: 'fromAccount',
      key: 'fromAccount',
    },
    {
      title: '转出账户类型',
      dataIndex: 'fromAccountType',
      key: 'fromAccountType',
    },
    {
      title: '转入账户',
      dataIndex: 'toAccount',
      key: 'toAccount',
    },
    {
      title: '转入账户类型',
      dataIndex: 'toAccountType',
      key: 'toAccountType',
    },
    {
      title: '转账金额',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
    },
  ];

  return (
    <PageContainer>
      <Card>
        <h2>转账记录</h2>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </PageContainer>
  );
};

export default TransferRecords; 