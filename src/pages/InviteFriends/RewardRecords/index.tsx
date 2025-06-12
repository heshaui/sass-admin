import React from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useIntl } from 'umi';
import type { ProColumns, RequestData } from '@ant-design/pro-components';
import { getGrantRecordList } from '@/services/ant-design-pro/inviteFriends';
import dayjs from 'dayjs';
interface RewardRecord {
  id: string;
  serialNumber: number;
  uid: string;
  account: string;
  parentUserId: string;
  orderId: string;
  commission: string;
  rebateRatio: string;
  rebateAmount: string;
  actualRebateAmount: string;
  valuation: number;
  type: string;
  createTime: string;
  coinName: string;
  actualCoinName: string;
}


const RewardRecords: React.FC = () => {
  const intl = useIntl();


  const getList=async(params:any)=>{
    console.log('123',params) 
    if(!params.dateTimeRange){
      params.dateTimeRange=[null,null];
    }
    let data={
      pageNo:params.current,
      pageSize:params.pageSize,
      account:params.account,
      startTime:params?.dateTimeRange[0]?dayjs(params?.dateTimeRange[0]).valueOf():null,
      endTime:params?.dateTimeRange[1]?dayjs(params?.dateTimeRange[1]).valueOf():null,
    }
    try {
      const res=await getGrantRecordList(data);
      if(res.code==='0'){
        return {
          data: res.data.list,
          success: true,
          total: res.data.count,
        }
      }
      return {
        data: [],
        success: false,
        total: 0,
      }
    } catch (error) {
      console.error('Failed to fetch reward records:', error);
      return {
        data: [],
        success: false,
        total: 0,
      }
    }
  }
  
  const columns: ProColumns<RewardRecord>[] = [
    {
      title: intl.formatMessage({ id: 'inviteFriends.rewardRecords.column.id' }),
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.rewardRecords.column.uid' }),
      dataIndex: 'uid',
      key: 'uid',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.rewardRecords.column.account' }),
      dataIndex: 'account',
      key: 'account',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.rewardRecords.column.accountInfo' }),
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.rewardRecords.column.parentUserId' }),
      dataIndex: 'parentUserId',
      key: 'parentUserId',
      render: (text) => <a>{text}</a>,
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.rewardRecords.column.orderId' }),
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text) => <a>{text}</a>,
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.rewardRecords.column.fee' }),
      dataIndex: 'commission',
      key: 'commission',
      search: false,
      render: (_, record) => `${record?.commission} ${record?.coinName}`,
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.rewardRecords.column.rebateRatio' }),
      dataIndex: 'rebateRatio',
      key: 'rebateRatio',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.rewardRecords.column.rebateAmount' }),
      dataIndex: 'rebateAmount',
      key: 'rebateAmount',
      search: false,
      render: (_, record) => `${record?.rebateAmount} ${record?.coinName}`,
    },  
    {
      title: intl.formatMessage({ id: 'inviteFriends.rewardRecords.column.actualRebateAmount' }),
      dataIndex: 'actualRebateAmount',
      key: 'actualRebateAmount',
      search: false,
      render: (_, record) => `${record?.actualRebateAmount} ${record?.actualCoinName}`,
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.rewardRecords.column.usdtValue' }),
      dataIndex: 'valuation',
      key: 'valuation',
      search: false,

    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.rewardRecords.column.type' }),
      dataIndex: 'type',
      key: 'type',
      valueEnum: {
        // 1 增加 2 扣减 3 冻结 4 解冻
        '1': { text: intl.formatMessage({ id: 'inviteFriends.rewardRecords.type.auto' }) },
        '2': { text: intl.formatMessage({ id: 'inviteFriends.rewardRecords.type.manual' }) },
      },
      formItemProps: {
        label: intl.formatMessage({ id: 'inviteFriends.rewardRecords.column.type' }),
      },
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.rewardRecords.column.createTime' }),
      dataIndex: 'createTime',
      key: 'createTime',
      valueType: 'dateTime',
      search: false,
      
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.rewardRecords.column.dateTimeRange' }),
      valueType: 'dateTimeRange',
      key: 'dateTimeRange',
      hideInTable: true,
      
    },
  ];

  return (
    <PageContainer title={intl.formatMessage({ id: 'inviteFriends.rewardRecords.title' })}>
      <ProTable<RewardRecord>
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
        headerTitle={intl.formatMessage({ id: 'inviteFriends.rewardRecords.title' })}
        request={getList}
      />
    </PageContainer>
  );
};

export default RewardRecords; 