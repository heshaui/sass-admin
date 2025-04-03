import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Form, Input, Button, Select, Space, Typography, Divider } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title } = Typography;

const RiskControlSuggestions: React.FC = () => {
  // 风控建议数据
  const [suggestionsForm] = Form.useForm();
  const [sensitiveForm] = Form.useForm();
  // 添加编辑状态
  const [editingSuggestions, setEditingSuggestions] = useState(false);
  const [editingSensitive, setEditingSensitive] = useState(false);
  
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
    // 保存后关闭编辑状态
    setEditingSuggestions(false);
    setEditingSensitive(false);
    // 这里添加保存逻辑
  };

  return (
    <PageContainer>
    
      
          
          <Card style={{marginBottom:30}}>
          <Form form={suggestionsForm} layout="vertical" onFinish={handleSave}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <Title level={4}>提现处理建议</Title>
            {!editingSuggestions ? (
              <Button type="primary" onClick={() => setEditingSuggestions(true)}>编辑</Button>
            ) : (
              <Space>
                <Button onClick={() => setEditingSuggestions(false)}>取消</Button>
                <Button type="primary" htmlType="submit">保存</Button>
              </Space>
            )}
          </div>
          {/* 风险等级配置区域 */}
          <div style={{ padding: 20, marginBottom: 30 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Space align="baseline" size="large">
                <span style={{ color: 'red' }}>* 风险等级>=</span>
                <Form.Item 
                  name="riskLevel1"
                  style={{ marginBottom: 0, marginRight: 5 }}
                >
                  <Input style={{ width: 60 }} defaultValue="3" disabled={!editingSuggestions} />
                </Form.Item>
                <span>级</span>
                
                <span style={{ color: 'red', marginLeft: 15 }}>* 处理建议</span>
                <Form.Item
                  name="suggestion1"
                  style={{ marginBottom: 0, width: 500, marginLeft: 5 }}
                >
                  <Select 
                    suffixIcon={<DownOutlined />}
                    defaultValue="建议回访用户后处理"
                    disabled={!editingSuggestions}
                  >
                    {suggestionOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Space>
              
              <Space align="baseline" size="large">
                <span style={{ color: 'red' }}>* 风险等级>=</span>
                <Form.Item 
                  name="riskLevel2"
                  style={{ marginBottom: 0, marginRight: 5 }}
                >
                  <Input style={{ width: 60 }} defaultValue="6" disabled={!editingSuggestions} />
                </Form.Item>
                <span>级</span>
                
                <span style={{ color: 'red', marginLeft: 15 }}>* 处理建议</span>
                <Form.Item
                  name="suggestion2"
                  style={{ marginBottom: 0, width: 500, marginLeft: 5 }}
                >
                  <Select 
                    suffixIcon={<DownOutlined />}
                    defaultValue="建议禁止提现，并回访用户后再处理"
                    disabled={!editingSuggestions}
                  >
                    {suggestionOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Space>
              
              <Space align="baseline" size="large">
                <span style={{ color: 'red' }}>* 风险等级>=</span>
                <Form.Item 
                  name="riskLevel3"
                  style={{ marginBottom: 0, marginRight: 5 }}
                >
                  <Input style={{ width: 60 }} defaultValue="9" disabled={!editingSuggestions} />
                </Form.Item>
                <span>级</span>
                
                <span style={{ color: 'red', marginLeft: 15 }}>* 处理建议</span>
                <Form.Item
                  name="suggestion3"
                  style={{ marginBottom: 0, width: 500, marginLeft: 5 }}
                >
                  <Select 
                    suffixIcon={<DownOutlined />}
                    defaultValue="建议冻结用户提现"
                    disabled={!editingSuggestions}
                  >
                    {suggestionOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Space>
            </Space>
          </div>
          </Form>
          </Card>

          {/* 敏感信息修改区域 */}
          <Card>
          <Form form={sensitiveForm} layout="vertical" onFinish={handleSave}>
          <div style={{ marginBottom: 30 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <Title level={4}>敏感信息修改</Title>
              {!editingSensitive ? (
                <Button type="primary" onClick={() => setEditingSensitive(true)}>编辑</Button>
              ) : (
                <Space>
                  <Button onClick={() => setEditingSensitive(false)}>取消</Button>
                  <Button type="primary" htmlType="submit">保存</Button>
                </Space>
              )}
            </div>
            
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'red', width: '200px' }}>* 修改密码后禁止提现增加</span>
                <Form.Item name="passwordTime" style={{ margin: 0, width: '60px' }}>
                  <Input style={{ width: 60 }} defaultValue="24" disabled={!editingSensitive} />
                </Form.Item>
                <span style={{ marginRight: '20px' }}>H</span>
                
                <span style={{ color: 'red', width: '80px' }}>* 处理建议</span>
                <Form.Item name="passwordSuggestion" style={{ margin: 0, width: '300px' }}>
                  <Select 
                    suffixIcon={<DownOutlined />}
                    defaultValue="建议回访用户后处理"
                    disabled={!editingSensitive}
                  >
                    {suggestionOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'red', width: '200px' }}>* 解绑2FA后禁止提现增加</span>
                <Form.Item name="2faTime" style={{ margin: 0, width: '60px' }}>
                  <Input style={{ width: 60 }} defaultValue="24" disabled={!editingSensitive} />
                </Form.Item>
                <span style={{ marginRight: '20px' }}>H</span>
                
                <span style={{ color: 'red', width: '80px' }}>* 处理建议</span>
                <Form.Item name="2faSuggestion" style={{ margin: 0, width: '300px' }}>
                  <Select 
                    suffixIcon={<DownOutlined />}
                    defaultValue="建议禁止提现，并回访用户后再处理"
                    disabled={!editingSensitive}
                  >
                    {suggestionOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'red', width: '200px' }}>* 更换手机号后禁止提现增加</span>
                <Form.Item name="phoneTime" style={{ margin: 0, width: '60px' }}>
                  <Input style={{ width: 60 }} defaultValue="24" disabled={!editingSensitive} />
                </Form.Item>
                <span style={{ marginRight: '20px' }}>H</span>
                
                <span style={{ color: 'red', width: '80px' }}>* 处理建议</span>
                <Form.Item name="phoneSuggestion" style={{ margin: 0, width: '300px' }}>
                  <Select 
                    suffixIcon={<DownOutlined />}
                    defaultValue="建议冻结用户提现"
                    disabled={!editingSensitive}
                  >
                    {suggestionOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'red', width: '200px' }}>* 更换邮箱后禁止提现增加</span>
                <Form.Item name="emailTime" style={{ margin: 0, width: '60px' }}>
                  <Input style={{ width: 60 }} defaultValue="24" disabled={!editingSensitive} />
                </Form.Item>
                <span style={{ marginRight: '20px' }}>H</span>
                
                <span style={{ color: 'red', width: '80px' }}>* 处理建议</span>
                <Form.Item name="emailSuggestion" style={{ margin: 0, width: '300px' }}>
                  <Select 
                    suffixIcon={<DownOutlined />}
                    defaultValue="建议禁止提现，并回访用户后再处理"
                    disabled={!editingSensitive}
                  >
                    {suggestionOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'red', width: '200px' }}>* 修改资金密码后禁止提现增加</span>
                <Form.Item name="fundPasswordTime" style={{ margin: 0, width: '60px' }}>
                  <Input style={{ width: 60 }} defaultValue="24" disabled={!editingSensitive} />
                </Form.Item>
                <span style={{ marginRight: '20px' }}>H</span>
                
                <span style={{ color: 'red', width: '80px' }}>* 处理建议</span>
                <Form.Item name="fundPasswordSuggestion" style={{ margin: 0, width: '300px' }}>
                  <Select 
                    suffixIcon={<DownOutlined />}
                    defaultValue="建议冻结用户提现"
                    disabled={!editingSensitive}
                  >
                    {suggestionOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Space>
          </div>
          </Form>
          </Card>

    </PageContainer>
  );
};

export default RiskControlSuggestions; 