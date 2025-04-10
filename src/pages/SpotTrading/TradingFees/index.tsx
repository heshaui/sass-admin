import React, { useState, useEffect } from 'react';
import { PageContainer,ProTable } from '@ant-design/pro-components';
import {  Button, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { request } from 'umi';
import EditForm from './components/EditForm';

interface TradingFee {
  id: string;
  pairName: string;
  makerFee: number;
  takerFee: number;
}

const TradingFees: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tradingFees, setTradingFees] = useState<TradingFee[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<TradingFee | null>(null);

  // 模拟数据，实际项目中应从API获取
  useEffect(() => {
    // 这里模拟从API获取数据
    setTradingFees([
      {
        id: '1',
        pairName: 'BTC/USDT',
        makerFee: 0.001,
        takerFee: 0.001,
      },
      {
        id: '2',
        pairName: 'ETH/USDT',
        makerFee: 0.001,
        takerFee: 0.001,
      },
    ]);
  }, []);

  const handleEdit = (record: TradingFee) => {
    setCurrentRecord(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentRecord(null);
  };

  const handleSubmit = (values: any) => {
    // 实际项目中，这里应该调用API更新数据
    message.success(`已更新 ${values.pairName} 的手续费设置`);
    
    // 更新本地数据（模拟）
    if (currentRecord) {
      const newTradingFees = tradingFees.map((item) => {
        if (item.id === currentRecord.id) {
          return {
            ...item,
            makerFee: values.makerFee / 100, // 转换回小数存储
            takerFee: values.takerFee / 100,
          };
        }
        return item;
      });
      setTradingFees(newTradingFees);
    }
    
    setIsModalVisible(false);
    setCurrentRecord(null);
  };

  const columns: ColumnsType<TradingFee> = [
    {
      title: '市对',
      dataIndex: 'pairName',
      key: 'pairName',
    },
    {
      title: 'Maker手续费',
      dataIndex: 'makerFee',
      key: 'makerFee',
    },
    {
      title: 'Taker手续费',
      dataIndex: 'takerFee',
      key: 'takerFee',
    },
    {
      title: '操作',
      key: 'action',
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
        columns={columns}
        dataSource={tradingFees}
        rowKey="id"
        loading={loading}
        pagination={false}
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