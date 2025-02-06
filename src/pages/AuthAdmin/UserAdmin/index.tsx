import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Select, Space, Tag } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import React from 'react';

const UserAdmin: React.FC = () => {
  // 表格的列配置
  const columns = [
    {
      title: '管理员ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (text ? text : '--'),
    },
    {
      title: '2FA',
      dataIndex: 'twoFactorAuth',
      key: 'twoFactorAuth',
      render: (text) =>
        text === '已开启' ? <Tag color="green">已开启</Tag> : <Tag color="red">未开启</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) =>
        text === '正常' ? <Tag color="green">正常</Tag> : <Tag color="red">禁用</Tag>,
    },
    {
      title: '选项',
      key: 'action',
      render: () => (
        <Space>
          <a style={{ color: '#ff4d4f' }}>操作</a>
        </Space>
      ),
    },
  ];

  // 模拟数据
  const data = Array.from({ length: 10 }, (_, index) => ({
    id: 'USDT',
    nickname: 'XXXXXXXXXXX',
    remark: `0x1234....123456`,
    role: Math.floor(Math.random() * 100),
    phone: Math.floor(Math.random() * 100),
    email: index % 2 === 0 ? `${Math.random().toFixed(4)}@mail.com` : '',
    twoFactorAuth: index % 3 === 0 ? '已开启' : '未开启',
    status: index % 2 === 0 ? '正常' : '禁用',
  }));

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={data}
        search={{
          labelWidth: 'auto',
        }}
        options={{
          density: false,
          fullScreen: true,
          reload: false,
          setting: false,
        }}
        pagination={{
          showQuickJumper: true,
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        toolBarRender={() => [
          <Select placeholder="状态" key="status" style={{ width: 120 }}>
            <Select.Option value="全部">全部</Select.Option>
            <Select.Option value="正常">正常</Select.Option>
            <Select.Option value="禁用">禁用</Select.Option>
          </Select>,
          <Button key="search" type="primary">
            查询
          </Button>,
          <Button key="reset" icon={<ReloadOutlined />}>
            重置
          </Button>,
          <Button key="create" icon={<PlusOutlined />} type="primary">
            新建
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default UserAdmin;