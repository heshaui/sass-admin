import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Form, Button, message } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import AssetAdjustmentForm from './components/AssetAdjustmentForm';
import {tenantSubWallet} from '@/services/ant-design-pro/fundsTools';

const AssetAdjustment: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [formVisible, setFormVisible] = useState<boolean>(false);

  const onFinish = (values: any) => {
    setLoading(true);
    console.log('提交的数据:', values);
    
    // 这里添加调用API的逻辑
    setTimeout(() => {
      message.success('资产调整成功');
      form.resetFields();
      setLoading(false);
    }, 1000);
  };

  const handleFormSubmit = async(values: any) => {
    if(values.direction==='increase'){
      values.to=values.account;
    }else{
      values.form=values.account;
    }
   let data={
    sceneTypeEnum:'M2M',
    coinId:values.currency,
    count:values.amount,
    googleCode:values.googleCode,
    form:values?.form,
    to:values?.to,
   }
    const res=await tenantSubWallet(data);
    if(res.code==='0'){
      message.success('资产调整操作已提交');
    }else{
      message.error(res.message);
    }
    setFormVisible(false);
  };

  // 定义ProTable的列
  const columns: ProColumns[] = [
    { title: '编号', dataIndex: 'id', key: 'id', search: false },
    { 
      title: '币种', 
      dataIndex: 'coinName', 
      key: 'coinName',
    },
    { title: '金额', dataIndex: 'amount', key: 'amount', search: false },
    { title: '备注', dataIndex: 'reason', key: 'reason', search: false },
    { title: '操作人', dataIndex: 'operator', key: 'operator' , search: false},
    { 
      title: '时间', 
      dataIndex: 'operateTime', 
      key: 'operateTime',
      valueType: 'dateTime',
    },
  ];

  // 模拟数据
  const mockData = [
  
    // 可以添加更多模拟数据
  ];

  return (
    <PageContainer>
      <ProTable
        columns={columns}
        request={async (params, sorter, filter) => {
          // 这里可以替换为实际的API请求
          return {
            data: mockData,
            success: true,
            total: mockData.length,
          };
        }}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
        toolBarRender={() => [
          <Button 
            key="button" 
            type="primary" 
            onClick={() => setFormVisible(true)}
          >
            增减操作
          </Button>,
        ]}
        search={{
          labelWidth: 'auto',
        }}
      />
      
      <AssetAdjustmentForm
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        onSubmit={handleFormSubmit}
      />
    </PageContainer>
  );
};

export default AssetAdjustment; 