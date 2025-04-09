import React, { useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import {Select, DatePicker } from 'antd';
import { assetAccountReviewList} from '@/services/ant-design-pro/risk';
import type { ProColumns } from '@ant-design/pro-components';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;
const { Option } = Select;

const RiskControlAlerts: React.FC = () => {
  // 筛选条件状态
  const [filters, setFilters] = useState({
    uid: '',
    alertType: '',
    startTime: '',
    endTime: '',

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
      search:false
    },
    {
      title: '触发后风控等级',
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      search:false
    },
    {
      title: '风控周期',
      dataIndex: 'riskCycle',
      key: 'riskCycle',
      valueType: 'text',
      search:false
    },
    {
      title: '处理建议',
      dataIndex: 'code',
      key: 'code',
      valueType: 'text',
      search:false
    },
    {
      title: '触发时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search:false
    },
    {
      title: '触发时间',
      dataIndex: 'dateTimeRange',
      valueType: 'dateTimeRange',
      hideInTable:true,
      fieldProps:{
        placeholder:['开始日期','结束日期']
      }
    },
  ];
  
  const getList=async(params:any)=>{
    console.log(params);
    let   data={
      pageNo:params.current,
      pageSize:params.pageSize,
      startTime:dayjs(params.dateTimeRange[0]).valueOf(),
      endTime:dayjs(params.dateTimeRange[1]).valueOf(),
      alertType:params.alertType,
      uid:params.uid,
     
    }
    const res=await assetAccountReviewList(data);
    if(res.code==='0'){
      return {
        data: res.data.list,
        success: true,
        total: res.data.count
      };
    }else{
      return {
        data: [],
        success: false,
        total: 0
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