import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Table, Input, Select, DatePicker, Button, Space, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

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
  const columns = [
    {
      title: 'UID',
      dataIndex: 'uid',
      key: 'uid',
    },
    {
      title: '触发类型',
      dataIndex: 'alertType',
      key: 'alertType',
    },
    {
      title: '触发原因',
      dataIndex: 'reason',
      key: 'reason',
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
    },
    {
      title: '处理建议',
      dataIndex: 'suggestion',
      key: 'suggestion',
    },
    {
      title: '触发时间',
      dataIndex: 'triggerTime',
      key: 'triggerTime',
    },
  ];
  
  // 模拟数据
  const data = [
    {
      uid: '2550',
      alertType: '资产不平',
      reason: '账目不平的资产折合>= 1.0 BTC',
      riskLevel: 4,
      riskPeriod: '--',
      suggestion: '冻结交易; 冻结提现; 核算用户资产',
      triggerTime: '2024-05-05 03:10',
    },
    {
      uid: '5216',
      alertType: '洗钱嫌疑',
      reason: '累计委托交易笔数< 1 笔，且提现后总资产折合< 1.0 BTC',
      riskLevel: 3,
      riskPeriod: '--',
      suggestion: '冻结交易; 冻结提现; 检查用户资金来源',
      triggerTime: '2024-04-01 10:37',
    },
    {
      uid: '7120',
      alertType: '被盗预警',
      reason: '用户提现的IP登录次数占比< 1%',
      riskLevel: 2,
      riskPeriod: '--',
      suggestion: '冻结提现; 建议回访用户后处理',
      triggerTime: '2024-03-10 22:09',
    },
    {
      uid: '8569',
      alertType: '被盗预警',
      reason: '用户提现地址之前未成功提现',
      riskLevel: 1,
      riskPeriod: '--',
      suggestion: '冻结提现; 建议回访用户后处理',
      triggerTime: '2023-02-09 03:32',
    },
    {
      uid: '1804',
      alertType: '敏感信息',
      reason: '修改密码',
      riskLevel: 0,
      riskPeriod: '24H',
      suggestion: '冻结提现',
      triggerTime: '2023-02-09 03:32',
    },
  ];

  // 处理查询
  const handleSearch = () => {
    console.log('搜索条件:', filters);
    // 这里可以添加实际的查询逻辑
  };
  
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
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              查询
            </Button>
          </Col>
        </Row>
        <Table columns={columns} dataSource={data} rowKey="uid" />
      </Card>
    </PageContainer>
  );
};

export default RiskControlAlerts; 