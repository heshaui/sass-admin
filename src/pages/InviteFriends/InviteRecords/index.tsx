import React, { useEffect, useState, useRef } from 'react';
import { PageContainer,ProTable } from '@ant-design/pro-components';
import { useIntl } from 'umi';
import { Tag, Button, Space, message } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import { getUserInviteDetailList,batchGrantRebate } from '@/services/ant-design-pro/inviteFriends';

interface InviteRecord {
  id: string;
  userId: string;
  account: string;
  parentUserId: string;
  createTime: string;
  accumulate: number;
  inviteStatus: number; // 1: success, 0: failed
  distributeStatus: number; // 1: distributed, 0: undistributed
  key?: string;
}



const InviteRecords: React.FC = () => {
  const intl = useIntl();
  const [userList, setUserList] = useState<InviteRecord[]>([]);
  const proTableRef = useRef<any>();

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


const handleSend = async (record: InviteRecord) => {
  try {

    
    // Call the API with the user ID
    const res = await batchGrantRebate({ ids: record.id });
    

    
    if (res.code === '0'&&res.data) {
      // Refresh the table data after successful distribution
      proTableRef.current?.reload();
      message.success(intl.formatMessage({ id: 'common.success' }) || 'Distribution successful');
    } else {
      message.error(res.msg || intl.formatMessage({ id: 'common.fail' }) || 'Distribution failed');
    }
  } catch (error) {
    console.error('Manual distribution error:', error);
    message.error(intl.formatMessage({ id: 'common.fail' }) || 'Distribution failed');
  }
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
      render: (_, record: InviteRecord) => (
        <Space>
          {record.distributeStatus === 0 && 
           record.inviteStatus === 1 && (
            <Button type="link" style={{ color: '#1677ff' }} onClick={() => handleSend(record)}>
              {intl.formatMessage({ id: 'inviteFriends.inviteRecords.action.manualDistribute' })}
            </Button>
          )}
          {(record.distributeStatus === 1 || 
            record.inviteStatus === 0) && (
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
        actionRef={proTableRef}
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