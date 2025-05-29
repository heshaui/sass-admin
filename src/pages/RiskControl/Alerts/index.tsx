import React, { useState,useEffect } from 'react';
import { useIntl } from 'umi';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import {Select, DatePicker } from 'antd';
import { assetAccountReviewList,riskSceneList} from '@/services/ant-design-pro/risk';
import type { ProColumns } from '@ant-design/pro-components';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;
const { Option } = Select;

const RiskControlAlerts: React.FC = () => {
  const intl = useIntl();
  // ${intl.formatMessage({ id: 'riskControl.alerts.filterConditions' })}
  const [filters, setFilters] = useState({
    userId: '',
    alertType: '',
    startTime: '',
    endTime: '',

  });
  const [sceneList, setSceneList] = useState<any[]>([]);


  

  // 表格列定义
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({ id: 'riskControl.alerts.uid' }),
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: intl.formatMessage({ id: 'riskControl.alerts.triggerType' }),
      dataIndex: 'sceneCode',
      key: 'sceneCode',
      valueType:'select',
      fieldProps:{
        options:sceneList.map((item:any)=>({
          label:item.sceneName,
          value:item.sceneCode
        }))
      }
    },
    {
      title: intl.formatMessage({ id: 'riskControl.alerts.triggerReason' }),
      dataIndex: 'resultContent',
      search:false
    },
    {
      title: intl.formatMessage({ id: 'riskControl.alerts.riskLevelAfterTrigger' }),
      dataIndex: 'riskLevel',
      key: 'riskLevel',
      search:false
    },
    {
      title: intl.formatMessage({ id: 'riskControl.alerts.riskCycle' }),
      dataIndex: 'riskCycle',
      key: 'riskCycle',
      valueType: 'text',
      search:false
    },
    {
      title: intl.formatMessage({ id: 'riskControl.alerts.processingAdvice' }),
      dataIndex: 'code',
      key: 'code',
      valueType: 'text',
      search:false
    },
    {
      title: intl.formatMessage({ id: 'riskControl.alerts.triggerTime' }),
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search:false
    },
    {
      title: intl.formatMessage({ id: 'riskControl.alerts.triggerTime' }),
      dataIndex: 'dateTimeRange',
      valueType: 'dateTimeRange',
      hideInTable:true,
      fieldProps:{
        placeholder:[intl.formatMessage({ id: 'riskControl.alerts.startDate' }), intl.formatMessage({ id: 'riskControl.alerts.endDate' })]
      }
    },
  ];

  const getRiskSceneList=async()=>{
    let data={
      pageNo:1,
      pageSize:10000
    }
    const res=await riskSceneList(data);
    if(res.code==='0'){
      setSceneList(res.data);
    }
  }
  
  const getList=async(params:any)=>{
    let   data={
      pageNo:params.current,
      pageSize:params.pageSize,
      startTime:params?.dateTimeRange?.[0]?dayjs(params?.dateTimeRange?.[0]).valueOf():'',
      endTime:params?.dateTimeRange?.[1]?dayjs(params?.dateTimeRange?.[1]).valueOf():'',
      sceneCode:params.sceneCode,
      userId:params.userId,
     
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

  useEffect(()=>{
    getRiskSceneList();
  },[])
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