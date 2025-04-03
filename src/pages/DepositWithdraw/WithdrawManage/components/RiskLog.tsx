import React, { useRef } from 'react';
import { Button, Space } from 'antd';
import {ProTable} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { gatewayAccessLogList } from '@/services/ant-design-pro/UserManagement';
import { assetAccountReviewList } from '@/services/ant-design-pro/risk';

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
            const res=await assetAccountReviewList(data)
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
      title: '触发类型',
      dataIndex: 'sceneCode',
      search: false,
    },
    {
      title: '触发原因',
      dataIndex: 'resultContent',
      search: false,
    },
    {
      title: '触发后风控等级',
      dataIndex: 'riskLevel',
      search: false,
    },
    {
        title: '风控周期',
        dataIndex: 'riskRule',
        search: false,
      },
    {
      title: '处理建议',
      dataIndex: 'resultContent',
      ellipsis: true,
      search: false,
    },
    {
      title: '触发时间',
      dataIndex: 'createTime',
      search: false,
    },
 

  ];

  return (
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
        showTotal: (total) => `共 ${total} 条记录`,
      }}
      dateFormatter="string"
      bordered
    />
  );
};

export default Log;
