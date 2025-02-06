import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import { useIntl } from '@umijs/max';
import React from 'react';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';

const RoleAdmin: React.FC = () => {
  const intl = useIntl();

  // 表格的列配置
  const columns = [
    {
      title: '角色ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <a>修改</a>
          <a style={{ color: 'red' }}>删除</a>
        </Space>
      ),
    },
  ];

  // 模拟数据
  const data = Array.from({ length: 10 }, (_, index) => ({
    id: Math.floor(Math.random() * 100),
    name: 'XXXXXXXXXXX',
    description: 'XXXXXXXXXXX',
    createdTime: new Date().toISOString(),
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

export default RoleAdmin;