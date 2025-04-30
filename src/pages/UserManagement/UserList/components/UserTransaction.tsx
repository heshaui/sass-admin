import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Tag, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { userTransactionLogList, userTransactionCount } from '@/services/ant-design-pro/UserManagement';
import { getCurrencyCoinList } from '@/services/ant-design-pro/inviteFriends';
import { currencyCoinList } from '@/services/ant-design-pro/spot';
interface TransactionItem {
  id: string;
  type: number;
  businessType: string;
  currency: string;
  amount: number;
  usdtValue: number;
  time: string;
  transactionType: number;
}

interface UserTransactionProps {
  userId: string | number;
}

const UserTransaction: React.FC<UserTransactionProps> = ({ userId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [currencyList, setCurrencyList] = useState<any[]>([]);
  const isAdmin = process.env.UMI_APP_ADMIN_FLAG === '1';
  const [statistics, setStatistics] = useState({
    currentAssets:0,
    netInflow:0,
    profitLoss:0,
    totalInflow:0,
    totalOutflow:0
  });


  const getCurrencyList=async()=>{
    let data={
      pageNo:1,
      pageSize:10000
    }
    let res
    if(isAdmin){
       res=await currencyCoinList(data)
    }else{
       res=await getCurrencyCoinList(data)
    }
    if(res.code==='0'){
      setCurrencyList(res.data.list)
    }
  }


  const columns: ProColumns<TransactionItem>[] = [
    {
      title: '类型',
      dataIndex: 'transactionType',
      width: 100,
      valueEnum: {
        // 1 增加 2 扣减 3 冻结 4 解冻
        1: { text: '增加' },
        2: { text: '扣减' },
        3: { text: '冻结'},
        4: { text: '解冻' },


      },
      render: (_, record) => (
         // 1 增加 2 扣减 3 冻结 4 解冻
         record.transactionType === 1 ? '增加' : record.transactionType === 2 ? '扣减' : record.transactionType === 3 ? '冻结' : '解冻'
       
      ),

    },
    {
      title: '业务',
      dataIndex: 'sceneType',
      width: 120,
      search: false,
    },
    {
      title: '币种',
      dataIndex: 'coinId',
      valueEnum:currencyList.reduce((prev, curr) => {
        prev[curr.coinId] = { text: curr.coinName };
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
      dataIndex: 'createTime',
      width: 180,
      valueType: 'dateTime',
    },
  ];
  const getStatistics = async () => {
    const res = await userTransactionCount({
      userId
    });
    if (res.code === '0') {
      setStatistics(res.data);
    }
  }

  const fetchTransactionData = async (params: any) => {
    setLoading(true);
    try {
      const requestParams = {
        userId,
        pageNo: params.current,
        pageSize: params.pageSize
      };

      const res = await userTransactionLogList(requestParams);

      if (res.code === '0') {
        return {
          data: res.data.list || [],
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

  useEffect(() => {
    getCurrencyList();
    getStatistics();
  }, []);
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
              value={statistics.currentAssets}
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
              value={statistics.profitLoss}
              precision={2}
              valueStyle={{ color: statistics.profitLoss >= 0 ? '#3f8600' : '#cf1322' }}
              suffix="USDT"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserTransaction; 