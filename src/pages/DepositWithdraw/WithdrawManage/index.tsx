import React, { useState, useRef,useEffect } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Card, Button, Tag, Space } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import { fetchWithdrawDepositList,manualProcessing } from '@/services/ant-design-pro/depositWithdraw';
import DetailModal from './components/DetailModal';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'umi';
import { protocolTypeList,tenantCurrencyCoinList } from '@/services/ant-design-pro/spot';


interface WithdrawRecord {
  key: string;
  orderNo: string;
  userId: string;
  coinType: string;
  network: string;
  amount: number;
  fee: number;
  actualAmount: number;
  minerFee: string;
  address: string;
  txId: string;
  riskLevel: number;
  riskDesc: string;
  status: string;
  withdrawTime: string;
}

const WithdrawManage: React.FC = () => {
  const intl = useIntl();
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<WithdrawRecord | null>(null);
  const actionRef = useRef<ActionType>();
  const [protocolList, setProtocolList] = useState<ProtocolItem[]>([]);
  const [coinList, setCoinList] = useState<CoinItem[]>([]);
  const navigate = useNavigate();

  const getProtocol= async () => {
    let data={
        pageNo:1,
        pageSize:10000
    }
    const res = await protocolTypeList(data);
    if (res.code === '0') {
      setProtocolList(res.data.list);
    }
  }


  const getCoin= async () => {
    let data={
      pageNo:1,
      pageSize:10000
    }
    const res = await tenantCurrencyCoinList(data);
    if (res.code === '0') {
      setCoinList(res.data.list);
    }
  }

  const fetchWithdrawData = async (params: any) => {
    let data={
      pageNo:params.current,
      pageSize:params.pageSize,
      protocolId: params.protocolName,
      addressTxId:params.addressTxId,
      coinId: params.coinName,
      startTime: params.dateTimeRange && params.dateTimeRange[0] ? params.dateTimeRange[0] : null,
      endTime: params.dateTimeRange && params.dateTimeRange[1] ? params.dateTimeRange[1] : null,
      userId:params.userId,
      status: params.status,

    }
    const res = await fetchWithdrawDepositList(data);
    if(res.code==='0'){
      return {
        data: res.data.list,
        success: true,
        total: res.data.count,
      }
    }
    
  };

  const columns: ProColumns<WithdrawRecord>[] = [
    { 
      title: intl.formatMessage({ id: 'withdraw.column.id' }), 
      dataIndex: 'withdrawalId',
      hideInSearch: true
    },
    { 
      title: intl.formatMessage({ id: 'withdraw.column.userId' }), 
      dataIndex: 'userId', 
      render: (userId) => (
        <a onClick={() => navigate(`/user-management/user-list?userId=${userId}`)}>{userId}</a>
      ),
    },
    { 
      title: intl.formatMessage({ id: 'withdraw.column.coin' }), 
      dataIndex: 'coinName', 
      key: 'coinName',
      valueEnum: coinList.reduce((acc, item) => {
        acc[item.id] = { text: item.coinName, value: item.id };
        return acc;
      }, {} as Record<number, { text: string; value: number }>),
    },
    { 
      title: intl.formatMessage({ id: 'withdraw.column.network' }), 
      dataIndex: 'protocolName', 
      key: 'protocolName',
      valueType: 'select',
      valueEnum: protocolList.reduce((acc, item) => {
        acc[item.id] = { text: item.protocolName, value: item.id };
        return acc;
      }, {} as Record<number, { text: string; value: number }>),
    },
    { 
      title: intl.formatMessage({ id: 'withdraw.column.amount' }), 
      dataIndex: 'amount', 
      key: 'amount',
      hideInSearch: true
    },
    { 
      title: intl.formatMessage({ id: 'withdraw.column.fee' }), 
      dataIndex: 'fee', 
      key: 'fee',
      hideInSearch: true
    },
    { 
      title: intl.formatMessage({ id: 'withdraw.column.actualAmount' }), 
      dataIndex: 'actualAmount',
      key: 'actualAmount',
      hideInSearch: true,
      render: (_, record) => (Number(record.amount) - Number(record.fee))
    },
    { 
      title: intl.formatMessage({ id: 'withdraw.column.minerFee' }), 
      dataIndex: 'minerFee', 
      key: 'minerFee',
      hideInSearch: true
    },
    { 
      title: intl.formatMessage({ id: 'withdraw.column.addressTxId' }), 
      dataIndex: 'addressTxId', 
      key: 'addressTxId',
      render: (text) => <a>{text}</a>,
      fieldProps: {
        placeholder: intl.formatMessage({ id: 'withdraw.form.addressOrTxId.placeholder' })
      },
      hideInTable: true
    },
    { 
      title: intl.formatMessage({ id: 'withdraw.column.fromAddress' }), 
      dataIndex: 'fromAddress', 
      key: 'fromAddress',
      search:false
    },
    { 
      title: intl.formatMessage({ id: 'withdraw.column.toAddress' }), 
      dataIndex: 'toAddress', 
      key: 'toAddress',
      search:false
    },
    { 
      title: intl.formatMessage({ id: 'withdraw.column.txId' }), 
      dataIndex: 'txId', 
      key: 'txId', 
      render: (text) => text !== '-' ? <a>{text}</a> : text,
      hideInSearch: true
    },
    { 
      title: intl.formatMessage({ id: 'withdraw.column.riskLevel' }), 
      dataIndex: 'riskLevel', 
      key: 'riskLevel',
      hideInSearch: true
    },
    { 
      title: intl.formatMessage({ id: 'withdraw.column.riskDesc' }), 
      dataIndex: 'riskDesc', 
      key: 'riskDesc',
      hideInSearch: true
    },
    { 
      title: intl.formatMessage({ id: 'withdraw.column.status' }), 
      dataIndex: 'status', 
      renderText: (record:number) => {
        console.log(record);
        let color = 'blue';
        let statusText = intl.formatMessage({ id: 'withdraw.status.created' });
        
        switch(Number(record)) {
          case 0:
            statusText = intl.formatMessage({ id: 'withdraw.status.pending' });
            color = 'blue';
            break;
          case 1:
            statusText = intl.formatMessage({ id: 'withdraw.status.pending' });
            color = 'blue';
            break;
          case 2:
            statusText = intl.formatMessage({ id: 'withdraw.status.completed' });
            color = 'green';
            break;
          case 3:
            statusText = intl.formatMessage({ id: 'withdraw.status.rejected' });
            color = 'red';
            break;
          case 4:
            statusText = intl.formatMessage({ id: 'withdraw.status.cancelled' });
            color = 'gray';
            break;
          default:
            statusText = intl.formatMessage({ id: 'withdraw.status.unknown' });
            color = 'default';
        }
        
        return <Tag color={color}>{statusText}</Tag>;
      },
      valueEnum: {
        '': { text: intl.formatMessage({ id: 'withdraw.status.all' }) },
        '0': { text: intl.formatMessage({ id: 'withdraw.status.created' }), status: 'Processing' },
        '1': { text: intl.formatMessage({ id: 'withdraw.status.pending' }), status: 'Processing' },
        '2': { text: intl.formatMessage({ id: 'withdraw.status.completed' }), status: 'Success' },
        '3': { text: intl.formatMessage({ id: 'withdraw.status.rejected' }), status: 'Error' },
        '4': { text: intl.formatMessage({ id: 'withdraw.status.userCancelled' }), status: 'Default' }
      }
    },
    { 
      title: intl.formatMessage({ id: 'withdraw.column.withdrawTime' }), 
      dataIndex: 'dateTimeRange',
      valueType: 'dateTimeRange',
      hideInTable: true
    },
    { 
      title: intl.formatMessage({ id: 'withdraw.column.withdrawTime' }), 
      key: 'createTime',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false
    },
    { 
      title: intl.formatMessage({ id: 'withdraw.column.action' }), 
      key: 'action',
      hideInSearch: true,
      render: (_, record) => (
        <Space size="middle">
          {record.status === 1 ? 
            <Button type="primary" size="small" onClick={() => showDetailModal(record)}>
              {intl.formatMessage({ id: 'withdraw.action.review' })}
            </Button> : 
            <Button type="link" onClick={() => showDetailModal(record)}>
              {intl.formatMessage({ id: 'withdraw.action.details' })}
            </Button>}
        </Space>
      ),
    },
  ];

  // 打开详情模态框
  const showDetailModal = (record: WithdrawRecord) => {
    setCurrentRecord(record);
    setDetailVisible(true);
  };

  useEffect(() => {
    getProtocol();
    getCoin()
  }, []);
  return (
    <PageContainer>
        <ProTable<WithdrawRecord>
          columns={columns}
          actionRef={actionRef}
          request={fetchWithdrawData}
          rowKey="key"
          pagination={{
            pageSize: 10,
          }}
          search={{
            labelWidth: 'auto',
            defaultCollapsed: false,
          }}
          options={{
            density: false,
            fullScreen: true,
            reload: true,
          }}
          scroll={{ x: 'max-content' }}
          dateFormatter="string"
        />
      
      {/* 引入详情模态框组件 */}
      <DetailModal 
        visible={detailVisible}
        record={currentRecord as any}
        onClose={() => {
          setDetailVisible(false);
          setCurrentRecord(null);
          actionRef.current?.reload();
  
        }}
      />
    </PageContainer>
  );
};

export default WithdrawManage; 