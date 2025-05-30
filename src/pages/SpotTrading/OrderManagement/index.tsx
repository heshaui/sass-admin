import GoogleCode from '@/components/GoogleCode';
import ValidCode from '@/components/ValidCode';
import {
  exchangeCoinList,
  exchangeOrderList,
  revocationOrder,
  tradesInfo,
} from '@/services/ant-design-pro/spot';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Empty, message, Tag, Modal } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAllCookies } from '@/utils';
import { useIntl } from 'umi';
import { sendGoogleKey, bindGoogleKey } from '@/services/ant-design-pro/authAdmin';
type OrderItem = {
  id: string;
  orderId: string;
  userId: string;
  tradingPair: string;
  coinSymbol: string;
  baseSymbol: string;
  groupStatus: string;
  type: string;
  direction: 0 | 1;
  price: number;
  amount: number;
  total: number;
  status: 0 | 1 | 2 | 3;
  createTime: Date;
  filledAmount: number;
  avgPrice: number;
  filledTotal: number;
};

type TradeRecord = {
  tradeId: string;
  buyerUid: string;
  buyerRole: string;
  sellerUid: string;
  sellerRole: string;
  tradeTime: Date;
  price: number;
  amount: number;
  total: number;
  buyFee: string;
  sellFee: string;
  quantity: number;
  tradePrice: number;
  buyFeeSymbol: string;
  sellFeeSymbol: string;
  parentUserId?: string; // 父级表格中的用户ID
  takerSide: number;
};

