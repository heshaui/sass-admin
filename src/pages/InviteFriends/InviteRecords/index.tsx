import React, { useEffect, useState, useRef } from 'react';
import { PageContainer,ProTable } from '@ant-design/pro-components';
import { useIntl } from 'umi';
import {  Button, Space, message, Modal, Input } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';
import { getUserInviteDetailList,grantUserRebates,getUserGrantRebate} from '@/services/ant-design-pro/inviteFriends';

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
  actualCoinId?: string;
}



const InviteRecords: React.FC = () => {
  const intl = useIntl();
  const [userList, setUserList] = useState<InviteRecord[]>([]);
  const proTableRef = useRef<any>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<InviteRecord | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [coinType, setCoinType] = useState<string>('');

  //获取用户邀请详情列表
  const getUserList = async (params:any) => {
    let data={
      pageNo:params.current,
      pageSize:params.pageSize,
      account:params.account, 
      userId:params.userId,
      inviteStatus:params.inviteStatus,
      distributeStatus:params.distributeStatus
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


const showModal = async (record: InviteRecord) => {
  try {
    const getUserGrantRebateRes = await getUserGrantRebate({userId:record.userId});
    if(getUserGrantRebateRes.code === '0'){
      setCurrentRecord(record);
      setAmount(getUserGrantRebateRes.data.amount);
      setCoinType(getUserGrantRebateRes.data.actualCoinId );
      setIsModalVisible(true);
    } else {
      message.error(getUserGrantRebateRes.msg || intl.formatMessage({ id: 'common.fail' }) || 'Failed to get user information');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    message.error(intl.formatMessage({ id: 'common.fail' }) || 'Failed to get user information');
  }
}

const handleModalCancel = () => {
  setIsModalVisible(false);
  setCurrentRecord(null);
}

const handleSend = async () => {
  if (!currentRecord) return;
  
  try {
    const res = await grantUserRebates({ 
      userId: currentRecord.userId, 
      amount: amount,
      actualCoinId: coinType
    });
    
    if (res.code === '0' && res.data) {
      // Refresh the table data after successful distribution
      proTableRef.current?.reload();
      message.success(intl.formatMessage({ id: 'common.success' }) || 'Distribution successful');
      setIsModalVisible(false);
      setCurrentRecord(null);
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

    },

    {
      title: intl.formatMessage({ id: 'inviteFriends.inviteRecords.column.parentUserId' }),
      dataIndex: 'parentUserId',
      key: 'parentUserId',
      search:false
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.inviteRecords.column.createTime' }),
      dataIndex: 'createTime',
      key: 'createTime',
      valueType: 'dateTime',
      search:false
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
            <Button type="link" style={{ color: '#1677ff' }} onClick={() => showModal(record)}>
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
      <Modal
        title={intl.formatMessage({ id: 'inviteFriends.inviteRecords.action.manualDistribute' })}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            {intl.formatMessage({ id: 'common.cancel' })}
          </Button>,
          <Button key="submit" type="primary" onClick={handleSend} disabled={amount === 0||amount===null}>
            {intl.formatMessage({ id: 'common.ok' })}
          </Button>,
        ]}
      >
        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px' }}>{intl.formatMessage({ id: 'inviteFriends.rewardRecords.amount' })}</div>
          <Input 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            addonAfter={coinType} 
            disabled={true}
            style={{ width: '40%' }} 
          />
        </div>
        <div style={{ border: '1px solid #1677ff', borderRadius: '4px', padding: '10px', backgroundColor: '#f0f5ff' }}>
          <p style={{ margin: 0 }}>{intl.formatMessage({ id: 'inviteFriends.rewardRecords.confirm' })}</p>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default InviteRecords; 