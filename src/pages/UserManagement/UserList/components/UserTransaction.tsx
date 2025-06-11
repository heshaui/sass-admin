import React, { useState, useEffect } from 'react';
import { useIntl } from '@umijs/max';
import { Card, Row, Col, Statistic, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import {
  userTransactionLogList,
  userTransactionCount,
} from '@/services/ant-design-pro/UserManagement';
import { getCurrencyCoinList } from '@/services/ant-design-pro/inviteFriends';
import { currencyCoinList } from '@/services/ant-design-pro/spot';
interface TransactionItem {
  id: string;
  type: number;
  sceneType: SceneTypeMap;
  currency: string;
  amount: number;
  usdtValue: number;
  time: string;
  transactionType: number;
}

interface UserTransactionProps {
  userId: string | number;
}
const sceneTypeMap = {
  'test': 'transferTool.scene.test',
  'symbol-order': 'transferTool.scene.symbol-order',
  'extraction-symbol-order': 'transferTool.scene.extraction-symbol-order',
  'undo_extraction-symbol-order': 'transferTool.scene.undo_extraction-symbol-order',
  'symbol-order-fee': 'transferTool.scene.symbol-order-fee',
  'canal-symbol-order': 'transferTool.scene.canal-symbol-order',
  'buy-trade-symbol-order': 'transferTool.scene.buy-trade-symbol-order',
  'sell-trade-symbol-order': 'transferTool.scene.sell-trade-symbol-order',
  'canal_symbol_order': 'transferTool.scene.canal_symbol_order',
  'M2M': 'transferTool.scene.M2M',
  'M2U': 'transferTool.scene.M2U',
  'U2M': 'transferTool.scene.U2M',
  'U2U': 'transferTool.scene.U2U',
};

type SceneTypeMap = keyof typeof sceneTypeMap;

const UserTransaction: React.FC<UserTransactionProps> = ({ userId }) => {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(false);
  const [currencyList, setCurrencyList] = useState<any[]>([]);
  const isAdmin = process.env.UMI_APP_ADMIN_FLAG === '1';
  const [statistics, setStatistics] = useState({
    currentAssets: 0,
    netInflow: 0,
    profitLoss: 0,
    totalInflow: 0,
    totalOutflow: 0,
  });

  const getCurrencyList = async () => {
    let data = {
      pageNo: 1,
      pageSize: 10000,
    };
    let res;
    if (isAdmin) {
      res = await currencyCoinList(data);
    } else {
      res = await getCurrencyCoinList(data);
    }
    if (res.code === '0') {
      setCurrencyList(res.data.list);
    }
  };

  const columns: ProColumns<TransactionItem>[] = [
    {
      title: intl.formatMessage({ id: 'userTransaction.columns.type' }),
      dataIndex: 'transactionType',
      width: 100,
      valueEnum: {
        // 1 增加 2 扣减 3 冻结 4 解冻
        1: { text: intl.formatMessage({ id: 'userTransaction.type.increase' }) },
        2: { text: intl.formatMessage({ id: 'userTransaction.type.decrease' }) },
        3: { text: intl.formatMessage({ id: 'userTransaction.type.freeze' }) },
        4: { text: intl.formatMessage({ id: 'userTransaction.type.unfreeze' }) },
      },
      render: (_, record) =>
        // 1 增加 2 扣减 3 冻结 4 解冻
        record.transactionType === 1
          ? intl.formatMessage({ id: 'userTransaction.type.increase' })
          : record.transactionType === 2
          ? intl.formatMessage({ id: 'userTransaction.type.decrease' })
          : record.transactionType === 3
          ? intl.formatMessage({ id: 'userTransaction.type.freeze' })
          : intl.formatMessage({ id: 'userTransaction.type.unfreeze' }),
    },
    {
      title: intl.formatMessage({ id: 'userTransaction.columns.business' }),
      dataIndex: 'sceneType',
      width: 120,
      search: false,
      render: (_, record) => {
        const text = sceneTypeMap[record.sceneType];
        return intl.formatMessage({ id: text });
      },
    },
    {
      title: intl.formatMessage({ id: 'userTransaction.columns.currency' }),
      dataIndex: 'coinId',
      valueEnum: currencyList.reduce((prev, curr) => {
        prev[curr.coinId] = { text: curr.coinName };
        return prev;
      }, {}),
    },
    {
      title: intl.formatMessage({ id: 'userTransaction.columns.amount' }),
      dataIndex: 'amount',
      width: 120,
      align: 'right',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'userTransaction.columns.usdtValue' }),
      dataIndex: 'usdtValue',
      width: 120,
      align: 'right',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'userTransaction.columns.time' }),
      dataIndex: 'createTime',
      width: 180,
      valueType: 'dateTime',
    },
  ];
  const getStatistics = async () => {
    const res = await userTransactionCount({
      userId,
    });
    if (res.code === '0') {
      setStatistics(res.data);
    }
  };

  const fetchTransactionData = async (params: any) => {
    setLoading(true);
    try {
      const requestParams = {
        userId,
        pageNo: params.current,
        pageSize: params.pageSize,
      };

      const res = await userTransactionLogList(requestParams);

      if (res.code === '0') {
        return {
          data: res.data.list || [],
          success: true,
          total: res.data.count || 0,
        };
      }
      return {
        data: [],
        success: false,
        total: 0,
      };
    } catch (error) {
      console.error(intl.formatMessage({ id: 'userTransaction.error.fetchTransactions' }), error);
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
            headerTitle={intl.formatMessage({ id: 'userTransaction.title' })}
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
              showTotal: (total) =>
                intl.formatMessage({ id: 'userManagement.pagination.total' }, { total }),
            }}
          />
        </Col>

        <Col span={6}>
          <Card
            title={intl.formatMessage({ id: 'userTransaction.summary.title' })}
            bordered={false}
          >
            <Statistic
              title={
                <span>
                  {intl.formatMessage({ id: 'userTransaction.stats.totalInflow' })}
                  <Tooltip
                    title={intl.formatMessage({ id: 'userTransaction.tooltip.totalInflow' })}
                  >
                    <InfoCircleOutlined />
                  </Tooltip>
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
                  {intl.formatMessage({ id: 'userTransaction.stats.totalOutflow' })}
                  <Tooltip
                    title={intl.formatMessage({ id: 'userTransaction.tooltip.totalOutflow' })}
                  >
                    <InfoCircleOutlined />
                  </Tooltip>
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
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                }}
              ></div>
            </div>

            <Statistic
              title={
                <span>
                  {intl.formatMessage({ id: 'userTransaction.stats.netInflow' })}
                  <Tooltip title={intl.formatMessage({ id: 'userTransaction.tooltip.netInflow' })}>
                    <InfoCircleOutlined />
                  </Tooltip>
                </span>
              }
              value={statistics.netInflow}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              suffix="USDT"
              style={{ marginBottom: '20px' }}
            />

            <Statistic
              title={intl.formatMessage({ id: 'userTransaction.stats.currentAssets' })}
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
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                }}
              ></div>
            </div>

            <Statistic
              title={
                <span>
                  {intl.formatMessage({ id: 'userTransaction.stats.profitLoss' })}
                  <Tooltip title={intl.formatMessage({ id: 'userTransaction.tooltip.profitLoss' })}>
                    <InfoCircleOutlined />
                  </Tooltip>
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
