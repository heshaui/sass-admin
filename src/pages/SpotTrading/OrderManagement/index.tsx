import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, DatePicker, Input, Select, Tag, message } from 'antd';
import React, { useRef, useState } from 'react';
import { exchangeOrderList } from '@/services/ant-design-pro/spot';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

type OrderItem = {
  id: string;
  orderId: string;
  userId: string;
  tradingPair: string;
  type: string;
  direction: 0 | 1;
  price: number;
  amount: number;
  total: number;
  status: 0 | 1 | 2 | 3 
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
  const navigate = useNavigate();


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
    0: { text: '交易中', color: 'blue' },
    1: { text: '完成', color: 'red' },
    2: { text: '取消', color: 'orange' },
    3: { text: '超时', color: 'default' },

  };


  const columns = [
    {
      title: '委托单号',
      dataIndex: 'orderId',
      copyable: true,
      search: false,
    },
    {
      title: '币对',
      dataIndex: 'symbol',

    },
    {
      title: 'UID',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId:any) => (
        <a onClick={() => navigate(`/user-management/user-list?userId=${userId}`)}>{userId}</a>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueType: 'select',
      valueEnum:{
        0:'市价',
        1:'限价',
      },

      render: (val: number) => (val === 0 ? '市价' : '限价'),
    },
    {
      title: '方向',
      dataIndex: 'direction',
      search: false,

      render: (val: number) => (
        <Tag color={val === 0 ? 'green' : 'red'}>
          {val === 0 ? '买' : '卖'}
        </Tag>
      ),
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      valueType: 'select',
      valueEnum: statusMap,
      renderText: (val: number) => {
        const status = statusMap[val as keyof typeof statusMap] || { text: '未知', color: 'default' };
        return (
          <Tag color={status.color}>
            {status.text}
          </Tag>
        );
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
      dataIndex: 'baseSymbolCount',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
          if (record.status === 0 ) {
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


  const getList=async(params:any)=>{
    console.log(params);
    const data={
      pageNo:params.current,
      pageSize:params.pageSize,
      symbol:params.symbol,
      userId:params.userId,
      status:params.status,
      direction:params.direction,
      type:params.type,
      startTime:params?.dateTimeRange?.[0]?dayjs(params.dateTimeRange[0]).valueOf():undefined,
      endTime:params?.dateTimeRange?.[1]?dayjs(params.dateTimeRange[1]).valueOf():undefined,
    }
    const res=await exchangeOrderList(data);
    if(res.code==='0'){
      return {
        data: res.data.list,
        success: true,
        total: res.data.count
      };
    }
  }

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
        request={getList}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
    </PageContainer>
  );
};

export default OrderManagement; 