const OrderManagement: React.FC = () => {
  const intl = useIntl();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [tradeRecords, setTradeRecords] = useState<TradeRecord[]>([]);
  const actionRef = useRef<any>();
  const navigate = useNavigate();
  const isAdmin = process.env.UMI_APP_ADMIN_FLAG === '1';
  const [coinList, setCoinList] = useState<any[]>([]);
  const [googleCodeVisible, setGoogleCodeVisible] = useState(false);
  const [googleCodeData, setGoogleCodeData] = useState<any>(null);
    const [validCodeVisible, setValidCodeVisible] = useState(false);

  const getCoinPair = async () => {
    let data = {
      pageNo: 1,
      pageSize: 100000,
    };
    const res = await exchangeCoinList(data);
    if (res.code === '0') {
      setCoinList(res.data.list);
    }
  };


  
  const handleCancel = async (orderId: string) => {
    try {
      // 这里添加取消订单的API调用
      const res = await revocationOrder({ orderId: orderId });
      if (res.code === '0' && res.data) {
        message.success(intl.formatMessage({ id: 'order.management.cancelSuccess' }));
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error(intl.formatMessage({ id: 'order.management.cancelFailed' }));
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'order.management.cancelFailed' }));
    }
  };



  const showTradeDetails = async (record: OrderItem) => {
    // 不再在这里处理收起逻辑，避免与表格的onExpand事件冲突
    if (!record.coinSymbol || !record.baseSymbol || !record.groupStatus) {
      message.error(intl.formatMessage({ id: 'order.management.incompleteOrderInfo' }));
      return;
    }
    const res = await tradesInfo({
      orderId: record.orderId,
      symbol: record.coinSymbol + '_' + record.baseSymbol,
      page: 1,
      pageSize: 1,
    });
    console.log(res);
    if (res.code === '0' && res.data) {
      setTradeRecords(res.data.records);
    }

    setExpandedOrderId(record.orderId);
  };


  const handleOk=async()=>{
    
  }

  const statusMap = {
    0: { text: intl.formatMessage({ id: 'order.management.trading' }), color: 'blue' },
    1: { text: intl.formatMessage({ id: 'order.management.fullyFilled' }), color: 'green' },
    2: { text: intl.formatMessage({ id: 'order.management.rejected' }), color: 'orange' },
    3: { text: intl.formatMessage({ id: 'order.management.cancelled' }), color: 'red' },
    4: { text: intl.formatMessage({ id: 'order.management.creatingOrder' }), color: 'blue' },
    5: { text: intl.formatMessage({ id: 'order.management.partiallyFilled' }), color: 'blue' },
    6: { text: intl.formatMessage({ id: 'order.management.orderCancelled' }), color: 'blue' },
  };

  const columns = [
    ...(!isAdmin
      ? []
      : [
          {
            title: intl.formatMessage({ id: 'order.management.merchantId' }),
            dataIndex: 'tenantId',
            key: 'tenantId',
            search: isAdmin,
          },
        ]),
    {
      title: intl.formatMessage({ id: 'order.management.orderId' }),
      dataIndex: 'orderId',
      copyable: true,
    },
    {
      title: intl.formatMessage({ id: 'order.management.tradingPair' }),
      dataIndex: 'symbol',
      search: !isAdmin,
      valueType: 'select',
      valueEnum: coinList.reduce((acc: any, item: any) => {
        acc[item.coinSymbol + '/' + item.baseSymbol] = item.coinSymbol + '/' + item.baseSymbol;
        return acc;
      }, {}),
    },
    // {
    //   title: '交易对',
    //   dataIndex: 'tradingPair',
    //   search: false,
    // },
    {
      title: 'UID',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId: any) => (
        <a onClick={() => navigate(`/user-management/user-list?userId=${userId}`)}>{userId}</a>
      ),
    },
    {
      title: intl.formatMessage({ id: 'order.management.orderType' }),
      dataIndex: 'type',
      valueType: 'select',
      valueEnum: {
        0: intl.formatMessage({ id: 'order.management.marketPrice' }),
        1: intl.formatMessage({ id: 'order.management.limitPrice' }),
      },

      renderText: (val: number) => (val === 0 ? intl.formatMessage({ id: 'order.management.marketPrice' }) : intl.formatMessage({ id: 'order.management.limitPrice' })),
    },
    {
      title: intl.formatMessage({ id: 'order.management.direction' }),
      dataIndex: 'direction',
      search: false,

      render: (val: number) => (
        <Tag color={val === 0 ? 'green' : 'red'}>{val === 0 ? intl.formatMessage({ id: 'order.management.buy' }) : intl.formatMessage({ id: 'order.management.sell' })}</Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'order.management.orderStatus' }),
      dataIndex: 'status',
      key: 'status',
      valueType: 'select',
      valueEnum: statusMap,
      renderText: (val: number) => {
        const status = statusMap[val as keyof typeof statusMap] || {
          text: intl.formatMessage({ id: 'order.management.unknown' }),
          color: 'default',
        };
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },
    {
      title: intl.formatMessage({ id: 'order.management.orderTime' }),
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'order.management.orderTime' }),
      dataIndex: 'dateTimeRange',
      valueType: 'dateTimeRange',
      hideInTable: true,
    },
    

    // },
    // {
    //   title: '成交均价',
    //   dataIndex: 'avgPrice',
    //   search: false,

    // },
    // {
    //   title: '成交金额',
    //   dataIndex: 'baseSymbolCount',
    //   search: false,
    // },
    {
      title: intl.formatMessage({ id: 'order.management.operations' }),
      dataIndex: 'option',
      valueType: 'option',
      render: (text: string, record: OrderItem) => {
        if (record.status === 0 && !isAdmin) {
          return (
            <Button type="link" onClick={() => handleCancel(record.orderId)}>
              {intl.formatMessage({ id: 'order.management.cancelOrder' })}
            </Button>
          );
        }
        return (
          <Button
            type="link"
            onClick={() => {
              if (expandedOrderId === record.orderId) {
                // Already expanded, click to collapse
                setExpandedOrderId(null);
              } else {
                // Not expanded, click to expand
                showTradeDetails(record);
              }
            }}
          >
            {expandedOrderId === record.orderId ? intl.formatMessage({ id: 'order.management.collapse' }) : intl.formatMessage({ id: 'order.management.expand' })}
          </Button>
        );
      },
    },
  ];

  // const filterTable=(record: any) => {
  //  console.log(record);
  //    if(record.takerSide === 0){
  //       if(record.parentUserId === record.buyerUserId){
  //         return 'taker';
  //       }else{
  //         return 'maker';
  //       }
  //     }else if(record.takerSide === 1){
  //       if(record.parentUserId === record.sellerUserId){
  //         return 'maker';
  //       }else{
  //         return 'taker';
  //       }
  //    }

  // };

  const tradeColumns = [
    {
      title: intl.formatMessage({ id: 'order.management.tradeId' }),
      dataIndex: 'idStr',
    },
    {
      title: intl.formatMessage({ id: 'order.management.buyerUidRole' }),
      dataIndex: 'buyerUserId',
      render: (text: string, record: TradeRecord) =>
        `${text}/${record.takerSide === 0 ? 'taker' : 'maker'}`,
    },
    {
      title: intl.formatMessage({ id: 'order.management.sellerUidRole' }),
      dataIndex: 'sellerUserId',
      render: (text: string, record: TradeRecord) =>
        `${text}/${record.takerSide === 1 ? 'taker' : 'maker'}`,
    },
    {
      title: intl.formatMessage({ id: 'order.management.tradeTime' }),
      dataIndex: 'ctime',
      valueType: 'dateTime',
    },
    {
      title: intl.formatMessage({ id: 'order.management.tradePrice' }),
      dataIndex: 'tradePrice',
    },
    {
      title: intl.formatMessage({ id: 'order.management.tradeAmount' }),
      dataIndex: 'quantity',
    },
    {
      title: intl.formatMessage({ id: 'order.management.tradeTotal' }),
      render: (text: string, record: TradeRecord) => record.tradePrice * record.quantity,
    },
    {
      title: intl.formatMessage({ id: 'order.management.buyFee' }),
      dataIndex: 'buyFee',
      renderText: (text: any, record: TradeRecord) => {
        return record.buyFee.toString() + record.buyFeeSymbol;
      },
    },
    {
      title: intl.formatMessage({ id: 'order.management.sellFee' }),
      dataIndex: 'sellFee',
      renderText: (text: any, record: TradeRecord) => {
        return record.sellFee.toString() + record.sellFeeSymbol;
      },
    },
  ];

  const getList = async (params: any) => {
    console.log(params);
    const data = {
      pageNo: params.current,
      pageSize: params.pageSize,
      symbol: params.symbol,
      userId: params.userId,
      status: params.status,
      direction: params.direction,
      type: params.type,
      tenantId: params.tenantId,
      startTime: params?.dateTimeRange?.[0] ? dayjs(params.dateTimeRange[0]).valueOf() : undefined,
      endTime: params?.dateTimeRange?.[1] ? dayjs(params.dateTimeRange[1]).valueOf() : undefined,
      orderId: params.orderId,
    };
    const res = await exchangeOrderList(data);
    if (res.code === '0') {
      return {
        data: res.data.list,
        success: true,
        total: res.data.count,
      };
    }
  };

    const handleGoogleCodeSuccess = async (code: string) => {
      const res = await bindGoogleKey({ googleCode: code });
      if (res.code === '0' && res.data) {
        message.success(intl.formatMessage({ id: 'order.management.bindSuccess' }));
        clearAllCookies();
        window.location.reload();
      } else {
        message.error(res.message);
      }
      setGoogleCodeVisible(false);
    }

  useEffect(() => {
    if (!isAdmin) {
      getCoinPair();
    }
  }, []);

  return (
    <PageContainer>
      <ProTable<OrderItem>
        actionRef={actionRef}
        rowKey="orderId"
        expandable={{
          expandedRowKeys: expandedOrderId ? [expandedOrderId] : [],
          expandedRowRender: (record) => {
            if (record.orderId === expandedOrderId) {
              return (
                <>
                  {tradeRecords.length > 0 ? (
                    <ProTable<TradeRecord>
                      headerTitle="成交明细"
                      rowKey="idStr"
                      search={false}
                      options={false}
                      dataSource={tradeRecords.map((item) => ({
                        ...item,
                        parentUserId: record.userId,
                      }))}
                      columns={tradeColumns}
                      pagination={false}
                    />
                  ) : (
                    <div style={{ padding: '16px', textAlign: 'center' }}>
                      <Empty description={intl.formatMessage({ id: 'order.management.noTradeRecords' })} />
                    </div>
                  )}
                </>
              );
            }
            return null;
          },
          onExpand: (expanded, record) => {
            if (expanded) {
              showTradeDetails(record);
            } else {
              setExpandedOrderId(null);
            }
          },
        }}
        request={getList}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
      <GoogleCode
        visible={googleCodeVisible}
        qrCodeUrl={googleCodeData?.codeUri}
        secretKey={googleCodeData?.secretKey}
        onSubmit={handleGoogleCodeSuccess}
        onCancel={() => setGoogleCodeVisible(false)}
      />
      <ValidCode
        visible={validCodeVisible}
        onCancel={() => setValidCodeVisible(false)}
        onOk={handleOk}
      />
    </PageContainer>
  );
};

export default OrderManagement;
