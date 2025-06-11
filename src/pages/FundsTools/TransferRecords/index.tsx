import React, { useState } from 'react';
import { Card } from 'antd';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { fundFlowDirectionOperationList } from '@/services/ant-design-pro/fundsTools';
import { useIntl } from '@umijs/max';
import type { ProColumns, RequestData } from '@ant-design/pro-components';

// key  value 对应
const fromAccountTypeMap = {
  'company_general_account': 'transferTool.account.company_general_account',
  'withdrawal_fee_account': 'transferTool.account.withdrawal_fee_account',
  'recharge_fee_account': 'transferTool.account.recharge_fee_account',
  'invite_rebate_account': 'transferTool.account.invite_rebate_account',
  'fee_account': 'transferTool.account.fee_account',
  'virtual_accounts': 'transferTool.account.virtual_accounts',
  'total_withdrawal_account':'transferTool.account.total_withdrawal_account'
};

const sceneTypeMap = {
  'M2M': 'transferTool.scene.M2M',
  'M2U': 'transferTool.scene.M2U',
  'U2M': 'transferTool.scene.U2M',
  'U2U': 'transferTool.scene.U2U'
};

type FromAccountTypeMap = keyof typeof fromAccountTypeMap;

type SceneTypeMap = keyof typeof sceneTypeMap;

interface TransferRecord {
  key: string;
  createTime: string;
  fromAccount: string;
  fromAccountType: FromAccountTypeMap;
  toAccount: string;
  toAccountType: string;
  sceneType: SceneTypeMap;
  amount: string;
  remark: string;
  operator: string;
}
const TransferRecords: React.FC = () => {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(false);

  const getTransferRecords = async (
    params: any,
    sort: Record<string, 'ascend' | 'descend' | null>,
    filter: Record<string, (string | number)[] | null>,
  ): Promise<Partial<RequestData<TransferRecord>>> => {
    setLoading(true);
    try {
      const res = await fundFlowDirectionOperationList({
        pageNo: params.current,
        pageSize: params.pageSize,
      });

      if (res.code === '0') {
        return {
          data: res.data.list,
          success: true,
          total: res.data.count,
        };
      }
      return { data: [], success: false, total: 0 };
    } catch (error) {
      console.error('Failed to fetch transfer records:', error);
      return { data: [], success: false, total: 0 };
    } finally {
      setLoading(false);
    }
  };

  const columns: ProColumns<TransferRecord>[] = [
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
      render: (_, record) => {
        const text = fromAccountTypeMap[record.fromAccountType];
        return intl.formatMessage({ id: text });
      }
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
      render: (_, record) => {
        const text = sceneTypeMap[record.sceneType];
        return intl.formatMessage({ id: text });
      }
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
