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
      dataIndex: 'riskPeriod',
      key: 'riskPeriod',
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
      <Card title="报警记录" bordered={false}>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={4}>
            <Input placeholder="UID" value={filters.uid} onChange={e => setFilters({...filters, uid: e.target.value})} />
          </Col>
          <Col span={4}>
            <Select
              defaultValue="全部"
              style={{ width: '100%' }}
              onChange={value => setFilters({...filters, alertType: value})}
            >
              <Option value="全部">触发类型: 全部</Option>
              <Option value="资产不平">资产不平</Option>
              <Option value="洗钱嫌疑">洗钱嫌疑</Option>
              <Option value="被盗预警">被盗预警</Option>
              <Option value="敏感信息">敏感信息</Option>
            </Select>
          </Col>
          <Col span={8}>
            <Space>
              <span>触发时间</span>
              <RangePicker
                onChange={dates => setFilters({...filters, dateRange: dates})}
                placeholder={['开始日期', '结束日期']}
              />
            </Space>
          </Col>
          <Col span={2}>
            <Button type="primary" icon={<SearchOutlined />} onClick={() => {
              console.log('搜索条件:', filters);
              // 这里可以添加实际的查询逻辑
            }}>
              查询
            </Button>
          </Col>
        </Row>
        <ProTable
          columns={columns}
          request={getList}
          rowKey="uid"
          pagination={{
            showQuickJumper: true,
          }}
          search={{
            labelWidth: 'auto',
          }}
          dateFormatter="string"
          toolBarRender={false}
        />
      </Card>
    </PageContainer>
  );
};

export default RiskControlAlerts; 