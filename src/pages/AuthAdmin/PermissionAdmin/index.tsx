import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { AuthorityList } from '@/services/ant-design-pro/role';

const PermissionAdmin: React.FC = () => {
  // 表格数据状态
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 表格列配置
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '父级ID',
      dataIndex: 'parentId',
      key: 'parentId',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: 'icon',
      dataIndex: 'icon',
      key: 'icon',
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

  // 获取权限列表
  const getAuthorityList = async (params = { pageNo: 1, pageSize: 10 }) => {
    setLoading(true); // 设置加载状态
    try {
      const res = await AuthorityList(params); // 调用 API
      if (res?.data) {
        setData(res.data.list || []); // 更新数据
      }
    } catch (error) {
      console.error('Failed to fetch authority list:', error);
    } finally {
      setLoading(false); // 结束加载状态
    }
  };

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        request={async (params) => {
          await getAuthorityList({
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
          <Button
            key="search"
            type="primary"
            onClick={() => getAuthorityList({ pageNo: 1, pageSize: 10 })}
          >
            查询
          </Button>,
          <Button
            key="reset"
            icon={<ReloadOutlined />}
            onClick={() => getAuthorityList({ pageNo: 1, pageSize: 10 })}
          >
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

export default PermissionAdmin;