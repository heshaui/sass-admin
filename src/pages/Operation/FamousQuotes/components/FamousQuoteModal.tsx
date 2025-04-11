import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message,Select} from 'antd';
import { getFamousAphorismsDetail, addFamousAphorisms, updateFamousAphorisms } from '@/services/ant-design-pro/operation';
import LanguageSelector from '@/components/LanguageSelector';
import  {languages}  from '@/config/language';
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
  
  // 添加重置表单和状态的函数
  const resetFormAndState = () => {
    form.resetFields();
    setLanguage('en_US');
    setContent('');
    setContentList([{ languageCode: 'en_US', languageContent: '' }]);
  };
  
  // 修改onCancel处理函数，在关闭模态框时重置状态
  const handleCancel = () => {
    resetFormAndState();
    onCancel();
  };
  
  // 添加获取名言详情的函数
  const fetchQuoteDetails = async () => {
    if (!editingId) return;
    
    try {
      setLoading(true);
      const res = await getFamousAphorismsDetail(editingId.toString());
      
      if (res.code === '0' && res.data) {
        // 获取所有语言内容
      
        
        
        // 更新表单
        form.setFieldsValue({
          langId: res.data.famousAphorismsContents[0].languageCode,
          text:  res.data.famousAphorismsContents[0].languageContent
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
    
    // 设置新语言
    setLanguage(value);
    
    // 从contentList获取对应语言的内容
    const langContent = contentList.find(item => item.languageCode === value)?.languageContent || '';
    form.setFieldsValue({ text: langContent });
    setContent(langContent);
  };

  const getCurrentContent = (langKey: string): string => {
    const langItem = contentList.find(item => item.languageCode === langKey);
    return langItem ? langItem.languageContent : '';
  };
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if(language==='en_US'){
       if(values.text.trim()===''){
        message.error('英文内容为必填项，请添加英文内容');
        return;
      }
    }
      // 更新当前语言内容到contentList
      const updatedContentList = [...contentList];
      const existingIndex = updatedContentList.findIndex(item => item.languageCode === language);
      if (existingIndex >= 0) {
        updatedContentList[existingIndex].languageContent = values.text;
      } else {
        updatedContentList.push({
          languageCode: language,
          languageContent: values.text
        });
      }
      
      // 检查是否包含英文内容
      const englishContent = updatedContentList.find(item => item.languageCode === 'en_US')?.languageContent || '';
      if (!englishContent.trim()) {
        message.error('英文内容为必填项，请添加英文内容');
        return;
      }
      
      setLoading(true);
      
      if (editingId) {
        // 更新操作
        const res = await updateFamousAphorisms({
          id: editingId,
          famousAphorismsContents: updatedContentList
        });
        if(res.code==='0') {
          message.success('更新成功');
        } else {
          message.error('更新失败');
        }
      } else {
        // 过滤掉内容为空的语言
        const filteredContentList = updatedContentList.filter(
          item => item.languageContent.trim() !== ''
        );
     
        const data = {
          famousAphorismsContents: filteredContentList
        };
          
        const res = await addFamousAphorisms(data);
        if(res.code==='0') {
          message.success('添加成功');
        } else {
          message.error('添加失败');
        }
      }
      
      onSuccess();
      resetFormAndState();
    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      if (editingId) {
        fetchQuoteDetails();
      } else {
        // 如果是新建，重置表单和状态
        resetFormAndState();
      }
    }
  }, [visible, editingId]);

  return (
    <Modal
      title={editingId ? '编辑名言' : '添加名言'}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" initialValues={{ langId: 'en_US' }}>
        <Form.Item
          label="内容语言"
          name="langId"
          rules={[{ required: true, message: '请选择语言' }]}
        >
          {
           editingId ? <Select>
              {
                languages.map((item:any)=>(
                  <Select.Option key={item.key} value={item.key} disabled={true}>{item.label}</Select.Option>
                ))
              }
            </Select> : <LanguageSelector value={language} onChange={handleLanguageChange} />
          }{

          }
          
        </Form.Item>
        
        <Form.Item
          name="text"
          label="内容"
          rules={[
            ({ getFieldValue }) => ({
              validator: (_, value) => {
                const currentLang = getFieldValue('langId') || language;
                if (currentLang === 'en_US' && (!value || value.trim() === '')) {
                  return Promise.reject(new Error('英语内容为必填项'));
                }
                return Promise.resolve();
              }
            })
          ]}
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