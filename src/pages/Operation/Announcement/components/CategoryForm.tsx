import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Button, message, Radio } from 'antd';
import { languages } from '@/config/language';

const { TextArea } = Input;

// 语言内容类型定义
type LanguageContent = {
  languageCode: string;
  languageContent: string;
};

export type CategoryFormProps = {
  visible: boolean;
  onCancel: () => void;
  onSuccess: (values: Record<string, any>) => void;
  values?: Record<string, any>;
  type: 'create' | 'update';
  confirmLoading?: boolean;
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  visible,
  onCancel,
  onSuccess,
  values,
  type,
  confirmLoading,
}) => {
  const [form] = Form.useForm();
  const [activeLanguage, setActiveLanguage] = useState('en_US');
  
  // 多语言内容列表
  const [contentList, setContentList] = useState<LanguageContent[]>([
    { languageCode: 'en_US', languageContent: '' }
  ]);

  useEffect(() => {
    if (visible && type === 'update' && values) {
      // 处理已有的多语言内容数据
      let newContentList: LanguageContent[] = [];
      
      // 如果传入的是一个数组，直接使用
      if (Array.isArray(values.contentList)) {
        newContentList = [...values.contentList];
      } 
      // 如果是旧数据结构，转换为新格式
      else {
        languages.forEach(lang => {
          const langContent = values[`content_${lang.key}`] || '';
          if (langContent) {
            newContentList.push({
              languageCode: lang.key,
              languageContent: langContent
            });
          }
        });
        
        // 如果有单一content字段但没有多语言版本，添加到英文
        if (values.content && !newContentList.some(item => item.languageCode === 'en_US')) {
          newContentList.push({
            languageCode: 'en_US',
            languageContent: values.content
          });
        }
      }
      
      // 确保至少有英文版本
      if (!newContentList.some(item => item.languageCode === 'en_US')) {
        newContentList.push({ languageCode: 'en_US', languageContent: '' });
      }
      
      setContentList(newContentList);
      
      // 设置基础字段
      form.setFieldsValue({
        serialNum: values.serialNum,
        describe: values.describe,
      });
    } else {
      form.resetFields();
      // 重置为只有英文的空内容
      setContentList([{ languageCode: 'en_US', languageContent: '' }]);
    }
  }, [visible, form, values, type]);

  // 处理语言切换
  const handleLanguageChange = (langKey: string) => {
    setActiveLanguage(langKey);
    
    // 如果切换到的语言不存在，添加该语言
    if (!contentList.some(item => item.languageCode === langKey)) {
      setContentList(prev => [...prev, { languageCode: langKey, languageContent: '' }]);
    }
    
    // 更新表单中的内容字段，确保切换后显示正确的内容
    const currentContent = getCurrentContent(langKey);
    form.setFieldsValue({
      languageContent: currentContent
    });
  };

  // 获取当前语言的内容
  const getCurrentContent = (langKey: string): string => {
    const langItem = contentList.find(item => item.languageCode === langKey);
    return langItem ? langItem.languageContent : '';
  };

  // 处理内容变更
  const handleContentChange = (langKey: string, value: string) => {
    setContentList(prev => 
      prev.map(item => 
        item.languageCode === langKey ? { ...item, languageContent: value } : item
      )
    );
  };

  const handleSubmit = async () => {
    try {
      const fieldsValue = await form.validateFields();
      
      // 检查英文内容必填
      const enContent = contentList.find(item => item.languageCode === 'en_US');
      if (!enContent || !enContent.languageContent) {
        message.error('英文内容为必填项');
        return;
      }
      
      // 过滤掉空内容的语言
      const validContentList = contentList.filter(item => item.languageContent.trim() !== '');
      
      // 构建提交数据
      const submitData: Record<string, any> = {
        id: values?.id,
        serialNum: fieldsValue.serialNum,
        describe: fieldsValue.describe,
        languageCodes: validContentList // 多语言内容列表
      };
      
      // 记录当前已配置的语言
      submitData.languages = validContentList
        .map(item => item.languageCode)
        .join(',');
      
      onSuccess(submitData);
    } catch (error) {
      console.error('表单验证失败:', error);
      message.error('表单校验失败，请检查必填项');
    }
  };

  return (
    <Modal
      width={600}
      title={type === 'create' ? '新建分类' : '编辑分类'}
      open={visible}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          sort: 0,
          languageContent: ''
        }}
      >
        <Form.Item
          name="serialNum"
          label="排序"
          rules={[{ required: true, message: '请输入排序' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="数字越小越靠前" />
        </Form.Item>
        
        <Form.Item
          name="describe"
          label="描述"
          rules={[{ required: true, message: '请输入描述' }]}
        >
          <Input placeholder="请输入描述" />
        </Form.Item>
        
        <Form.Item
          label="内容语言"
          required
          name="languageCode"
        >
          <Radio.Group 
            value={activeLanguage} 
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            {languages.map(lang => (
              <Radio.Button key={lang.key} value={lang.key}>{lang.label}</Radio.Button>
            ))}
          </Radio.Group>
          <div style={{ color: '#999', marginBottom: '15px' }}>
            *内容支持多语言编辑，英文内容为必填，其他语言可选
          </div>
        </Form.Item>
        
        {/* 多语言内容编辑区域 */}
        <Form.Item
          name="languageContent"
          label="内容"
          required={activeLanguage === 'en_US'}
        >
          <TextArea 
            rows={4}
            placeholder="请输入内容" 
            value={getCurrentContent(activeLanguage)}
            onChange={(e) => handleContentChange(activeLanguage, e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryForm; 