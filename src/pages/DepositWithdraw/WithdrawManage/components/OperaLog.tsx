import React, { useRef, useEffect } from 'react';
import { message } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { gatewayAccessLogList } from '@/services/ant-design-pro/UserManagement';
import { useIntl } from 'umi';
interface LogRecord {
  id: string;
  path: string;
  ipAddress: string;
  requestSource: string;
  networkType: string;
  operationName: string;
  requestTime: string;
}
interface LogProps {
    userId: string | number;
  }
  

const Log: React.FC<LogProps> = ({ userId }) => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const getLog=async(params:any)=>{
    const res=await gatewayAccessLogList({ userId: userId,pageNo:params.current,pageSize:params.pageSize});
    if(res.code==='0'){
      return {
        data: res.data.list,
        success: true,
        total: res.data.count || res.data.list.length
      };
    }else{
      message.error(res.message);
      return {
        data: [],
        success: false,
        total: 0
      };
    }
  }

  useEffect(()=>{
    actionRef.current?.reload();
  },[userId])

  const columns: ProColumns<any>[] = [
    {
      title: intl.formatMessage({ id: 'operaLog.column.requestPath' }),
      dataIndex: 'requestPath',
      key: 'requestPath',
    },
    {
      title: intl.formatMessage({ id: 'operaLog.column.clientIp' }),
      dataIndex: 'clientIp',
      key: 'clientIp',
    },
    {
      title: intl.formatMessage({ id: 'operaLog.column.reqSource' }),
      dataIndex: 'reqSource',
      key: 'reqSource',
    },
    {
      title: intl.formatMessage({ id: 'operaLog.column.networkType' }),
      dataIndex: 'networkType',
      key: 'networkType',
    },
    {
      title: intl.formatMessage({ id: 'operaLog.column.beforeValue' }),
      dataIndex: 'beforeValue',
      key: 'beforeValue',
    },
    {
      title: intl.formatMessage({ id: 'operaLog.column.timestamp' }),
      dataIndex: 'timestamp',
      key: 'timestamp',
      valueType: 'dateTime',
    },
  ];

  return (

    <ProTable
    columns={columns}
    rowKey="id"
    search={false}
    pagination={{
      defaultPageSize: 10,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '50'],
      showTotal: (total) => intl.formatMessage({ id: 'operaLog.pagination.total' }, { total })
    }}
    request={getLog}
  />
  );
};

export default Log;
