import React, { useRef, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
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
  const { formatMessage } = useIntl();
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [loading, setLoading] = useState(false);

  const fetchLogData = async (params: any) => {
    setLoading(true);
    let data = {
      pageNo: params.current,
      pageSize: params.pageSize,
      userId: userId,
      //传时间戳
      startTime:
        params.dateRange && params.dateRange[0] ? dayjs(params.dateRange[0]).valueOf() : undefined,
      endTime:
        params.dateRange && params.dateRange[1] ? dayjs(params.dateRange[1]).valueOf() : undefined,
    };
    const res = await gatewayAccessLogList(data);
    setLoading(false);
    if (res.code === '0') {
      return {
        data: res.data.list,
        success: true,
        total: res.data.count,
      };
    } else {
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  const columns: ProColumns<LogRecord>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      search: false,
    },
    {
      title: formatMessage({ id: 'log.columns.interfacePath' }),
      dataIndex: 'requestPath',
      search: false,
    },
    {
      title: formatMessage({ id: 'log.columns.ipAddress' }),
      dataIndex: 'clientIp',
      search: false,
    },
    {
      title: formatMessage({ id: 'log.columns.requestSource' }),
      dataIndex: 'reqSource',
      ellipsis: true,
      search: false,
    },
    {
      title: formatMessage({ id: 'log.columns.networkType' }),
      dataIndex: 'networkType',
      search: false,
    },
    {
      title: formatMessage({ id: 'log.columns.name' }),
      dataIndex: 'requestName',
    },
    {
      title: formatMessage({ id: 'log.columns.requestTime' }),
      dataIndex: 'timestamp',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: formatMessage({ id: 'log.columns.startDate' }),
      dataIndex: 'dateRange',
      valueType: 'dateTimeRange',
      hideInTable: true,
      fieldProps: {
        placeholder: [
          formatMessage({ id: 'log.columns.startDate' }),
          formatMessage({ id: 'log.columns.endDate' }),
        ],
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
        showTotal: (total) => formatMessage({ id: 'log.pagination.total' }, { total }),
      }}
    />
  );
};

export default Log;
