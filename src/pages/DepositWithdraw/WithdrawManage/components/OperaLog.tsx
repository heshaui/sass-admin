import { ProTable } from '@ant-design/pro-components';
import { message } from 'antd';
import React, { useEffect, useRef } from 'react';
// import type { ProFormInstance } from '@ant-design/pro-components';
import { gatewayAccessLogList } from '@/services/ant-design-pro/UserManagement';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
// interface LogRecord {
//   id: string;
//   path: string;
//   ipAddress: string;
//   requestSource: string;
//   networkType: string;
//   operationName: string;
//   requestTime: string;
// }
interface LogProps {
  userId: string | number;
}

const Log: React.FC<LogProps> = ({ userId }) => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  // const formRef = useRef<ProFormInstance>();

  const getLog = async (params: any) => {
    const res = await gatewayAccessLogList({
      userId: userId,
      pageNo: params.current,
      pageSize: params.pageSize,
    });
    if (res.code === '0') {
      return {
        data: res.data.list,
        success: true,
        total: res.data.count || res.data.list.length,
      };
    } else {
      message.error(res.message);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  useEffect(() => {
    actionRef.current?.reload();
  }, [userId]);

  const columns: ProColumns<any>[] = [
    {
      valueType: 'index',
      width: 50,
    },
    {
      title: intl.formatMessage({ id: 'operaLog.column.requestPath' }),
      dataIndex: 'requestPath',
      key: 'requestPath',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'operaLog.column.clientIp' }),
      dataIndex: 'clientIp',
      key: 'clientIp',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'operaLog.column.reqSource' }),
      dataIndex: 'reqSource',
      key: 'reqSource',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'operaLog.column.networkType' }),
      dataIndex: 'networkType',
      key: 'networkType',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'operaLog.column.beforeValue' }),
      dataIndex: 'beforeValue',
      key: 'beforeValue',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({ id: 'operaLog.column.timestamp' }),
      dataIndex: 'timestamp',
      key: 'timestamp',
      valueType: 'dateTime',
      ellipsis: true,
    },
  ];

  return (
    <ProTable
      columns={columns}
      bordered
      rowKey="id"
      search={false}
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50'],
        showTotal: (total) => intl.formatMessage({ id: 'operaLog.pagination.total' }, { total }),
      }}
      request={getLog}
    />
  );
};

export default Log;
