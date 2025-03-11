import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useState } from 'react';
import type { ProColumns } from '@ant-design/pro-components';
import { getUserList } from '@/services/ant-design-pro/UserManagement';
import type { UserItem } from '@/services/ant-design-pro/UserManagement';





const UserManagement: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  // 使用真实API获取用户数据
  const fetchUserList = async (params: any) => {
    setLoading(true);
    try {
      const response = await getUserList({
        pageNo: params.current,
        pageSize: params.pageSize,
        tenantId: '1002',
        ...params
      });
      setLoading(false);
      return {
        data: response.data.list|| [],
        success: response.code==='0'?true:false,
        total: response.data.count,
      };
    } catch (error) {
      setLoading(false);
      console.error('获取用户列表失败', error);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  // 定义表格列
  const columns: ProColumns<UserItem>[] = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 80,
      search: false,
    },
    {
      title: '昵称',
      dataIndex: 'account',
      key: 'account',
      width: 150,
      search: false,
    },
    {
      title: '国家',
      dataIndex: 'countryCode',
      key: 'countryCode',
      width: 80,
      render: (text) => text || '--',
      search: false,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      search: false,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 180,
      search: false,
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
      valueType: 'dateTime',
      
     
    },
    {
      title: '登录IP',
      dataIndex: 'loginIp',
      key: 'loginIp',
      width: 150,
      search: false,
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      search: false,
      render: () => <a>查看</a>,
    },
    {
      title: '账号',
      key: 'account',
      hideInTable: true,
      dataIndex: 'account',
    },

  ];

  return (
    <PageContainer title="用户管理">
      <ProTable<UserItem>
        columns={columns}
        request={fetchUserList}
        rowKey="userId"
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false,
          layout: 'vertical',
        }}
        dateFormatter="string"
        headerTitle="用户列表"
        options={{
          setting: {
            draggable: true,
            checkable: true,
          },
          reload: true,
        }}
      />
    </PageContainer>
  );
};

export default UserManagement; 