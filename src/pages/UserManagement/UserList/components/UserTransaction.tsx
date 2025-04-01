import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Tag, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { userTransactionLogList } from '@/services/ant-design-pro/UserManagement';

interface TransactionItem {
  id: string;
  type: 'in' | 'out';
  businessType: string;
  currency: string;
  amount: number;
  usdtValue: number;
  time: string;
}

interface UserTransactionProps {
  userId: string | number;
}

const UserTransaction: React.FC<UserTransactionProps> = ({ userId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [statistics, setStatistics] = useState({
    totalInflow: 1000,
    totalOutflow: 500,
    netInflow: 500,
    currentAsset: 100,
    historyProfit: -400,
  });
  
  const businessTypes = [
    { label: '全部', value: 'all' },
    { label: '充币', value: '充币' },
    { label: '提币', value: '提币' },
    { label: 'C2C', value: 'C2C' },
    { label: '内部转账', value: '内部转账' },
  ];

  const currencies = [
    { label: '全部', value: 'all' },
    { label: 'USDT', value: 'USDT' },
    { label: 'BTC', value: 'BTC' },
    { label: 'ETH', value: 'ETH' },
  ];

  const columns: ProColumns<TransactionItem>[] = [
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      valueEnum: {
        in: { text: '流入', status: 'Success' },
        out: { text: '流出', status: 'Error' },
      },
      render: (_, record) => (
        <Tag color={record.type === 'in' ? '#52c41a' : '#f5222d'}>
          {record.type === 'in' ? '流入' : '流出'}
        </Tag>
      ),
    },
    {
      title: '业务',
      dataIndex: 'businessType',
      width: 120,
      valueEnum: businessTypes.reduce((prev, curr) => {
        if (curr.value !== 'all') {
          prev[curr.value] = { text: curr.label };
        }
        return prev;
      }, {}),
    },
    {
      title: '币种',
      dataIndex: 'currency',
      width: 100,
      valueEnum: currencies.reduce((prev, curr) => {
        if (curr.value !== 'all') {
          prev[curr.value] = { text: curr.label };
        }
        return prev;
      }, {}),
    },
    {
      title: '数量',
      dataIndex: 'amount',
      width: 120,
      align: 'right',
      search: false,
    },
    {
      title: '折合USDT',
      dataIndex: 'usdtValue',
      width: 120,
      align: 'right',
      search: false,
    },
    {
      title: '时间',
      dataIndex: 'time',
      width: 180,
      valueType: 'dateTimeRange',
    },
  ];

  const fetchTransactionData = async (params: any, sort: any, filter: any) => {
    setLoading(true);
    try {
      const requestParams = {
        userId,
        pageNO: params.current,
        pageSize: params.pageSize
      };
      
      const res = await userTransactionLogList(requestParams);
      
      if (res.code==='0') {
        return {
          data: res.data.list|| [],
          success: true,
          total: res.data.count || 0,
        };
      }
      
      
    } catch (error) {
      console.error('获取交易记录失败', error);
      return {
        data: [],
        success: false,
        total: 0,
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-transaction-component">
      <Row gutter={16}>
        <Col span={18}>
          <ProTable<TransactionItem>
            headerTitle="交易流水"
            rowKey="id"
            loading={loading}
            columns={columns}
            request={fetchTransactionData}
            bordered
            search={{
              labelWidth: 'auto',
              defaultCollapsed: false,
            }}
            options={{
              setting: {
                listsHeight: 400,
              },
            }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
          />
        </Col>
        
        <Col span={6}>
          <Card title="流水概况(折合USDT)" bordered={false}>
            <Statistic 
              title={
                <span>
                  总流入 <Tooltip title="用户所有充值、转入的资金总额"><InfoCircleOutlined /></Tooltip>
                </span>
              }
              value={statistics.totalInflow}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              suffix="USDT"
              style={{ marginBottom: '20px' }}
            />
            
            <Statistic 
              title={
                <span>
                  总流出 <Tooltip title="用户所有提现、转出的资金总额"><InfoCircleOutlined /></Tooltip>
                </span>
              }
              value={statistics.totalOutflow}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              suffix="USDT"
              style={{ marginBottom: '20px' }}
            />
            
            <div 
              style={{ 
                height: '2px', 
                background: '#f0f0f0', 
                margin: '20px 0', 
                position: 'relative' 
              }}
            >
              <div style={{ 
                position: 'absolute', 
                width: '100%', 
                height: '100%' 
              }}></div>
            </div>
            
            <Statistic 
              title={
                <span>
                  净流入 <Tooltip title="总流入减去总流出的差额"><InfoCircleOutlined /></Tooltip>
                </span>
              }
              value={statistics.netInflow}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              suffix="USDT"
              style={{ marginBottom: '20px' }}
            />
            
            <Statistic 
              title="当前资产"
              value={statistics.currentAsset}
              precision={2}
              suffix="USDT"
              style={{ marginBottom: '20px' }}
            />
            
            <div 
              style={{ 
                height: '2px', 
                background: '#f0f0f0', 
                margin: '20px 0', 
                position: 'relative' 
              }}
            >
              <div style={{ 
                position: 'absolute', 
                width: '100%', 
                height: '100%' 
              }}></div>
            </div>
            
            <Statistic 
              title={
                <span>
                  历史盈亏 <Tooltip title="交易产生的盈亏记录"><InfoCircleOutlined /></Tooltip>
                </span>
              }
              value={statistics.historyProfit}
              precision={2}
              valueStyle={{ color: statistics.historyProfit >= 0 ? '#3f8600' : '#cf1322' }}
              suffix="USDT"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserTransaction; 