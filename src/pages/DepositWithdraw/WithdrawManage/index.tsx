import React, { useState, useRef } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Card, Button, Tag, Space } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import { fetchWithdrawDepositList } from '@/services/ant-design-pro/depositWithdraw';
import DetailModal from './components/DetailModal';
import { useNavigate } from 'react-router-dom';

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
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<WithdrawRecord | null>(null);
  const actionRef = useRef<ActionType>();
  const navigate = useNavigate();
  const fetchWithdrawData = async (params: any) => {
    let data={
      pageNo:params.current,
      pageSize:params.pageSize,
    }
    const res = await fetchWithdrawDepositList(data);
    if(res.code==='0'){
      return {
        data: res.data.list,
        success: true,
        total: res.data.total,
      }
    }
    
  };

  const columns: ProColumns<WithdrawRecord>[] = [
    { 
      title: '提现单号', 
      dataIndex: 'withdrawalId',
      hideInSearch: true
    },
    { 
      title: '用户ID', 
      dataIndex: 'userId', 
      render: (userId) => (
        <a onClick={() => navigate(`/user-management/user-list?userId=${userId}`)}>{userId}</a>
      ),
    },
    { 
      title: '币种', 
      dataIndex: 'coinName', 
      key: 'coinName',
    },
    { 
      title: '网络名称', 
      dataIndex: 'protocolId', 
      key: 'protocolId',
    },
    { 
      title: '提现数量', 
      dataIndex: 'amount', 
      key: 'amount',
      hideInSearch: true
    },
    { 
      title: '手续费', 
      dataIndex: 'fee', 
      key: 'fee',
      hideInSearch: true
    },
    { 
      title: '实际到账', 
      dataIndex: 'actualAmount', 
      key: 'actualAmount',
      hideInSearch: true
    },
    { 
      title: '实际矿工费', 
      dataIndex: 'minerFee', 
      key: 'minerFee',
      hideInSearch: true
    },
    { 
      title: '地址/TxId', 
      dataIndex: 'txHash', 
      key: 'txHash',
      render: (text) => <a>{text}</a>,
      fieldProps: {
        placeholder: '到账地址、TxID'
      },
      hideInTable: true
    },
    { 
      title: '发送地址', 
      dataIndex: 'fromAddress', 
      key: 'fromAddress',
      search:false
    },
    { 
      title: '接收地址', 
      dataIndex: 'toAddress', 
      key: 'toAddress',
      search:false
    },
    { 
      title: 'TxID', 
      dataIndex: 'txId', 
      key: 'txId', 
      render: (text) => text !== '-' ? <a>{text}</a> : text,
      hideInSearch: true
    },
    { 
      title: '风控等级', 
      dataIndex: 'riskLevel', 
      key: 'riskLevel',
      hideInSearch: true
    },
    { 
      title: '风控说明', 
      dataIndex: 'riskDesc', 
      key: 'riskDesc',
      hideInSearch: true
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      renderText: (record:number) => {
        console.log(record);
        let color = 'blue';
        let statusText = '创建';
        
        switch(Number(record)) {
          case 0:
            statusText = '创建';
            color = 'blue';
            break;
          case 1:
            statusText = '待审核';
            color = 'blue';
            break;
          case 2:
            statusText = '完成';
            color = 'green';
            break;
          case 3:
            statusText = '拒绝';
            color = 'red';
            break;
          case 4:
            statusText = '用户撤销';
            color = 'gray';
            break;
          default:
            statusText = '未知状态';
            color = 'default';
        }
        
        return <Tag color={color}>{statusText}</Tag>;
      },
      valueEnum: {
        '': { text: '全部' },
        '0': { text: '创建', status: 'Processing' },
        '1': { text: '待审核', status: 'Processing' },
        '2': { text: '完成', status: 'Success' },
        '3': { text: '拒绝', status: 'Error' },
        '4': { text: '用户撤销', status: 'Default' }
      }
    },
    { 
      title: '提现时间', 
      dataIndex: 'createTime', 
      key: 'createTime',
      valueType: 'dateTime',
      hideInTable: true
    },
    { 
      title: '操作', 
      key: 'action',
      hideInSearch: true,
      render: (_, record) => (
        <Space size="middle">
          {record.status === '待审核' ? 
            <Button type="primary" size="small">审核</Button> : 
            <Button type="link" onClick={() => showDetailModal(record)}>详情</Button>}
        </Space>
      ),
    },
  ];

  // 打开详情模态框
  const showDetailModal = (record: WithdrawRecord) => {
    setCurrentRecord(record);
    setDetailVisible(true);
  };

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
        record={currentRecord}
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