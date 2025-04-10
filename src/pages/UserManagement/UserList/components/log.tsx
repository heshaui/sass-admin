import React, { useRef,useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { gatewayAccessLogList } from '@/services/ant-design-pro/UserManagement';
import dayjs from 'dayjs';
interface LogRecord {
  id: string;
  requestPath: string;
  clientIp: string;
  reqSource: string;
  networkType: string;
  requestName: string;
  timestamp: string;
}
interface LogProps {
  userId: string | number;
}


const Log: React.FC<LogProps> = ({ userId }) => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [loading, setLoading] = useState(false);


  const fetchLogData = async (params: any) => {
    setLoading(true)
    let data = {
      pageNo: params.current,
      pageSize: params.pageSize,
      userId: userId,
      //传时间戳
      startTime: params.dateRange && params.dateRange[0] ? dayjs(params.dateRange[0]).valueOf() : undefined,
      endTime: params.dateRange && params.dateRange[1] ? dayjs(params.dateRange[1]).valueOf() : undefined
    }
    const res = await gatewayAccessLogList(data)
    setLoading(false)
    if (res.code === '0') {
      return {
        data: res.data.list,
        success: true,
        total: res.data.count,
      }
    } else {
      return {
        data: [],
        success: false,
        total: 0,
      }
    } 


  }



const columns: ProColumns<LogRecord>[] = [
  {
    title: 'id',
    dataIndex: 'id',
    search: false,
  },
  {
    title: '接口路径',
    dataIndex: 'requestPath',
    search: false,
  },
  {
    title: 'IP地址',
    dataIndex: 'clientIp',
    search: false,
  },
  {
    title: '请求来源',
    dataIndex: 'reqSource',
    ellipsis: true,
    search: false,
  },
  {
    title: '网络类型',
    dataIndex: 'networkType',
    search: false,
  },
  {
    title: '名称',
    dataIndex: 'requestName',
  },
  {
    title: '请求时间',
    dataIndex: 'timestamp',
    valueType: 'dateTime',
    search: false,
  },
  {
    title: '开始日期',
    dataIndex: 'dateRange',
    valueType: 'dateTimeRange',
    hideInTable: true,
    fieldProps: {
      placeholder: ['开始日期', '结束日期'],
    },
  },
];

return (
  <ProTable<LogRecord>
    actionRef={actionRef}
    loading={loading}
    formRef={formRef}
    rowKey="id"
    columns={columns}
    request={fetchLogData}
    search={{
      labelWidth: 'auto',
    }}
    options={false}
    pagination={{
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total) => `共 ${total} 条记录`,
    }}
  />
);
};

export default Log;
