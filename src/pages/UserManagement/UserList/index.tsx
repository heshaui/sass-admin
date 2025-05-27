import React, { useState, useEffect } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { getUserList, getUserDetail } from '@/services/ant-design-pro/UserManagement';
import type { UserItem } from '@/services/ant-design-pro/UserManagement';
import UserDetail from './components/UserDetail';
import { useIntl } from '@umijs/max';
import dayjs from 'dayjs';
const UserManagement: React.FC = () => {
  const intl = useIntl();
  const isAdmin = process.env.UMI_APP_ADMIN_FLAG === '1';
  const [loading, setLoading] = useState<boolean>(false);
  const [showUserDetail, setShowUserDetail] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserItem | null>(null);

    
  // Use real API to fetch user data
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
      console.error(intl.formatMessage({ id: 'userManagement.error.fetchList' }), error);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  // Fetch user details
  const fetchUserDetail = async (userId: string) => {
    try {
      const response = await getUserDetail(userId);
      if (response.code === '0') {
        setCurrentUser(response.data);
        setShowUserDetail(true);
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'userManagement.error.fetchDetail' }), error);
    }
  };

  // Define table columns
  const columns: ProColumns<UserItem>[] = [
    {
      title: intl.formatMessage({ id: 'userManagement.columns.userId' }),
      dataIndex: 'userId',
      key: 'userId',
      search: false,
    },
    ...(!isAdmin ? [] : [{
      title: intl.formatMessage({ id: 'userManagement.columns.tenantId' }),
      dataIndex: 'tenantId',
      key: 'tenantId',
    }]),
    {
      title: intl.formatMessage({ id: 'userManagement.columns.nickname' }),
      dataIndex: 'account',
      key: 'account',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'userManagement.columns.country' }),
      dataIndex: 'country',
      key: 'country',
      render: (text) => text || intl.formatMessage({ id: 'userManagement.notAvailable' }),
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'userManagement.columns.phone' }),
      dataIndex: 'phone',
      key: 'phone',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'userManagement.columns.email' }),
      dataIndex: 'email',
      key: 'email',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'userManagement.columns.createTime' }),
      dataIndex: 'createTime',
      key: 'createTime',
      valueType: 'dateTimeRange',
      search: {
        transform: (value) => ({
          startTime: value[0] ? new Date(value[0]).getTime() : undefined,
          endTime: value[1] ? new Date(value[1]).getTime() : undefined,
        }),
      },
      render: (_, record) => (
        record.createTime 
          ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') 
          : intl.formatMessage({ id: 'userManagement.notAvailable' })
      ),
    },
    {
      title: intl.formatMessage({ id: 'userManagement.columns.ip' }),
      dataIndex: 'ip',
      key: 'ip',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'userManagement.columns.actions' }),
      key: 'action',
      search: false,
      render: (_, record) => (
        <a onClick={() => fetchUserDetail(record.userId)}>
          {intl.formatMessage({ id: 'userManagement.actions.view' })}
        </a>
      ),
    },
    {
      title: intl.formatMessage({ id: 'userManagement.columns.account' }),
      key: 'account',
      hideInTable: true,
      dataIndex: 'account',
    },

  ];

     // Get userId from URL parameters and load user details
     useEffect(() => {
      const query = new URLSearchParams(location.search);
      const userId = query.get('userId');
      
      if (userId) {
        fetchUserDetail(userId);
      }
    }, [location.search]);
  if (showUserDetail) {
    return (
      <PageContainer title={intl.formatMessage({ id: 'userManagement.title' })}>
        <UserDetail 
          visible={showUserDetail} 
          userId={currentUser?.userId} 
          onClose={() => setShowUserDetail(false)} 
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer title={intl.formatMessage({ id: 'userManagement.title' })}>
      <ProTable<UserItem>
        columns={columns}
        request={fetchUserList}
        rowKey="userId"
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => intl.formatMessage(
            { id: 'userManagement.pagination.total' },
            { total }
          ),
        }}
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false,
          layout: 'vertical',
        }}
        dateFormatter="string"
        headerTitle={intl.formatMessage({ id: 'userManagement.list.title' })}
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