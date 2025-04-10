import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, DatePicker, Input, Select, Tag, message } from 'antd';
import React, { useRef, useState } from 'react';

type OrderItem = {
  id: string;
  orderId: string;
  userId: string;
  tradingPair: string;
  type: string;
  direction: 'buy' | 'sell';
  price: number;
  amount: number;
  total: number;
  status: 'new' | 'rejected' | 'partialFilled' | 'canceled' | 'filled';
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
  buyerFee: string;
  sellerFee: string;
};

const OrderManagement: React.FC = () => {
  const [selectedRowsState, setSelectedRows] = useState<OrderItem[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [tradeRecords, setTradeRecords] = useState<TradeRecord[]>([]);
  const actionRef = useRef<any>();

  const handleCancel = async (id: string) => {
    try {
      // 这里添加取消订单的API调用
      // await cancelOrder(id);
      message.success('订单已取消');
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } catch (error) {
      message.error('取消订单失败');
    }
  };
  
  const showTradeDetails = (record: OrderItem) => {
    // 如果当前记录已经展开，则收起
    if (expandedOrderId === record.id) {
      setExpandedOrderId(null);
      return;
    }
    
    // 否则展开当前记录
    // 模拟获取成交明细数据
    const mockTradeRecords = [
      {
        tradeId: '1231',
        buyerUid: '123',
        buyerRole: 'Taker',
        sellerUid: '123',
        sellerRole: 'Maker',
        tradeTime: new Date('2025-02-25 12:12:12'),
        price: 12003.32,
        amount: 0.5,
        total: 12003.32,
        buyerFee: '0.021 BTC',
        sellerFee: '1USDT',
      },
      {
        tradeId: '3123',
        buyerUid: '123',
        buyerRole: 'Taker',
        sellerUid: '123',
        sellerRole: 'Maker',
        tradeTime: new Date('2025-02-25 12:12:12'),
        price: 12003.32,
        amount: 0.5,
        total: 12003.32,
        buyerFee: '0.021 BTC',
        sellerFee: '1USDT',
      },
    ];
    
    setTradeRecords(mockTradeRecords);
    setExpandedOrderId(record.id);
  };

  const statusMap = {
    new: { text: '新订单', color: 'blue' },
    rejected: { text: '拒绝', color: 'red' },
    partialFilled: { text: '部分成交', color: 'orange' },
    canceled: { text: '已撤销', color: 'default' },
    filled: { text: '完全成交', color: 'green' },
  };

  const columns = [
    {
      title: '委托单号',
      dataIndex: 'orderId',
      copyable: true,
      ellipsis: true,
      search: false,
    },
    {
      title: '币对',
      dataIndex: 'tradingPair',

    },
    {
      title: 'UID',
      dataIndex: 'userId',
      render: (val: string) => <a>{val}</a>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (val: string) => (val === 'limit' ? '限价' : '市价'),
    },
    {
      title: '方向',
      dataIndex: 'direction',
      search: false,

      render: (val: string) => (
        <Tag color={val === 'buy' ? 'green' : 'red'}>
          {val === 'buy' ? '买' : '卖'}
        </Tag>
      ),
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      render: (val: string) => (
        <span>{statusMap[val as keyof typeof statusMap].text}</span>
      ),
    },
    {
      title: '委托时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
    },
    {
        title: '委托时间',
        dataIndex: 'createTime',
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

    },
    {
      title: '成交数量',
      dataIndex: 'filledAmount',
      search: false,

    },
    {
      title: '成交均价',
      dataIndex: 'avgPrice',
      search: false,

    },
    {
      title: '成交金额',
      dataIndex: 'filledTotal',
      search: false,

    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        if (record.status === 'new' || record.status === 'partialFilled') {
          return (
            <Button type="link" onClick={() => handleCancel(record.id)}>撤销订单</Button>
          );
        }
        return (
          <Button type="link" onClick={() => showTradeDetails(record)}>展开</Button>
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
      dataIndex: 'buyerUid',
      render: (text: string, record: TradeRecord) => `${text}/${record.buyerRole}`,
    },
    {
      title: '卖方UID/角色',
      dataIndex: 'sellerUid',
      render: (text: string, record: TradeRecord) => `${text}/${record.sellerRole}`,
    },
    {
      title: '成交时间',
      dataIndex: 'tradeTime',
      valueType: 'dateTime',
    },
    {
      title: '成交价',
      dataIndex: 'price',
    },
    {
      title: '成交数量',
      dataIndex: 'amount',
    },
    {
      title: '成交金额',
      dataIndex: 'total',
    },
    {
      title: '手续费（买）',
      dataIndex: 'buyerFee',
    },
    {
      title: '手续费（卖）',
      dataIndex: 'sellerFee',
    },
  ];

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
          }
        }}
        request={async () => {
          // 模拟数据
          const mockData = [
            {
              id: '1',
              orderId: '123123',
              userId: '1232',
              tradingPair: 'BTC/USDT',
              type: 'limit',
              direction: 'buy',
              price: 123,
              amount: 1,
              total: 123,
              status: 'new',
              createTime: new Date('2022-12-12 12:12:12'),
              filledAmount: 0,
              avgPrice: 0,
              filledTotal: 0,
            },
            {
              id: '2',
              orderId: '312312',
              userId: '4569',
              tradingPair: 'ETH/USDT',
              type: 'limit',
              direction: 'sell',
              price: 123,
              amount: 1,
              total: 123,
              status: 'rejected',
              createTime: new Date('2022-12-12 12:12:12'),
              filledAmount: 0,
              avgPrice: 0,
              filledTotal: 0,
            },
            {
              id: '3',
              orderId: '123123',
              userId: '1232',
              tradingPair: 'BTC/USDT',
              type: 'limit',
              direction: 'buy',
              price: 123,
              amount: 1,
              total: 123,
              status: 'partialFilled',
              createTime: new Date('2022-12-12 12:12:12'),
              filledAmount: 0.5,
              avgPrice: 123,
              filledTotal: 61.5,
            },
            {
              id: '4',
              orderId: '312312',
              userId: '4569',
              tradingPair: 'ETH/USDT',
              type: 'limit',
              direction: 'sell',
              price: 123,
              amount: 1,
              total: 123,
              status: 'canceled',
              createTime: new Date('2022-12-12 12:12:12'),
              filledAmount: 0,
              avgPrice: 0,
              filledTotal: 0,
            },
            {
              id: '5',
              orderId: '123123',
              userId: '1232',
              tradingPair: 'BTC/USDT',
              type: 'limit',
              direction: 'buy',
              price: 123,
              amount: 1,
              total: 123,
              status: 'filled',
              createTime: new Date('2022-12-12 12:12:12'),
              filledAmount: 1,
              avgPrice: 123,
              filledTotal: 123,
            },
          ];
          
          return {
            data: mockData,
            success: true,
            total: mockData.length,
          };
        }}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </PageContainer>
  );
};

export default OrderManagement; 