import {
  exchangeCoinList,
  exchangeOrderList,
  revocationOrder,
  tradesInfo,
} from '@/services/ant-design-pro/spot';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Tag, message } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
};

const OrderManagement: React.FC = () => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [tradeRecords, setTradeRecords] = useState<TradeRecord[]>([]);
  const actionRef = useRef<any>();
  const navigate = useNavigate();
  const isAdmin = process.env.UMI_APP_ADMIN_FLAG === '1';
  const [coinList, setCoinList] = useState<any[]>([]);

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
        message.success('撤销成功');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error('撤销失败');
      }
    } catch (error) {
      message.error('撤销失败');
    }
  };

  const showTradeDetails = async (record: OrderItem) => {
    // 如果当前记录已经展开，则收起
    if (expandedOrderId === record.id) {
      setExpandedOrderId(null);
      return;
    }
    if (!record.coinSymbol || !record.baseSymbol || !record.groupStatus) {
      message.error('订单信息不完整');
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
      setTradeRecords(res.data.list);
    }

    setExpandedOrderId(record.id);
  };

  const statusMap = {
    0: { text: '交易中', color: 'blue' },
    1: { text: '完全成交', color: 'green' },
    2: { text: '拒绝', color: 'orange' },
    3: { text: '已经撤销', color: 'red' },
    4: { text: '创建订单', color: 'blue' },
    5: { text: '部分成交', color: 'blue' },
    6: { text: '订单已经撤销-戳和未撤销', color: 'blue' },
  };

  const columns = [
    ...(isAdmin
      ? []
      : [
          {
            title: '商户id',
            dataIndex: 'tenantId',
            key: 'tenantId',
            search: isAdmin,
          },
        ]),
    {
      title: '委托单号',
      dataIndex: 'orderId',
      copyable: true,
    },
    {
      title: '币对',
      dataIndex: 'symbol',
      search: !isAdmin,
      valueType: 'select',
      valueEnum: coinList.reduce((acc: any, item: any) => {
        acc[item.coinSymbol + '/' + item.baseSymbol] = item.coinSymbol + '/' + item.baseSymbol;
        return acc;
      }, {}),
    },
    {
      title: '交易对',
      dataIndex: 'tradingPair',
      search: false,
    },
    {
      title: 'UID',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId: any) => (
        <a onClick={() => navigate(`/user-management/user-list?userId=${userId}`)}>{userId}</a>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueType: 'select',
      valueEnum: {
        0: '市价',
        1: '限价',
      },

      render: (val: number) => (val === 0 ? '市价' : '限价'),
    },
    {
      title: '方向',
      dataIndex: 'direction',
      search: false,

      render: (val: number) => (
        <Tag color={val === 0 ? 'green' : 'red'}>{val === 0 ? '买' : '卖'}</Tag>
      ),
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      valueType: 'select',
      valueEnum: statusMap,
      renderText: (val: number) => {
        const status = statusMap[val as keyof typeof statusMap] || {
          text: '未知',
          color: 'default',
        };
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },
    {
      title: '委托时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '委托时间',
      dataIndex: 'dateTimeRange',
      valueType: 'dateTimeRange',
      hideInTable: true,
    },
    {
      title: '委托数量',
      dataIndex: 'amount',
      search: false,
    },
    {
      title: '委托价格',
      dataIndex: 'price',
      search: false,
    },
    {
      title: '委托金额',
      dataIndex: 'total',
      search: false,
      render: (_, record) => record.amount * record.price,
    },
    // {
    //   title: '成交数量',
    //   dataIndex: 'filledAmount',
    //   search: false,

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
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        if (record.status === 0 && !isAdmin) {
          return (
            <Button type="link" onClick={() => handleCancel(record.orderId)}>
              撤销订单
            </Button>
          );
        }
        return (
          <Button type="link" onClick={() => showTradeDetails(record)}>
            展开
          </Button>
        );
      },
    },
  ];

  const tradeColumns = [
    {
      title: '成交单号',
      dataIndex: 'tradeId',
    },
    {
      title: '买方UID/角色',
      dataIndex: 'buyerUserId',
      render: (text: string, record: TradeRecord) => `${text}/${record.buyerRole}`,
    },
    {
      title: '卖方UID/角色',
      dataIndex: 'sellerUserId',
      render: (text: string, record: TradeRecord) => `${text}/${record.sellerRole}`,
    },
    {
      title: '成交时间',
      dataIndex: 'ctime',
      valueType: 'ctime',
    },
    {
      title: '成交价',
      dataIndex: 'tradePrice',
    },
    {
      title: '成交数量',
      dataIndex: 'quantity',
    },
    {
      title: '成交金额',
      render: (text: string, record: TradeRecord) => record.tradePrice * record.quantity,
    },
    {
      title: '手续费（买）',
      dataIndex: 'buyFee',
    },
    {
      title: '手续费（卖）',
      dataIndex: 'sellFee',
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

  useEffect(() => {
    if (!isAdmin) {
      getCoinPair();
    }
  }, []);

  return (
    <PageContainer>
      <ProTable<OrderItem>
        headerTitle="订单列表"
        actionRef={actionRef}
        rowKey="id"
        expandable={{
          expandedRowKeys: expandedOrderId ? [expandedOrderId] : [],
          expandedRowRender: (record) => {
            if (record.id === expandedOrderId) {
              return (
                <ProTable<TradeRecord>
                  headerTitle="成交明细"
                  rowKey="tradeId"
                  search={false}
                  options={false}
                  dataSource={tradeRecords}
                  columns={tradeColumns}
                  pagination={false}
                />
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
    </PageContainer>
  );
};

export default OrderManagement;
