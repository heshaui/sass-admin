import React, { useState } from 'react';
import { Card, Button, message, Popconfirm, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer,ProTable} from '@ant-design/pro-components';
import { useIntl } from 'umi';
import RiskControlForm from './components/RiskControlForm';
import { tradingRiskControlList,updateTradingRiskControlById } from '@/services/ant-design-pro/spot';
import type { ProColumns, ActionType } from '@ant-design/pro-components';

const TradingRiskControl: React.FC = () => {
  const intl = useIntl();
  const [visible, setVisible] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const actionRef = React.useRef<ActionType>();
  
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
    },
    {
      title: '币对',
      renderText: (record: any) => {
        return record.coinSymbol+'/'+record.baseSymbol;
      },
    },
    {
      title: '交易价格偏离',
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
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      valueType: 'dateTime',
      
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
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

  return (
    <PageContainer>
      <ProTable
        headerTitle="交易风控列表"
        actionRef={actionRef}
        rowKey="id"
        search={false}
        options={{ reload: true }}
        request={async (params) => {
          const { current, pageSize, ...rest } = params;
          const data = {
            pageNo: current || 1,
            pageSize: pageSize || 10,
            ...rest,
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