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

const mockData: InviteRecord[] = [
  {
    key: '1',
    serialNumber: 3,
    uid: '123123',
    registrationAccount: '123*456',
    inviteAID: '789456',
    registrationTime: '2022-12-16 12:12:12',
    rechargeAmount: 12.03,
    invitationStatus: '未成功',
    distributionStatus: '未发放',
  },
  {
    key: '2',
    serialNumber: 2,
    uid: '123123',
    registrationAccount: '123*456',
    inviteAID: '789456',
    registrationTime: '2022-12-16 12:12:12',
    rechargeAmount: 50.00,
    invitationStatus: '成功',
    distributionStatus: '已发放',
  },
  {
    key: '3',
    serialNumber: 2,
    uid: '123123',
    registrationAccount: '123*456',
    inviteAID: '789456',
    registrationTime: '2022-12-16 12:12:12',
    rechargeAmount: 52.03,
    invitationStatus: '成功',
    distributionStatus: '未发放',
  },
];

const InviteRecords: React.FC = () => {
  const [userList, setUserList] = useState<InviteRecord[]>([]);

  //获取用户邀请详情列表
  const getUserList = async () => {
    const res = await getUserInviteDetailList();
    if(res.code === '0'){
      setUserList(res.data);
    }
  };

  const columns: ProColumns<InviteRecord>[] = [
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
    },
    {
      title: '注册账号',
      dataIndex: 'registrationAccount',
      key: 'registrationAccount',
      search: false,
    },
    {
      title: '邀请AID',
      dataIndex: 'inviteAID',
      key: 'inviteAID',
    },
    {
      title: '注册时间',
      dataIndex: 'registrationTime',
      key: 'registrationTime',
      valueType: 'dateTime',
      sorter: (a, b) => a.registrationTime.localeCompare(b.registrationTime),
    },
    {
      title: '14D累计充值USDT',
      dataIndex: 'rechargeAmount',
      key: 'rechargeAmount',
      search: false,
    },
    {
      title: '邀请状态',
      dataIndex: 'invitationStatus',
      key: 'invitationStatus',
      valueEnum: {
        成功: { text: '成功', status: 'Success' },
        未成功: { text: '未成功', status: 'Error' },
      },
    },
    {
      title: '发放状态',
      dataIndex: 'distributionStatus',
      key: 'distributionStatus',
      valueEnum: {
        已发放: { text: '已发放', status: 'Success' },
        未发放: { text: '未发放', status: 'Default' },
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
    getUserList();
  }, []);
  return (
    <PageContainer>
      <ProTable<InviteRecord>
        columns={columns}
        dataSource={userList}
        rowKey="key"
        pagination={{ pageSize: 10 }}
        search={{
          labelWidth: 'auto',
        }}
        dateFormatter="string"
      />
    </PageContainer>
  );
};

export default InviteRecords; 