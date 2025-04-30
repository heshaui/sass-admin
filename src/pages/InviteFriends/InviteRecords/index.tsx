import React, { useEffect,useState } from 'react';
import { PageContainer,ProTable } from '@ant-design/pro-components';
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
  const [userList, setUserList] = useState<InviteRecord[]>([]);

  //获取用户邀请详情列表
  const getUserList = async (params:any) => {
    let data={
      pageNo:params.current,
      pageSize:params.pageSize,
    }
    const res = await getUserInviteDetailList(data);
    if(res.code === '0'){
      return {
        data: res.data.list,
        success: true,
    }
  };
}

  const columns: ProColumns<InviteRecord>[] = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      search: false,
    },
    {
      title: 'UID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '注册账号',
      dataIndex: 'account',
      key: 'account',
      search: false,
    },
    {
      title: '邀请AID',
      dataIndex: 'parentUserId',
      key: 'parentUserId',
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      key: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '14D累计充值USDT',
      dataIndex: 'accumulate',
      key: 'accumulate',
      search: false,
    },
    {
      title: '邀请状态',
      dataIndex: 'inviteStatus',
      key: 'inviteStatus',
      // 邀请状态:1成功，0失败
      valueEnum: {
        1: { text: '成功' },
        0: { text: '失败' },
      },
    },
    {
      title: '发放状态',
      dataIndex: 'distributeStatus',
      key: 'distributeStatus',
      valueEnum: {
        1: { text: '已发放' },
        0: { text: '未发放' },
      },
    },
    {
      title: '操作',
      key: 'action',
      search: false,
      render: (_, record) => (
        <Space>
          {record.distributionStatus === '未发放' && record.invitationStatus === '成功' && (
            <Button type="link" style={{ color: '#1677ff' }}>手动发放</Button>
          )}
          {(record.distributionStatus === '已发放' || record.invitationStatus === '未成功') && (
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