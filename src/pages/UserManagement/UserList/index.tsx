import React ,{ useState,useEffect } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { getUserList, getUserDetail } from '@/services/ant-design-pro/UserManagement';
import type { UserItem } from '@/services/ant-design-pro/UserManagement';
import UserDetail from './components/UserDetail';

import dayjs from 'dayjs';
const UserManagement: React.FC = () => {
  const isAdmin = process.env.UMI_APP_ADMIN_FLAG === '1';
  const [loading, setLoading] = useState<boolean>(false);
  const [showUserDetail, setShowUserDetail] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserItem | null>(null);

    
  // 使用真实API获取用户数据
  const fetchUserList = async (params: any) => {
    setLoading(true);
    try {
      const response = await getUserList({
        pageNo: params.current,
        pageSize: params.pageSize,
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

  // 获取用户详情
  const fetchUserDetail = async (userId: string) => {
    try {
      const response = await getUserDetail(userId);
      if (response.code === '0') {
        setCurrentUser(response.data);
        setShowUserDetail(true);
      }
    } catch (error) {
      console.error('获取用户详情失败', error);
    }
  };

  // 定义表格列
  const columns: ProColumns<UserItem>[] = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      search: false,
    },
    ...(!isAdmin ? [] : [{
      title: '商户id',
      dataIndex: 'tenantId',
      key: 'tenantId',
    }]),
    {
      title: '昵称',
      dataIndex: 'account',
      key: 'account',
      search: false,
    },
    {
      title: '国家',
      dataIndex: 'country',
      key: 'country',
      render: (text) => text || '--',
      search: false,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      search: false,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      search: false,
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      key: 'createTime',
      valueType: 'dateTimeRange',
      search: {
        transform: (value) => {
          return {
            startTime: value[0] ? new Date(value[0]).getTime() : undefined,
            endTime: value[1] ? new Date(value[1]).getTime() : undefined,
          };
        },
      },
      render: (_, record) => {
        return record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') : '--';
      },
    },
    {
      title: '登录IP',
      dataIndex: 'ip',
      key: 'ip',
      search: false,
    },
    {
      title: '操作',
      key: 'action',
      search: false,
      render: (_, record) => <a onClick={() => fetchUserDetail(record.userId)}>查看</a>,
    },
    {
      title: '账号',
      key: 'account',
      hideInTable: true,
      dataIndex: 'account',
    },

  ];

     // 从URL参数获取userId并加载用户详情
     useEffect(() => {
      const query = new URLSearchParams(location.search);
      const userId = query.get('userId');
      
      if (userId) {
        fetchUserDetail(userId);
      }
    }, [location.search]);
  if (showUserDetail) {
    return (
      <PageContainer title="用户管理">
        <UserDetail 
          visible={showUserDetail} 
          userId={currentUser?.userId} 
          onClose={() => setShowUserDetail(false)} 
        />
      </PageContainer>
    );
  }

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