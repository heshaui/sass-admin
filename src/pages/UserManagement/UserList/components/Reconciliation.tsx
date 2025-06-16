import { userReconciliation } from '@/services/ant-design-pro/UserManagement';
import { useIntl } from '@umijs/max';
import { Card, Checkbox, Empty, message, Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

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
  const { formatMessage } = useIntl();
  const [loading, setLoading] = useState<boolean>(false);
  const [reconciliationData, setReconciliationData] = useState<ReconciliationItem[]>([]);
  const [hideZeroAssets, setHideZeroAssets] = useState<boolean>(false);

  const columns: ColumnsType<ReconciliationItem> = [
    {
      title: formatMessage({ id: 'reconciliation.columns.currency' }),
      dataIndex: 'coinName',
      key: 'coinName',
      fixed: 'left',
      width: 100,
    },
    {
      title: formatMessage({ id: 'reconciliation.columns.withdrawal' }),
      dataIndex: 'withdrawal',
      key: 'withdrawal',
      width: 120,
      align: 'right',
    },
    {
      title: formatMessage({ id: 'reconciliation.columns.inviteRebate' }),
      dataIndex: 'inviteRebate',
      key: 'inviteRebate',
      width: 120,
      align: 'right',
    },
    // {
    //   title: '对账',
    //   dataIndex: 'reconciliation',
    //   key: 'reconciliation',
    //   width: 100,
    //   align: 'right',
    // },
    {
      title: formatMessage({ id: 'reconciliation.columns.recharge' }),
      dataIndex: 'recharge',
      key: 'recharge',
      width: 100,
      align: 'right',
    },
    {
      title: formatMessage({ id: 'presentTool.button.gift' }),
      dataIndex: 'gift',
      key: 'gift',
      width: 100,
      align: 'right',
    },
    // {
    //   title: '充币',
    //   dataIndex: 'rechargeCoin',
    //   key: 'rechargeCoin',
    //   width: 100,
    //   align: 'right',
    // },
    // {
    //   title: 'M积分兑换',
    //   dataIndex: 'pointsRedeem',
    //   key: 'pointsRedeem',
    //   width: 120,
    //   align: 'right',
    // },
    // {
    //   title: 'MFIL兑换',
    //   dataIndex: 'mfilRedeem',
    //   key: 'mfilRedeem',
    //   width: 120,
    //   align: 'right',
    // },
    // {
    //   title: '收益兑入',
    //   dataIndex: 'incomeImport',
    //   key: 'incomeImport',
    //   width: 120,
    //   align: 'right',
    // },
    // {
    //   title: '发放代币',
    //   dataIndex: 'distributeTokens',
    //   key: 'distributeTokens',
    //   width: 120,
    //   align: 'right',
    // },
    // {
    //   title: '分红收入',
    //   dataIndex: 'dividendIncome',
    //   key: 'dividendIncome',
    //   width: 120,
    //   align: 'right',
    // },
    // {
    //   title: '红包收入',
    //   dataIndex: 'redEnvelopeIncome',
    //   key: 'redEnvelopeIncome',
    //   width: 120,
    //   align: 'right',
    // },
    // {
    //   title: '挖矿返还',
    //   dataIndex: 'miningReturn',
    //   key: 'miningReturn',
    //   width: 120,
    //   align: 'right',
    // },

    // {
    //   title: '经纪人收入',
    //   dataIndex: 'brokerIncome',
    //   key: 'brokerIncome',
    //   width: 120,
    //   align: 'right',
    // },
    // {
    //   title: '持仓分红',
    //   dataIndex: 'positionDividends',
    //   key: 'positionDividends',
    //   width: 120,
    //   align: 'right',
    // },
    // {
    //   title: '现货买入',
    //   dataIndex: 'spotBuying',
    //   key: 'spotBuying',
    //   width: 120,
    //   align: 'right',
    // },
    // {
    //   title: '杠杆买入',
    //   dataIndex: 'leveragedBuying',
    //   key: 'leveragedBuying',
    //   width: 120,
    //   align: 'right',
    // },

    // {
    //   title: '提现手续费',
    //   dataIndex: 'withdrawalFee',
    //   key: 'withdrawalFee',
    //   width: 120,
    //   align: 'right',
    // },
    // {
    //   title: '现货手续费',
    //   dataIndex: 'spotFee',
    //   key: 'spotFee',
    //   width: 120,
    //   align: 'right',
    // },
  ];

  useEffect(() => {
    const fetchReconciliationData = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        // 调用对账接口
        const response = await userReconciliation({ userId });
        if (response.code === '0') {
          setReconciliationData(response.data || []);
        } else {
          message.error(response.message || formatMessage({ id: 'reconciliation.error.fetch' }));
        }
        setLoading(false);
      } catch (error) {
        console.error('获取对账数据失败:', error);
        message.error(formatMessage({ id: 'reconciliation.error.retry' }));
        setLoading(false);
      }
    };

    fetchReconciliationData();
  }, [userId]);

  // 处理隐藏零资产的过滤
  const filteredData = hideZeroAssets
    ? reconciliationData.filter((item) => {
        // 检查是否所有值都是"0"或"+0"
        const allZeros = Object.entries(item)
          .filter(([key]) => key !== 'coinName')
          .every(([_, value]) => {
            console.log(_);

            return value === '0' || value === '+0';
          });
        return !allZeros;
      })
    : reconciliationData;

  const handleHideZeroAssetsChange = (e: any) => {
    setHideZeroAssets(e.target.checked);
  };

  return (
    <Card
      title={formatMessage({ id: 'reconciliation.title' })}
      extra={
        <Checkbox checked={hideZeroAssets} onChange={handleHideZeroAssetsChange}>
          {formatMessage({ id: 'reconciliation.hideZero' })}
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
          rowKey="coinName"
          bordered
          pagination={false}
          scroll={{ x: 'max-content' }}
          size="middle"
        />
      ) : (
        <Empty description={formatMessage({ id: 'reconciliation.noData' })} />
      )}
    </Card>
  );
};

export default Reconciliation;
