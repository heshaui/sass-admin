import React, { useState, useEffect } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Card, Input, DatePicker } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import { getGrantRecordList } from '@/services/ant-design-pro/inviteFriends';
const { RangePicker } = DatePicker;

interface RewardRecord {
  key: string;
  serialNumber: number;
  uid: string;
  accountNumber: string;
  inviterId: string;
  orderId: string;
  fee: string;
  commissionRate: string;
  commissionAmount: string;
  actualCommissionAmount: string;
  usdtValue: number;
  distributionType: '手动' | '自动';
  distributionTime: string;
}


const RewardRecords: React.FC = () => {


  const getList=async(params:any)=>{
    let data={
      pageNo:params.current,
      pageSize:params.pageSize,
    }
    const res=await getGrantRecordList(data);
    if(res.code==='0'){
      return {
        data: res.data.list,
        success: true,
        total: res.data.total,
      }
    }
  }
  
  const columns: ProColumns<RewardRecord>[] = [
    {
      title: '编号',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      search: false,
    },
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
      search: false,
    },
    {
      title: '注册账号',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
      search: false,
    },
    {
      title: '邀请人ID',
      dataIndex: 'inviterId',
      key: 'inviterId',
      render: (text) => <a>{text}</a>,
      search: false,
    },
    {
      title: '订单ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text) => <a>{text}</a>,
      search: false,
    },
    {
      title: '手续费',
      dataIndex: 'fee',
      key: 'fee',
      search: false,
    },
    {
      title: '返佣比例',
      dataIndex: 'commissionRate',
      key: 'commissionRate',
      search: false,
    },
    {
      title: '返佣金额',
      dataIndex: 'commissionAmount',
      key: 'commissionAmount',
      search: false,
    },
    {
      title: '实际返佣金额',
      dataIndex: 'actualCommissionAmount',
      key: 'actualCommissionAmount',
      search: false,
    },
    {
      title: 'USDT估值',
      dataIndex: 'usdtValue',
      key: 'usdtValue',
      search: false,
    },
    {
      title: '发放类型',
      dataIndex: 'distributionType',
      key: 'distributionType',
      valueEnum: {
        '手动': { text: '手动' },
        '自动': { text: '自动' },
      },
      formItemProps: {
        label: '发放类型',
      },
    },
    {
      title: '发放时间',
      dataIndex: 'distributionTime',
      key: 'distributionTime',
      valueType: 'dateTime',
      formItemProps: {
        label: '发放时间',
      },
      renderFormItem: () => <RangePicker placeholder={['年/月/日', '年/月/日']} />,
    },
  ];

  return (
    <PageContainer title="发放记录">
      <ProTable<RewardRecord>
        columns={columns}
        rowKey="key"
        pagination={{
          pageSize: 10,
        }}
        headerTitle="发放记录"
        request={getList}
      />
    </PageContainer>
  );
};

export default RewardRecords; 