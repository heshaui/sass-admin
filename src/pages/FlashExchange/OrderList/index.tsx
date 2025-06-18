import React from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useIntl } from 'umi';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Tag, Space } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { records } from '@/services/ant-design-pro/flash';

// 模拟API服务，实际使用时应替换为真实API
// import { getFlashExchangeOrderList, approveFlashExchangeOrder, rejectFlashExchangeOrder } from '@/services/ant-design-pro/flashExchange';

interface FlashExchangeOrder {
  id: string;
  orderId: string;
  userId: string;
  account: string;
  fromCoin: string;
  toCoin: string;
  fromAmount: number;
  toAmount: number;
  exchangeRate: number;
  fee: number;
  status: '0' | '1' | '2' | '3';
  createTime: number;
  updateTime: number;
}

const statusMap = {
  '0': { color: 'blue', text: '处理中' },
  '1': { color: 'green', text: '处理中' },
  '2': { color: 'red', text: '失败' },
  '3': { color: 'orange', text: '成功' },

};

const OrderList: React.FC = () => {
  const intl = useIntl();

  const handleView = (record: FlashExchangeOrder) => {
    console.log('查看订单详情', record);
    // 这里可以实现查看订单详情的逻辑，如弹出Modal等
  };

  const handleApprove = async (record: FlashExchangeOrder) => {
    console.log('批准订单', record);
    // 实际应用中应该调用后端API
    // const result = await approveFlashExchangeOrder(record.id);
    // if (result.code === '0') {
    //   message.success(intl.formatMessage({ id: 'flashExchange.orderList.approve.success' }));
    //   actionRef.current?.reload();
    // } else {
    //   message.error(result.msg || intl.formatMessage({ id: 'flashExchange.orderList.approve.failed' }));
    // }
  };

  const handleReject = async (record: FlashExchangeOrder) => {
    console.log('拒绝订单', record);
    // 实际应用中应该调用后端API
    // const result = await rejectFlashExchangeOrder(record.id);
    // if (result.code === '0') {
    //   message.success(intl.formatMessage({ id: 'flashExchange.orderList.reject.success' }));
    //   actionRef.current?.reload();
    // } else {
    //   message.error(result.msg || intl.formatMessage({ id: 'flashExchange.orderList.reject.failed' }));
    // }
  };

  const getList = async (params: any) => {
    // 处理查询参数
    if (!params.dateTimeRange) {
      params.dateTimeRange = [null, null];
    }
    
    let data = {
      pageNo: params.current,
      pageSize: params.pageSize,
      sendCoin: params.account,
      status: params.status,
      startTime: params?.dateTimeRange[0] ? dayjs(params?.dateTimeRange[0]).valueOf() : null,
      endTime: params?.dateTimeRange[1] ? dayjs(params?.dateTimeRange[1]).valueOf() : null,
    };
    
    try {
      // 实际应用中应该调用后端API
      const res = await records(data);
        if(res.code === '0'){
          return {
            data: res.data.list,
            success: true,
            total: res.data.count,
          }
        }
      
   

     
    } catch (error) {
      console.error('获取闪兑订单列表失败:', error);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  const columns: ProColumns<FlashExchangeOrder>[] = [

    {
      title: intl.formatMessage({ id: 'flashExchange.orderList.column.account', defaultMessage: 'uid' }),
      dataIndex: 'account',
      key: 'account',
    },

    {
      title: intl.formatMessage({ id: 'flashExchange.orderList.column.orderId', defaultMessage: '订单id' }),
      dataIndex: 'id',
      key: 'id',
      copyable: true,
    },

    {
      title: '交易日期',
      dataIndex: 'createTime',
      key: 'createTime',
      search: false,
    },
    {
      title: '交易对',
      search: false,
      render:(text,record)=>{
        if(record.sendCoin&&record.receiveCoin){
            return record.sendCoin+'/'+record.receiveCoin
        }else{
            return '-'
        }
        
    }
    },
    {
      title: '支付',
      dataIndex: 'sendAmount',
      key: 'sendAmount',
  },
  {
      title: '获得',
      dataIndex: 'receivedAmount',
      key: 'receivedAmount'
  },
  {
      title: '价格',
      dataIndex: 'price', 
      key: 'price'
  },
    {
      title: '结算日期',
      dataIndex: 'settlementTime',
      key: 'settlementTime',

    },

    {
      title: intl.formatMessage({ id: 'flashExchange.orderList.column.status', defaultMessage: '状态' }),
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        '0': { text: intl.formatMessage({ id: 'flashExchange.orderList.status.pending', defaultMessage: '处理中' }) },
        '1': { text: intl.formatMessage({ id: 'flashExchange.orderList.status.completed', defaultMessage: '处理中' }) },
        '2': { text: intl.formatMessage({ id: 'flashExchange.orderList.status.rejected', defaultMessage: '失败' }) },
        '3': { text: intl.formatMessage({ id: 'flashExchange.orderList.status.processing', defaultMessage: '成功' }) },
      },
      render: (_, record) => {
        const status = statusMap[record.status];
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },

    {
      title: intl.formatMessage({ id: 'flashExchange.orderList.column.dateTimeRange', defaultMessage: '时间范围' }),
      valueType: 'dateTimeRange',
      key: 'dateTimeRange',
      hideInTable: true,
    },

  ];

  return (
    <PageContainer
      title={intl.formatMessage({ id: 'flashExchange.orderList.title', defaultMessage: '闪兑订单列表' })}
    >
      <ProTable<FlashExchangeOrder>
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
        headerTitle={intl.formatMessage({ id: 'flashExchange.orderList.title', defaultMessage: '闪兑订单列表' })}
        request={getList}
        search={{
          labelWidth: 'auto',
        }}
      />
    </PageContainer>
  );
};

export default OrderList;
