import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Select, Space, Tag } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { employeeList} from '@/services/ant-design-pro/authAdmin';

const UserAdmin: React.FC = () => {
   const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
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

  const getUserList = async (params = { pageNo: 1, pageSize: 10 }) => {
    try {
      const res = await employeeList(params);
      if (res?.data) {
        setData(res.data.list || []); // 更新数据
      }
    } catch (error) {
      console.error('Failed to fetch user list:', error);
      return [];
    }
  }

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        request={async (params) => {
          await getUserList({
            pageNo: params.current,
            pageSize: params.pageSize,
          });
        }}
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