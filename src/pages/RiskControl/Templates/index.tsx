import React, {  useRef } from 'react';
import { PageContainer,ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Form } from 'antd';
import { riskConditionList } from '@/services/ant-design-pro/risk';



 

/**
 * 风控模板页面
 */
const TemplatesPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();

  // 场景列定义
  const columns: ProColumns<any>[] = [
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
        <ProTable<any>
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