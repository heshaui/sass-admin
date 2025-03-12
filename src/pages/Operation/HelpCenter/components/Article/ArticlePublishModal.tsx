import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, InputNumber, message } from 'antd';
import SeedEditor from '@/components/SeedEditor';
import LanguageSelector from '@/components/Languages/Index';
import { getHelpCenterClassList } from '@/services/ant-design-pro/operation';

interface ArticlePublishModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
}

interface HelpCenterClassItem {
  id: string | number;
  helpDescription?: string;
  name?: string;
  description?: string;
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
  const [helpCenterClassList, setHelpCenterClassList] = useState<HelpCenterClassItem[]>([]);
  
  const getClassList = async() => {
    const response = await getHelpCenterClassList({});
    if(response.code==='0') {
      if(Array.isArray(response.data.list)) {
        setHelpCenterClassList(response.data.list);
      } else {
        console.error('API返回的数据结构不是预期的数组格式:', response.data);
      }
    }
  }
  
  useEffect(() => {
    getClassList();
    form.setFieldsValue({ language: language });
  }, []);
  
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    form.setFieldsValue({ 
      language: value,
    });
  };
  
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const articleData = {
        ...values,
        articles: [{
          languageCode: language,
          articleTitle: values.title,
          articleContent: content
        }]
      };
      
      await onSubmit(articleData);
      
      form.resetFields();
      setContent('');
      // message.success('文章发布成功');
    } catch (error) {
      console.error('表单验证或提交失败:', error);
    } finally {
      setLoading(false);
    }
  };

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
            options={Array.isArray(helpCenterClassList) ? helpCenterClassList.map((item) => ({
              value: item.id,
              label: item.helpDescription,
            })) : []}
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
          rules={[{ required: true, message: `请输入${language === 'zh_CN' ? '中文' : ''}标题` }]}
        >
          <Input placeholder={`请输入${language === 'zh_CN' ? '中文' : language === 'en_US' ? '英文' : ''}标题`} />
        </Form.Item>

        <Form.Item
          label="内容"
          required
          validateStatus={!content ? 'error' : ''}
          help={!content ? `请输入${language === 'zh_CN' ? '中文' : language === 'en_US' ? '英文' : ''}内容` : ''}
        >
          <SeedEditor
            defaultValue={content}
            onChange={handleEditorChange}
            placeholder={`请输入${language === 'zh_CN' ? '中文' : language === 'en_US' ? '英文' : ''}文章内容......`}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ArticlePublishModal; 