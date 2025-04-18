import React, { useState, useEffect, useRef } from 'react';
import { PageContainer,ProTable } from '@ant-design/pro-components';
import {  Button, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import EditForm from './components/EditForm';
import { exchangeCoinList,saveExchangeCoin,updateExchangeGroup } from '@/services/ant-design-pro/spot';

interface TradingFee {
  id: string;
  pairName: string;
  buyFee: number;
  sellFee: number;
  coinSymbol: string;
  baseSymbol: string;
  sortOrder: number;
  search: boolean;
}

const TradingFees: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [tradingFees, setTradingFees] = useState<TradingFee[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<TradingFee | null>(null);

  // 模拟数据，实际项目中应从API获取
  useEffect(() => {
    // 这里模拟从API获取数据
  
  }, []);


  const fetchTradingPairs = async (params: any) => {

    const res = await exchangeCoinList({
      pageNo: params.current,
      pageSize: params.pageSize,
    });
    if(res.code==='0'){
      return {
        data: res.data.list,
        success: true,
        total: res.data.count,
      };
    }else{
      message.error(res.message);
      return {
        data: [],
        success: false,
      };
    }
  };

  const handleEdit = (record: TradingFee) => {
    setCurrentRecord(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentRecord(null);
  };

  const handleSubmit = async (values: any) => {
    // 实际项目中，这里应该调用API更新数据
  let res = await updateExchangeGroup({
      id: currentRecord?.id,
      buyFee: values.buyFee,
      sellFee: values.sellFee,
    });
    if(res.code==='0'&&res.data){
      message.success('更新成功');
      setIsModalVisible(false);
      setCurrentRecord(null);
      actionRef.current?.reload();
    }else{
      message.error(res.message);
    }
  };

  const columns: ColumnsType<TradingFee> = [
    {
      title: '币对',
      search: false,
      render: (_, record) => (
        <div>
          <span>{record.coinSymbol}</span>/
          <span>{record.baseSymbol}</span>
        </div>
      ),
    },
    {
      title: 'Maker手续费',
      dataIndex: 'buyFee',
      key: 'buyFee',
      search: false,
    },
    {
      title: 'Taker手续费',
      dataIndex: 'sellFee',
      key: 'sellFee',
      search: false,
    },
    {
      title: '操作',
      key: 'action',
      search: false,
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => handleEdit(record)}
          style={{ color: '#1890ff' }}
        >
          编辑
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<TradingFee>
        actionRef={actionRef}
        columns={columns}
        search={false}
        request={fetchTradingPairs}
        rowKey="id"
        loading={loading}
        pagination={true}
      />
      
      <EditForm
        visible={isModalVisible}
        record={currentRecord}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
};

export default TradingFees; 