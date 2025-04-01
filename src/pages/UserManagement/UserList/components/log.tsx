import React, { useRef } from 'react';
import { Button, Space } from 'antd';
import {ProTable} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { gatewayAccessLogList } from '@/services/ant-design-pro/UserManagement';

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


  const fetchLogData = async (params: any) => {
        let data={
            pageNo:params.current,
            pageSize:params.pageSize,
            userId:userId
        }
            const res=await gatewayAccessLogList(data)
                    if(res.code==='0'){
                        return {
                            data: res.data.list,
                            success: true,
                            total: res.data.count,
                        }
                    }else{
                        return {
                            data: [],
                            success: false,
                            total: 0,
                        }
                    }
  
  };

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
      valueType: 'dateRange',
      hideInTable: true,
      fieldProps: {
        placeholder: ['开始日期', '结束日期'],
      },
    },
  ];

  return (
    <ProTable<LogRecord>
      actionRef={actionRef}
      formRef={formRef}
      rowKey="id"
      columns={columns}
      request={fetchLogData}
      search={{
        labelWidth: 'auto',
        defaultCollapsed: false,
        layout: 'horizontal',
        span: 8,
      }}
      options={false}
      toolBarRender={() => [
        <Space key="toolbar">
          <Button
            type="primary"
            key="search"
            icon={<SearchOutlined />}
            onClick={() => actionRef.current?.reload()}
          >
            查询
          </Button>
          <Button
            key="reset"
            icon={<ReloadOutlined />}
            onClick={() => {
              formRef.current?.resetFields();
              actionRef.current?.reload();
            }}
          >
            清空
          </Button>
        </Space>
      ]}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条记录`,
      }}
      dateFormatter="string"
      bordered
    />
  );
};

export default Log;
