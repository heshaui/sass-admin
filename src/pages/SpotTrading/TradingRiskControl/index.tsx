import React, { useState,useEffect } from 'react';
import { Card, Button, message, Popconfirm, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer,ProTable} from '@ant-design/pro-components';
import { useIntl } from 'umi';
import RiskControlForm from './components/RiskControlForm';
import { tradingRiskControlList,updateTradingRiskControlById,exchangeCoinList } from '@/services/ant-design-pro/spot';
import type { ProColumns, ActionType } from '@ant-design/pro-components';


const TradingRiskControl: React.FC = () => {
  const intl = useIntl();
  const [visible, setVisible] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
    const [coinList, setCoinList] = useState<any[]>([]);
  const actionRef = React.useRef<ActionType>();
  const getCoinLists=async()=>{
    let data={
      "pageNo": 1,
      "pageSize": 10000
    }
    const res=await exchangeCoinList(data);
    if(res.code==='0'){
      setCoinList(res.data.list);
    }
  }
  
  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setVisible(true);
  };
  
  const handleAdd = () => {
    setEditingRecord(null);
    setVisible(true);
  };
  
  const handleFormSubmit = async (values: any) => {
    setLoading(true);
    values.id=editingRecord.id;
    let data={
      id:values.id,
      coinSymbol:values.coinSymbol,
      baseSymbol:values.baseSymbol,
      transactionPriceDeviation:JSON.stringify({
        percentage:values.priceDeviationPercent,
        time:values.priceDeviationMinutes,
      }),
      priceFluctuation:JSON.stringify({ 
        percentage:values.priceFluctuationPercent,
        time:values.priceFluctuationMinutes,
      }),
      alarmNotifyEmail:values.alarmNotifyEmail,
    }
    const res = await updateTradingRiskControlById(data);
    if(res.code==='0'){
      message.success('修改成功');
      actionRef.current?.reload();
    }else{
      message.error(res.message);
    }
    setVisible(false);
    setLoading(false);
    
  };
  
  const columns: ProColumns[] = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      search: false,
    },
    {
      title: '币对',
      dataIndex: 'coinPair',
      key: 'coinPair',
      search: true,
      valueType: 'select',
      fieldProps: {
        options: coinList.map((item: any) => ({
          label: item.coinSymbol + '/' + item.baseSymbol,
          value: item.coinSymbol + '/' + item.baseSymbol,
        })),
      },
      renderText: (text: string, record: any) => {
        return record.coinSymbol+'/'+record.baseSymbol;
      },
    },
    {
      title: '交易价格偏离',
      search: false,
      dataIndex: 'transactionPriceDeviation',
      key: 'transactionPriceDeviation',
      renderText: (record: any) => {
        let data=JSON.parse(record);
        if(data.percentage){
          return data.percentage+'%'+' / '+(data.time)+'min';
        }else{
          return '--'
        }
      },
    },
    {
      title: '近30分钟内价格波动',
      dataIndex: 'priceFluctuation',
      key: 'priceFluctuation',
      search: false,
      renderText: (record: any) => {
        let data=JSON.parse(record);
        if(data.percentage){
          return data.percentage+'%'+' / '+(data.time)+'min';
        }else{
          return '--'
        }
      },
    },
    {
      title: '报警通知',
      dataIndex: 'alarmNotifyEmail',
      key: 'alarmNotifyEmail',
      search: false,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      valueType: 'dateTime',
      search: false,
      
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      search: false,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            修改
          </Button>
        </Space>
      ),
    },
  ];

  const handleDelete = async (id: number) => {
    setLoading(true);
    try {
      // 删除逻辑
      message.success('删除成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('删除失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    getCoinLists();
  }, []);

  return (
    <PageContainer>
      <ProTable
        headerTitle="交易风控列表"
        actionRef={actionRef}
        rowKey="id"
        options={{ reload: true }}
        request={async (params) => {
          console.log(params);
          // Extract coin pair if available 
          let coinSymbol;
          let baseSymbol;
          
          // Handle the selected coin pair from dropdown
          if (params.coinPair) {
            const pairParts = params.coinPair.split('/');
            if (pairParts.length === 2) {
              coinSymbol = pairParts[0];
              baseSymbol = pairParts[1];
            }
          }
          
          const data = {
            pageNo: params.current || 1,
            pageSize: params.pageSize || 10,
            coinSymbol: coinSymbol,
            baseSymbol: baseSymbol,
          };
          const res = await tradingRiskControlList(data);
          if (res.code === '0' && res.data) {
            return {
              data: res.data.list,
              success: true,
              total: res.data.total || res.data.list.length,
            };
          }
          return {
            data: [],
            success: false,
            total: 0,
          };
        }}
        columns={columns}
        pagination={{ showSizeChanger: true }}
      />
      
      <RiskControlForm
        visible={visible}
        onCancel={() => setVisible(false)}
        onSubmit={handleFormSubmit}
        initialValues={editingRecord}
        loading={loading}
      />
    </PageContainer>
  );
};

export default TradingRiskControl; 