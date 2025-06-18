import React, { useState, useEffect, useRef } from 'react';
import { PageContainer,ProTable } from '@ant-design/pro-components';
import {  Button, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { ActionType } from '@ant-design/pro-components';
import EditForm from './components/EditForm';
import { exchangeCoinList,tenantCurrencyCoinList,updateExchangeCoinById } from '@/services/ant-design-pro/spot';
import { useIntl } from 'umi';

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
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [tradingFees, setTradingFees] = useState<TradingFee[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<TradingFee | null>(null);
  const [coinList, setCoinList] = useState<TradingFee[]>([]);

  const getCoin=async()=>{
    let data={
      pageNo: 1,
      pageSize: 10000
    }
    const res=await tenantCurrencyCoinList(data)
    if(res.code==='0'){
      setCoinList(res.data.list)

    }
  }


  useEffect(() => {
    getCoin()
  
  }, []);


  const fetchTradingPairs = async (params: any) => {

    const res = await exchangeCoinList({
      pageNo: params.current,
      pageSize: params.pageSize,
      coinSymbol: params.coinSymbol,
      
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
  let res = await updateExchangeCoinById({
      id: currentRecord?.id,
      buyFee: values.buyFee,
      sellFee: values.sellFee,
    });
    if(res.code==='0'&&res.data){
      message.success(intl.formatMessage({ id: 'tradingFees.updateSuccess' }));
      setIsModalVisible(false);
      setCurrentRecord(null);
      actionRef.current?.reload();
    }else{
      message.error(res.message);
    }
  };

  const columns: ColumnsType<TradingFee> = [
    {
      title: intl.formatMessage({ id: 'deposit.column.coin' }),
      dataIndex: 'coinSymbol',
      key: 'coinSymbol',
      hideInTable:true,
      valueType: 'select',
      fieldProps: {
        options: coinList.map((item) => ({
          label: item.coinName,
          value: item.coinName,
        })),
      },
    },
    {
      title: intl.formatMessage({ id: 'tradingFees.column.tradingPair' }),
      search: false,
      render: (_, record) => (
        <div>
          <span>{record.coinSymbol}</span>/
          <span>{record.baseSymbol}</span>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'tradingFees.column.makerFee' }),
      dataIndex: 'buyFee',
      key: 'buyFee',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'tradingFees.column.takerFee' }),
      dataIndex: 'sellFee',
      key: 'sellFee',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'tradingFees.column.action' }),
      key: 'action',
      search: false,
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => handleEdit(record)}
          style={{ color: '#1890ff' }}
        >
          {intl.formatMessage({ id: 'tradingFees.button.edit' })}
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<TradingFee>
        actionRef={actionRef}
        columns={columns}
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