import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, Select, Button, InputNumber } from 'antd';
import SeedEditor from '@/components/SeedEditor';
import LanguageSelector from '@/components/Languages';
import { getHelpCenterClassList } from '@/services/ant-design-pro/operation';

interface ArticlePublishModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  isEditing?: boolean;
  article?: any;
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
  isEditing = false,
  article = null,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [contentMap, setContentMap] = useState<Record<string, string>>({});
  const [titleMap, setTitleMap] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState('en_US');
  const [helpCenterClassList, setHelpCenterClassList] = useState<HelpCenterClassItem[]>([]);
  const [editorKey, setEditorKey] = useState(0);
  const editorContentRef = useRef<string>('');
  const editorRef = useRef(null);

  const [multiLanguageForms, setMultiLanguageForms] = useState<Record<string, any>>({
    ko_KR: { form: {}, imgList: [], content: '', specContent: '' },
    en_US: { form: {}, imgList: [], content: '', specContent: '' },
    zh_CN: { form: {}, imgList: [], content: '', specContent: '' },
    zh_TW: { form: {}, imgList: [], content: '', specContent: '' },
    ja_JP: { form: {}, imgList: [], content: '', specContent: '' },



  });

  
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
    
    if (isEditing && article) {
      const initialValues = {
        order: article.sort || 0,
        categoryId: article.classId,
        description: article.description || article.articleDescription,
        language: 'en_US',
      };
      
      const initialContentMap: Record<string, string> = {};
      const initialTitleMap: Record<string, string> = {};
      
      if (article.articles && Array.isArray(article.articles)) {
        article.articles.forEach((item: any) => {
          if (item.languageCode) {
            if (item.articleContent) {
              initialContentMap[item.languageCode] = item.articleContent;
            }
            
            if (item.articleTitle) {
              initialTitleMap[item.languageCode] = item.articleTitle;
            }
          }
        });
      }
      
      setContentMap(initialContentMap);
      setTitleMap(initialTitleMap);
      
      initialValues.title = initialTitleMap['en_US'] || '';
      
      form.setFieldsValue(initialValues);
    } else {
      form.setFieldsValue({ language: language });
    }
  }, [isEditing, article, visible]);
  
  const handleLanguageChange = (value: string) => {
    setTitleMap(prev => ({
      ...prev,
      [language]: form.getFieldValue('title') || ''
    }));
    
    if (editorRef.current) {
      const currentContent = editorRef.current.getHtml();
      setContentMap(prev => ({
        ...prev,
        [language]: currentContent
      }));
    }
    
    setLanguage(value);
    
    setTimeout(() => {
      form.setFieldsValue({ 
        language: value,
        title: titleMap[value] || ''
      });
    }, 0);
    
    setEditorKey(prevKey => prevKey + 1);
    
    console.log('Language changed:', {
      from: language,
      to: value,
      contentMapBefore: {...contentMap},
      titleMapBefore: {...titleMap}
    });
  };
  
  const handleEditorChange = (value: string) => {
    if (value && value.trim() !== '') {
      setContentMap(prev => ({
        ...prev,
        [language]: value
      }));
      
      console.log('Editor content updated for', language, value.substring(0, 50) + '...');
    }
  };
  
  const handleSubmit = async () => {
    try {
      if (editorRef.current) {
        const currentContent = editorRef.current.getHtml();
        setContentMap(prev => ({
          ...prev,
          [language]: currentContent
        }));
      }
      
      setTitleMap(prev => ({
        ...prev,
        [language]: form.getFieldValue('title') || ''
      }));
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const values = await form.validateFields();
      
      setLoading(true);
      
      const articlesArray = Object.keys(contentMap)
        .filter(langCode => contentMap[langCode] && contentMap[langCode].trim() !== '')
        .map(langCode => ({
          languageCode: langCode,
          articleTitle: titleMap[langCode] || '',
          articleContent: contentMap[langCode] || ''
        }));
      
      console.log('Submitting articles:', articlesArray);
      
      const articleData = {
        ...values,
        articles: articlesArray
      };
      
      if (isEditing && article) {
        articleData.id = article.id;
      }
      
      await onSubmit(articleData);
      
      form.resetFields();
      setContentMap({});
      setTitleMap({});
    } catch (error) {
      console.error('表单验证或提交失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('contentMap updated:', contentMap);
  }, [contentMap]);

  return (
    <Modal
      title={isEditing ? "编辑文章" : "发布文章"}
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
          rules={[{ required: true, message: `请输入标题` }]}
        >
          <Input placeholder='请输入标题' />
        </Form.Item>

        <Form.Item
          label="内容"
          required
          validateStatus={!contentMap[language] ? 'error' : ''}
          help={!contentMap[language] ? `请输入${language === 'zh_CN' ? '中文' : language === 'en_US' ? '英文' : ''}内容` : ''}
        >
          <SeedEditor
            key={editorKey}
            initialContent={contentMap[language] || ''}
            onChange={handleEditorChange}
            ref={editorRef}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ArticlePublishModal; 