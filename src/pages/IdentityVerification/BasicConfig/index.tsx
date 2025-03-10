import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Switch, message, Space, Select } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

const BasicConfig: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 这里可以添加获取基础配置数据的逻辑
    // fetchBasicConfig().then(data => form.setFieldsValue(data));
  }, []);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 这里可以添加保存配置的逻辑
      // await saveBasicConfig(values);
      message.success('配置保存成功');
    } catch (error) {
      message.error('配置保存失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="身份认证基础配置">
      <Card>
        <Form 
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isEnabled: true,
            verificationLevel: 'basic',
            expirationDays: 30,
          }}
        >
          <Form.Item 
            name="isEnabled" 
            label="启用身份认证" 
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          
          <Form.Item 
            name="verificationLevel" 
            label="认证级别" 
            rules={[{ required: true, message: '请选择认证级别' }]}
          >
            <Select>
              <Select.Option value="basic">基础认证</Select.Option>
              <Select.Option value="advanced">高级认证</Select.Option>
              <Select.Option value="enterprise">企业认证</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item 
            name="expirationDays" 
            label="认证有效期(天)" 
            rules={[{ required: true, message: '请输入认证有效期' }]}
          >
            <Input type="number" />
          </Form.Item>
          
          <Form.Item 
            name="requiredDocuments" 
            label="所需文件说明"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存配置
              </Button>
              <Button onClick={() => form.resetFields()}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default BasicConfig; 