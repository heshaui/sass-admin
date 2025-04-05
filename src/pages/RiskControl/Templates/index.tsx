import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Form,  } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { riskConditionList } from '@/services/ant-design-pro/risk';

declare namespace API {
  // 风控场景
  interface RiskScene {
    id: string | number;
    code: string;
    type: string;
    description: string;
    createdAt: string;
  }

  // 风控任务
  interface RiskTask {
    id: string | number;
    code: string;
    description: string;
    operator: '>' | '<' | '=' | '>=' | '<=';
    threshold: string;
    riskLevel: number;
    updatedAt: string;
    sceneId: string | number;
  }
}

/**
 * 风控模板页面
 */
const TemplatesPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();

  // 场景列定义
  const columns: ProColumns<API.RiskScene>[] = [
    {
      title: '场景ID',
      dataIndex: 'conditionId',
    },
    {
      title: '场景code',
      dataIndex: 'sceneCode',
    },
    {
      title: '场景类型',
      dataIndex: 'conditionCode',
    },
    {
      title: '场景描述',
      dataIndex: 'conditionName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
    },
  ];



  const queryTemplateScenes=async(params:any)=>{
    let res=await riskConditionList({
      pageNo:params.current,
      pageSize:params.pageSize,
    })
    if(res.code==='0'){
      console.log(res.data);
      return {
        data:res.data.list,
        count:res.data.total,
      }
    }
  }

  return (
    <PageContainer>
      <ProTable<API.RiskScene>
        headerTitle="风控模板场景"
        actionRef={actionRef}
        rowKey="id"
        search={false}
        request={queryTemplateScenes}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TemplatesPage; 