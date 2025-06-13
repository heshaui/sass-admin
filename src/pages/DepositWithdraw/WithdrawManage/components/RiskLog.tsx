import React, { useRef, useEffect } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { assetAccountReviewList } from '@/services/ant-design-pro/risk';
import { useIntl } from '@umijs/max';

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
  const userIdRef = useRef(userId);

  useEffect(() => {
    userIdRef.current = userId;
    actionRef.current?.reload();
  }, [userId]);

  const fetchLogData = async (params: any) => {
    console.log(userIdRef.current, 'fetchLogDatauserId');
    let data = {
      pageNo: params.current,
      pageSize: params.pageSize,
      userId: userIdRef.current,
    };
    const res = await assetAccountReviewList(data);
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
      title: intl.formatMessage({ id: 'riskLog.column.sceneCode' }),
      dataIndex: 'sceneCode',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'riskLog.column.resultContent' }),
      dataIndex: 'resultContent',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'riskLog.column.riskLevel' }),
      dataIndex: 'riskLevel',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'riskLog.column.riskRule' }),
      dataIndex: 'riskRule',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'riskLog.column.suggestion' }),
      dataIndex: 'resultContent',
      ellipsis: true,
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'riskLog.column.createTime' }),
      dataIndex: 'createTime',
      search: false,
    },
  ];

  return (
    <div>
      <ProTable<LogRecord>
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        columns={columns}
        request={fetchLogData}
        search={false}
        options={false}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => intl.formatMessage({ id: 'riskLog.pagination.total' }, { total }),
        }}
        dateFormatter="string"
        bordered
      />
    </div>
  );
};

export default Log;
