import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, InputNumber, Radio, message } from 'antd';
import SeedEditor from '@/components/SeedEditor';
import LanguageSelector from '@/components/Languages/Index';

interface ArticlePublishModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
}

const ArticlePublishModal: React.FC<ArticlePublishModalProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('en_US');
  
  // 初始化表单默认值
  useEffect(() => {
    form.setFieldsValue({ language: language });
  }, []);
  
  // 处理语言变化
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    form.setFieldsValue({ language: value });
  };
  
  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 提交表单数据
      await onSubmit({
        ...values,
        content,
      });
      
      // 重置表单
      form.resetFields();
      setContent('');
      message.success('文章发布成功');
    } catch (error) {
      console.error('表单验证或提交失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理编辑器内容变化
  const handleEditorChange = (value: string) => {
    setContent(value);
  };

  return (
    <Modal
      title="发布文章"
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          提交
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          name="order"
          label="排序"
          rules={[{ required: true, message: '请输入排序' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入排序" />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="选择分类"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Select
            placeholder="请选择分类"
            options={[
              { value: '1', label: '帮助中心' },
              { value: '2', label: '账户安全' },
              { value: '3', label: '交易指南' },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入描述' }]}
        >
          <Input placeholder="请输入描述" />
        </Form.Item>

        <Form.Item
          name="language"
          label="语言"
          rules={[{ required: true, message: '请选择语言' }]}
        >
          <LanguageSelector value={language} onChange={handleLanguageChange} />
        </Form.Item>
        <Form.Item
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="请输入标题" />
        </Form.Item>

        <Form.Item
          label="内容"
          required
          validateStatus={!content ? 'error' : ''}
          help={!content ? '请输入内容' : ''}
        >
          <SeedEditor
            value={content}
            onChange={handleEditorChange}
            placeholder="请输入文章内容......"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ArticlePublishModal; 