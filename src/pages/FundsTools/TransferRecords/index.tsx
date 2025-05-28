import React, { useState } from 'react';
import { Card } from 'antd';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { fundFlowDirectionOperationList } from '@/services/ant-design-pro/fundsTools';
import { useIntl } from 'umi';

interface TransferRecord {
  key: string;
  createTime: string;
  fromAccount: string;
  fromAccountType: string;
  toAccount: string;
  toAccountType: string;
  amount: string;
  remark: string;
  operator: string;
}

const TransferRecords: React.FC = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(false);

const getTransferRecords=async(params:any)=>{
  const res=await fundFlowDirectionOperationList({
    pageNo:params.current,
    pageSize:params.pageSize,
  });
  if(res.code==='0'){
    return {
      data: res.data.list,
      success: true,
      total: res.data.count,
    };
  }
}

  const columns: ColumnsType<TransferRecord> = [
    {
      title: intl.formatMessage({ id: 'transferRecords.column.createTime' }),
      dataIndex: 'createTime', 
      key: 'createTime',
      valueType: 'dateTime',

    },
    {
      title: intl.formatMessage({ id: 'transferRecords.column.fromAccount' }),
      dataIndex: 'fromAccountId',
      key: 'fromAccountId',
    },
    {
      title: intl.formatMessage({ id: 'transferRecords.column.fromAccountType' }),
      dataIndex: 'fromAccountType',
      key: 'fromAccountType',

    },
    {
      title: intl.formatMessage({ id: 'transferRecords.column.toAccount' }),
      dataIndex: 'toAccountType',
      key: 'toAccountType',
    },
    {
      title: intl.formatMessage({ id: 'transferRecords.column.toAccountType' }),
      dataIndex: 'sceneType',
      key: 'sceneType',

    },
    {
      title: intl.formatMessage({ id: 'transferRecords.column.amount' }),
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: intl.formatMessage({ id: 'transferRecords.column.description' }),
      dataIndex: 'description',
      key: 'description',

    },
    {
      title: intl.formatMessage({ id: 'transferRecords.column.operator' }),
      dataIndex: 'operateId',
      key: 'operateId',

    },
  ];

  return (
    <PageContainer>
      <Card>
        <h2>{intl.formatMessage({ id: 'transferRecords.title' })}</h2>
        <ProTable
          columns={columns}
          request={getTransferRecords}
          search={false}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </PageContainer>
  );
};

export default TransferRecords; 