import React, { useState, useEffect } from 'react';
import { Table, Card, Checkbox, Spin, Empty, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface ReconciliationItem {
  currency: string;
  balance: string;
  recharge: string;
  deposit: string;
  pointsExchange: string;
  mfilExchange: string;
  incomeExchange: string;
  tokenDistribution: string;
  dividendIncome: string;
  redPacketIncome: string;
  miningRebate: string;
  invitationRebate: string;
  brokerIncome: string;
  positionDividend: string;
}

interface ReconciliationProps {
  userId: string | number;
}

const Reconciliation: React.FC<ReconciliationProps> = ({ userId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [reconciliationData, setReconciliationData] = useState<ReconciliationItem[]>([]);
  const [hideZeroAssets, setHideZeroAssets] = useState<boolean>(false);

  const columns: ColumnsType<ReconciliationItem> = [
    {
      title: '币种',
      dataIndex: 'currency',
      key: 'currency',
      fixed: 'left',
      width: 100,
    },
    {
      title: '对账',
      dataIndex: 'balance',
      key: 'balance',
      width: 100,
      align: 'right',
    },
    {
      title: '充值',
      dataIndex: 'recharge',
      key: 'recharge',
      width: 100,
      align: 'right',
    },
    {
      title: '充币',
      dataIndex: 'deposit',
      key: 'deposit',
      width: 100,
      align: 'right',
    },
    {
      title: 'M积分兑换',
      dataIndex: 'pointsExchange',
      key: 'pointsExchange',
      width: 120,
      align: 'right',
    },
    {
      title: 'MFIL兑换',
      dataIndex: 'mfilExchange',
      key: 'mfilExchange',
      width: 120,
      align: 'right',
    },
    {
      title: '收益兑入',
      dataIndex: 'incomeExchange',
      key: 'incomeExchange',
      width: 120,
      align: 'right',
    },
    {
      title: '发放代币',
      dataIndex: 'tokenDistribution',
      key: 'tokenDistribution',
      width: 120,
      align: 'right',
    },
    {
      title: '分红收入',
      dataIndex: 'dividendIncome',
      key: 'dividendIncome',
      width: 120,
      align: 'right',
    },
    {
      title: '红包收入',
      dataIndex: 'redPacketIncome',
      key: 'redPacketIncome',
      width: 120,
      align: 'right',
    },
    {
      title: '挖矿返还',
      dataIndex: 'miningRebate',
      key: 'miningRebate',
      width: 120,
      align: 'right',
    },
    {
      title: '邀请返佣',
      dataIndex: 'invitationRebate',
      key: 'invitationRebate',
      width: 120,
      align: 'right',
    },
    {
      title: '经纪人收入',
      dataIndex: 'brokerIncome',
      key: 'brokerIncome',
      width: 120,
      align: 'right',
    },
    {
      title: '持仓分红',
      dataIndex: 'positionDividend',
      key: 'positionDividend',
      width: 120,
      align: 'right',
    },
  ];

  useEffect(() => {
    const fetchReconciliationData = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        // 这里替换为实际API调用
        // const response = await getUserReconciliation(userId);
        // if (response.code === '0') {
        //   setReconciliationData(response.data);
        // } else {
        //   message.error(response.message || '获取对账数据失败');
        // }
        
        // 模拟数据
        setTimeout(() => {
          const mockData: ReconciliationItem[] = [
            {
              currency: 'USDT',
              balance: '+0',
              recharge: '+0',
              deposit: '+0',
              pointsExchange: '+0',
              mfilExchange: '+0',
              incomeExchange: '+0',
              tokenDistribution: '+0',
              dividendIncome: '+0',
              redPacketIncome: '+0',
              miningRebate: '+0',
              invitationRebate: '+0',
              brokerIncome: '+0',
              positionDividend: '+0',
            },
            {
              currency: 'BTC',
              balance: '+0',
              recharge: '+0',
              deposit: '+0',
              pointsExchange: '+0',
              mfilExchange: '+0',
              incomeExchange: '+0',
              tokenDistribution: '+0',
              dividendIncome: '+0',
              redPacketIncome: '+0',
              miningRebate: '+0',
              invitationRebate: '+0',
              brokerIncome: '+0',
              positionDividend: '+0',
            },
            {
              currency: 'ETH',
              balance: '+0',
              recharge: '+0',
              deposit: '+0',
              pointsExchange: '+0',
              mfilExchange: '+0',
              incomeExchange: '+0',
              tokenDistribution: '+0',
              dividendIncome: '+0',
              redPacketIncome: '+0',
              miningRebate: '+0',
              invitationRebate: '+0',
              brokerIncome: '+0',
              positionDividend: '+0',
            },
          ];
          setReconciliationData(mockData);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('获取对账数据失败:', error);
        message.error('获取对账数据失败，请稍后重试');
        setLoading(false);
      }
    };

    fetchReconciliationData();
  }, [userId]);

  // 处理隐藏零资产的过滤
  const filteredData = hideZeroAssets
    ? reconciliationData.filter(item => {
        // 检查是否所有值都是"0"或"+0"
        const allZeros = Object.entries(item)
          .filter(([key]) => key !== 'currency')
          .every(([_, value]) => value === '0' || value === '+0');
        return !allZeros;
      })
    : reconciliationData;

  const handleHideZeroAssetsChange = (e: any) => {
    setHideZeroAssets(e.target.checked);
  };

  return (
    <Card
      title="用户对账"
      extra={
        <Checkbox 
          checked={hideZeroAssets} 
          onChange={handleHideZeroAssetsChange}
        >
          隐藏0资产
        </Checkbox>
      }
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin />
        </div>
      ) : filteredData.length > 0 ? (
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="currency"
          bordered
          pagination={false}
          scroll={{ x: 'max-content' }}
          size="middle"
        />
      ) : (
        <Empty description="暂无对账数据" />
      )}
    </Card>
  );
};

export default Reconciliation; 