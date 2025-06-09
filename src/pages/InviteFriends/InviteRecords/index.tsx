import React, { useEffect,useState } from 'react';
import { PageContainer,ProTable } from '@ant-design/pro-components';
import { useIntl } from 'umi';
import { Tag, Button, Space } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import { getUserInviteDetailList, } from '@/services/ant-design-pro/inviteFriends';

interface InviteRecord {
  key: string;
  serialNumber: number;
  uid: string;
  registrationAccount: string;
  inviteAID: string;
  registrationTime: string;
  rechargeAmount: number;
  invitationStatus: '成功' | '未成功';
  distributionStatus: '已发放' | '未发放';
}



const InviteRecords: React.FC = () => {
  const intl = useIntl();
  const [userList, setUserList] = useState<InviteRecord[]>([]);

  //获取用户邀请详情列表
  const getUserList = async (params:any) => {
    let data={
      pageNo:params.current,
      pageSize:params.pageSize,
      account:params.account, 
      parentUserId:params.parentUserId,
    }
    const res = await getUserInviteDetailList(data);
    if(res.code === '0'){
      return {
        data: res.data.list,
        success: true,
        total:res.data.count
    }
  };
}

  const columns: ProColumns<InviteRecord>[] = [
    {
      title: intl.formatMessage({ id: 'inviteFriends.inviteRecords.column.id' }),
      dataIndex: 'id',
      key: 'id',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.inviteRecords.column.userId' }),
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.inviteRecords.column.account' }),
      dataIndex: 'account',
      key: 'account',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.inviteRecords.column.parentUserId' }),
      dataIndex: 'parentUserId',
      key: 'parentUserId',
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.inviteRecords.column.createTime' }),
      dataIndex: 'createTime',
      key: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.inviteRecords.column.accumulate' }),
      dataIndex: 'accumulate',
      key: 'accumulate',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.inviteRecords.column.inviteStatus' }),
      dataIndex: 'inviteStatus',
      key: 'inviteStatus',
      // 邀请状态:1成功，0失败
      valueEnum: {
        1: { text: intl.formatMessage({ id: 'inviteFriends.inviteRecords.status.success' }) },
        0: { text: intl.formatMessage({ id: 'inviteFriends.inviteRecords.status.failed' }) },
      },
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.inviteRecords.column.distributeStatus' }),
      dataIndex: 'distributeStatus',
      key: 'distributeStatus',
      valueEnum: {
        1: { text: intl.formatMessage({ id: 'inviteFriends.inviteRecords.distribute.distributed' }) },
        0: { text: intl.formatMessage({ id: 'inviteFriends.inviteRecords.distribute.undistributed' }) },
      },
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.inviteRecords.column.action' }),
      key: 'action',
      search: false,
      render: (_, record) => (
        <Space>
          {record.distributionStatus === intl.formatMessage({ id: 'inviteFriends.inviteRecords.distribute.undistributed' }) && 
           record.invitationStatus === intl.formatMessage({ id: 'inviteFriends.inviteRecords.status.success' }) && (
            <Button type="link" style={{ color: '#1677ff' }}>
              {intl.formatMessage({ id: 'inviteFriends.inviteRecords.action.manualDistribute' })}
            </Button>
          )}
          {(record.distributionStatus === intl.formatMessage({ id: 'inviteFriends.inviteRecords.distribute.distributed' }) || 
            record.invitationStatus === intl.formatMessage({ id: 'inviteFriends.inviteRecords.status.failed' })) && (
            <span>-</span>
          )}
        </Space>
      ),
    },
  ];

  useEffect(() => {

  }, []);
  return (
    <PageContainer>
      <ProTable<InviteRecord>
        columns={columns}
        rowKey="key"
        pagination={{ pageSize: 10 }}
        search={{
          labelWidth: 'auto',
        }}
        request={getUserList}
        dateFormatter="string"
      />
    </PageContainer>
  );
};

export default InviteRecords; 