import React, { useState,useRef,useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Form, Button, message } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns,ActionType } from '@ant-design/pro-components';
import AssetAdjustmentForm from './components/AssetAdjustmentForm';
import {tenantSubWallet,tenantSubWalletList} from '@/services/ant-design-pro/fundsTools';
import { getCurrencyCoinList } from '@/services/ant-design-pro/inviteFriends';

const AssetAdjustment: React.FC = () => {
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [currencyList, setCurrencyList] = useState<any[]>([]);

  const subWalletList=async(params:any)=>{
    const res=await tenantSubWalletList({
      pageNo:params.current,
      pageSize:params.pageSize,
    });
    if(res.code==='0'){
      return {
        data: res.data.list,
        success: true,
        total: res.data.total,
      };
    }
  }

  const getCoinList=async()=>{
    let data={
      pageNo:1,
      pageSize:10000
    }
    const res=await getCurrencyCoinList(data);
    if(res.code==='0'){
      setCurrencyList(res.data.list)
    }
  }

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
    description:values.description
   }
    const res=await tenantSubWallet(data);
    if(res.code==='0'){
      message.success('资产调整操作已提交');
      actionRef.current?.reload();
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
      search: false,
    },
    {
      title: '币种', 
      dataIndex: 'coinId', 
      key: 'coinId',
      valueType:'select',
      fieldProps:{
        options:currencyList.map((item:any)=>({
          label:item.coinName,
          value:item.coinId
        }))
      }
    },

    { title: '金额', dataIndex: 'count', key: 'count', search: false },
    { title: '备注', dataIndex: 'description', key: 'description', search: false },
    { title: '操作人', dataIndex: 'operateId', key: 'operateId' , search: false},
    { 
      title: '时间', 
      dataIndex: 'createTime', 
      key: 'createTime',
      valueType: 'dateTime',
      search: false 
    },
  ];


useEffect(()=>{
  getCoinList();
},[])
  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        request={subWalletList}
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