import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Form, Input, Button, Select, Space, Typography, Divider } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;

const RiskControlSuggestions: React.FC = () => {
  // 风控建议数据
  const [form] = Form.useForm();
  
  // 处理建议选项
  const suggestionOptions = [
    '建议回访用户后处理',
    '建议禁止提现，并回访用户后再处理',
    '建议冻结用户提现',
    '建议禁止提现，回访用户后在处理',
    '人工审核'
  ];

  const handleSave = (values: any) => {
    console.log('表单值:', values);
    // 这里添加保存逻辑
  };

  return (
    <PageContainer>
      <Card bordered={false}>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <Title level={4}>提现处理建议</Title>
            <Button type="primary" htmlType="submit">保存</Button>
          </div>
          
          {/* 风险等级配置区域 */}
          <div style={{ background: '#f9f0f0', padding: 20, marginBottom: 30 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Space align="baseline" size="large">
                <Form.Item 
                  label={<span style={{ color: 'red' }}>* 风险等级&gt;=</span>} 
                  name="riskLevel1"
                  style={{ marginBottom: 0 }}
                >
                  <Input style={{ width: 60 }} defaultValue="3" />
                </Form.Item>
                <span>级</span>
                
                <Form.Item
                  label={<span style={{ color: 'red' }}>* 处理建议</span>}
                  name="suggestion1"
                  style={{ marginBottom: 0, width: 500 }}
                >
                  <Select 
                    suffixIcon={<DownOutlined />}
                    defaultValue="建议回访用户后处理"
                  >
                    {suggestionOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Space>
              
              <Space align="baseline" size="large">
                <Form.Item 
                  label={<span style={{ color: 'red' }}>* 风险等级&gt;=</span>} 
                  name="riskLevel2"
                  style={{ marginBottom: 0 }}
                >
                  <Input style={{ width: 60 }} defaultValue="6" />
                </Form.Item>
                <span>级</span>
                
                <Form.Item
                  label={<span style={{ color: 'red' }}>* 处理建议</span>}
                  name="suggestion2"
                  style={{ marginBottom: 0, width: 500 }}
                >
                  <Select 
                    suffixIcon={<DownOutlined />}
                    defaultValue="建议禁止提现，并回访用户后再处理"
                  >
                    {suggestionOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Space>
              
              <Space align="baseline" size="large">
                <Form.Item 
                  label={<span style={{ color: 'red' }}>* 风险等级&gt;=</span>} 
                  name="riskLevel3"
                  style={{ marginBottom: 0 }}
                >
                  <Input style={{ width: 60 }} defaultValue="9" />
                </Form.Item>
                <span>级</span>
                
                <Form.Item
                  label={<span style={{ color: 'red' }}>* 处理建议</span>}
                  name="suggestion3"
                  style={{ marginBottom: 0, width: 500 }}
                >
                  <Select 
                    suffixIcon={<DownOutlined />}
                    defaultValue="建议冻结用户提现"
                  >
                    {suggestionOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Space>
            </Space>
          </div>

          {/* 敏感信息修改区域 */}
          <div style={{ marginBottom: 30 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <Title level={4}>敏感信息修改</Title>
              <Button type="primary">编辑</Button>
            </div>
            
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Space align="baseline" size="large">
                <Form.Item 
                  label={<span style={{ color: 'red' }}>* 修改密码后禁止提现增加</span>} 
                  name="passwordTime"
                  style={{ marginBottom: 0 }}
                >
                  <Input style={{ width: 60 }} defaultValue="24" />
                </Form.Item>
                <span>H</span>
                
                <Form.Item
                  label={<span style={{ color: 'red' }}>* 处理建议</span>}
                  name="passwordSuggestion"
                  style={{ marginBottom: 0, width: 500 }}
                >
                  <Select 
                    suffixIcon={<DownOutlined />}
                    defaultValue="建议回访用户后处理"
                  >
                    {suggestionOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Space>
              
              {/* 其他敏感信息项... */}
              <Space align="baseline" size="large">
                <Form.Item 
                  label={<span style={{ color: 'red' }}>* 解绑2FA后禁止提现增加</span>} 
                  name="2faTime"
                  style={{ marginBottom: 0 }}
                >
                  <Input style={{ width: 60 }} defaultValue="24" />
                </Form.Item>
                <span>H</span>
                
                <Form.Item
                  label={<span style={{ color: 'red' }}>* 处理建议</span>}
                  name="2faSuggestion"
                  style={{ marginBottom: 0, width: 500 }}
                >
                  <Select 
                    suffixIcon={<DownOutlined />}
                    defaultValue="建议禁止提现，并回访用户后再处理"
                  >
                    {suggestionOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Space>
              
              {/* 添加更多敏感信息相关的表单项 */}
            </Space>
          </div>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default RiskControlSuggestions; 