import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { PageContainer,ProTable } from '@ant-design/pro-components';
import { useIntl } from 'umi';
import { fundFlowDirectionOperationList } from '@/services/ant-design-pro/fundsTools';

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
  const [data, setData] = useState<TransferRecord[]>([]);

const getTransferRecords=async(params:any)=>{
  const res=await fundFlowDirectionOperationList({
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

  const columns: ColumnsType<TransferRecord> = [
    {
      title: '时间',
      dataIndex: 'createTime', 
      key: 'createTime',
      valueType: 'dateTime',

    },
    {
      title: '转出账户',
      dataIndex: 'fromAccountId',
      key: 'fromAccountId',
    },
    {
      title: '转出账户类型',
      dataIndex: 'fromAccountType',
      key: 'fromAccountType',

    },
    {
      title: '转入账户',
      dataIndex: 'toAccountType',
      key: 'toAccountType',
    },
    {
      title: '转入账户类型',
      dataIndex: 'sceneType',
      key: 'sceneType',

    },
    {
      title: '转账金额',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',

    },
    {
      title: '操作人',
      dataIndex: 'operateId',
      key: 'operateId',

    },
  ];

  return (
    <PageContainer>
      <Card>
        <h2>转账记录</h2>
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