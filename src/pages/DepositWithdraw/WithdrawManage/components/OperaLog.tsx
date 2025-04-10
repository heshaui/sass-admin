import React, { useRef,useEffect} from 'react';
import { message } from 'antd';
import {ProTable} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { 
getUserOperationLogs
} from '@/services/ant-design-pro/UserManagement';
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
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const getLog=async(params:any)=>{
    const res=await getUserOperationLogs({ userId: userId,pageNo:params.current,pageSize:params.pageSize});
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
      title: '操作时间',
      dataIndex: 'createTime',
      key: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '管理员Id',
      dataIndex: 'tenantId',
      key: 'tenantId',
    },
    {
      title: '操作管理员',
      dataIndex: 'tenantName',
      key: 'tenantName',
    },
    {
      title: '操作行为',
      dataIndex: 'operationType',
      key: 'operationType',
    },
    {
      title: '修改前',
      dataIndex: 'beforeValue',
      key: 'beforeValue',
    },
    {
      title: '修改后',
      dataIndex: 'afterValue',
      key: 'afterValue',
    },
    {
      title: '备注',
      dataIndex: 'operationRemark',
      key: 'operationRemark',
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
      showTotal: (total) => `共 ${total} 条记录`
    }}
    request={getLog}
  />
  );
};

export default Log;
