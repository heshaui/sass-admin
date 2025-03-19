import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { getFamousAphorismsDetail, addFamousAphorisms, updateFamousAphorisms } from '@/services/ant-design-pro/operation';
import LanguageSelector from '@/components/LanguageSelector';

interface FamousQuoteModalProps {
  visible: boolean;
  editingId: number | null;
  onSuccess: () => void;
  onCancel: () => void;
}

// 添加缺失的类型定义
interface LanguageContent {
  languageCode: string;
  languageContent: string;
}

const FamousQuoteModal: React.FC<FamousQuoteModalProps> = ({
  visible,
  editingId,
  onSuccess,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('en_US');
  const [content, setContent] = useState<string>('');
  
  // 多语言内容列表
  const [contentList, setContentList] = useState<LanguageContent[]>([
    { languageCode: 'en_US', languageContent: '' }
  ]);
  // 添加useEffect钩子，在编辑模式下获取数据


  // 添加获取名言详情的函数
  const fetchQuoteDetails = async () => {
    if (!editingId) return;
    
    try {
      setLoading(true);
      const res = await getFamousAphorismsDetail({
        id: editingId,
        langId: language
      });
      
      if (res.code === '0' && res.data) {
        // 获取对应语言的内容
        const quoteContent = res.data.languageContent || '';
        setContent(quoteContent);
        
        // 更新表单
        form.setFieldsValue({
          langId: language,
          text: quoteContent
        });
      }
    } catch (error) {
      message.error('获取名言详情失败');
    } finally {
      setLoading(false);
    }
  };
  // 处理内容变更
  const handleContentChange = (value: string) => {
    // 更新当前语言的内容
    setContent(value);
    // 同时更新contentList
    setContentList(prev => {
      const exists = prev.some(item => item.languageCode === language);
      if (exists) {
        return prev.map(item => 
          item.languageCode === language ? { ...item, languageContent: value } : item
        );
      } else {
        return [...prev, { languageCode: language, languageContent: value }];
      }
    });
  };
  const handleLanguageChange = (value: string) => {
    // 保存当前语言的内容
    if (!editingId) {
      setContentList(prev => {
        const exists = prev.some(item => item.languageCode === language);
        if (exists) {
          return prev.map(item => 
            item.languageCode === language ? { ...item, languageContent: content } : item
          );
        } else {
          return [...prev, { languageCode: language, languageContent: content }];
        }
      });
    }
    
    // 设置新语言
    setLanguage(value);
    
    // 如果是编辑模式，语言变化时会通过useEffect触发获取新的内容
    // 如果是新增模式，则从contentList获取对应语言的内容
    if (!editingId) {
      const langContent = contentList.find(item => item.languageCode === value)?.languageContent || '';
      form.setFieldsValue({ text: langContent });
      setContent(langContent);
    }
  };

  const getCurrentContent = (langKey: string): string => {
    const langItem = contentList.find(item => item.languageCode === langKey);
    return langItem ? langItem.languageContent : '';
  };
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      if (editingId) {
        // 更新操作
       const res = await updateFamousAphorisms({
          ...values,
          id: editingId,
        });
        if(res.code==='0') {
          message.success('更新成功');
        } else {
          message.error('更新失败');
        }
      } else {
          let data={
            famousAphorismsContents:contentList
          }
          
        const res = await addFamousAphorisms(data);
        if(res.code==='0') {
          message.success('添加成功');
        } else {
          message.error('添加失败');
        }
      }
      
      onSuccess();
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && editingId) {
      fetchQuoteDetails();
    }
  }, [visible, editingId, language]);

  return (
    <Modal
      title={editingId ? '编辑名言' : '添加名言'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" initialValues={{ langId: 'en_US' }}>
        <Form.Item
          label="内容语言"
          name="langId"
          rules={[{ required: true, message: '请选择语言' }]}
        >
          <LanguageSelector value={language} onChange={handleLanguageChange} />
        </Form.Item>
        
        <Form.Item
          name="text"
          label="内容"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <Input.TextArea 
            rows={4}
            placeholder="请输入内容" 
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FamousQuoteModal; 