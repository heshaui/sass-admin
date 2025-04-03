import React, { useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Card, Input, Select, DatePicker, Button, Space, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { assetAccountReviewList } from '@/services/ant-design-pro/risk';
import type { ProColumns } from '@ant-design/pro-components';
const { RangePicker } = DatePicker;
const { Option } = Select;

const RiskControlAlerts: React.FC = () => {
  // 筛选条件状态
  const [filters, setFilters] = useState({
    uid: '',
    alertType: '全部',
    dateRange: [],
  });

  // 表格列定义
  const columns: ProColumns[] = [
    {
      title: 'UID',
      dataIndex: 'id',
    },
    {
      title: '触发类型',
      dataIndex: 'sceneCode',
      key: 'sceneCode',
    },
    {
      title: '触发原因',
      dataIndex: 'resultContent',
    },
    {
      title: '触发后风控等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
    },
    {
      title: '风控周期',
      dataIndex: 'riskCycle',
      key: 'riskCycle',
      valueType: 'text',
    },
    {
      title: '处理建议',
      dataIndex: 'code',
      key: 'code',
      valueType: 'text',
    },
    {
      title: '触发时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
  ];
  
  const getList=async(params:any)=>{
    const res=await assetAccountReviewList(filters);
    if(res.code==='0'){
      return {
        data: res.data.list,
        success: true,
        total: res.data.count
      };
    }
  }

  return (
    <PageContainer>

        <ProTable
          columns={columns}
          request={getList}

          rowKey="id"
          pagination={{
            showQuickJumper: true,
          }}
          dateFormatter="string"
        />
    </PageContainer>
  );
};

export default RiskControlAlerts; 