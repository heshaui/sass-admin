import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Space, Radio, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { HelpCenterClassItem } from '@/services/ant-design-pro/operation';
import AvatarUpload from '@/components/AvatarUpload';
import LanguageSelector from '@/components/LanguageSelector'

interface CategoryFormModalProps {
  visible: boolean;
  currentCategory?: HelpCenterClassItem;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  visible,
  currentCategory,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [language, setLanguage] = useState('en_US');
  const [titleMap, setTitleMap] = useState<Record<string, string>>({});
  const [currentTitle, setCurrentTitle] = useState('');
  
  const handleLanguageChange = (value: string) => {
    // 保存当前语言的标题
    if (language && currentTitle) {
      setTitleMap(prev => ({
        ...prev,
        [language]: currentTitle
      }));
    }
    
    // 切换到新语言
    setLanguage(value);
    
    // 设置新语言对应的标题
    const title = titleMap[value] || '';
    setCurrentTitle(title);
    form.setFieldsValue({ articleTitle: title });
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTitle(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 先保存当前选中语言的标题到titleMap
      if (language && currentTitle) {
        titleMap[language] = currentTitle;
      }
      
      // 检查是否至少有一种语言有标题
      if (Object.keys(titleMap).length === 0) {
        message.error('请至少添加一种语言的标题');
        return;
      }
      
      // 构建多语言内容
      const languages = Object.entries(titleMap)
        .filter(([_, title]) => title.trim() !== '') // 过滤掉空标题
        .map(([code, title]) => ({
          languageCode: code,
          articleTitle: title.trim()
        }));
      
      console.log('提交的多语言数据:', languages); // 调试用
      
      // 从表单中提取黑白图标
      const { blackIcon, whiteIcon, articleTitle, ...restValues } = values;
      
      onSubmit({
        ...restValues,
        id: currentCategory?.id,
        blackIcon,
        whiteIcon,
        languages, // 传递所有语言的标题
      });
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  useEffect(() => {
    if (visible) {
      // 重置状态
      let initialTitleMap: Record<string, string> = {};
      let initialLanguage = 'en_US';
      let initialTitle = '';
      
      if (currentCategory) {
        // 编辑模式 - 处理现有数据
        form.setFieldsValue({
          ...currentCategory,
          blackIcon: currentCategory.blackIcon,
          whiteIcon: currentCategory.whiteIcon,
        });
        
        // 处理多语言标题
        if (currentCategory.languages && Array.isArray(currentCategory.languages)) {
          // 如果有多语言数据
          currentCategory.languages.forEach(item => {
            initialTitleMap[item.languageCode] = item.articleTitle;
          });
          
          // 设置初始语言和标题
          if (currentCategory.languages.length > 0) {
            initialLanguage = currentCategory.languages[0].languageCode;
            initialTitle = currentCategory.languages[0].articleTitle;
          }
        } else if (currentCategory.languageCode && currentCategory.articleTitle) {
          // 如果只有一种语言
          initialLanguage = currentCategory.languageCode;
          initialTitle = currentCategory.articleTitle;
          initialTitleMap[initialLanguage] = initialTitle;
        }
      } else {
        // 新增模式 - 重置表单
        form.resetFields();
        form.setFieldsValue({ languageCode: initialLanguage });
      }
      
      setTitleMap(initialTitleMap);
      setLanguage(initialLanguage);
      setCurrentTitle(initialTitle);
      form.setFieldsValue({ 
        languageCode: initialLanguage,
        articleTitle: initialTitle
      });
    }
  }, [visible, currentCategory, form]);

  return (
    <Modal
      title={currentCategory ? '编辑分类' : '添加分类'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      destroyOnClose
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          label="图标"
          extra="夜间版Logo为必传，若未上传日间版则默认使用夜间版"
        >
          <div style={{ display: 'flex', gap: '20px' }}>
            <div>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ color: 'red', marginRight: '4px' }}>*</span>
                夜间
              </div>
              <Form.Item name="blackIcon" noStyle>
                <AvatarUpload/>
              </Form.Item>
              <div>142*72 png图片</div>
            </div>
            <div>
              <div style={{ marginBottom: '8px' }}>日间</div>
              <Form.Item name="whiteIcon" noStyle>
                <AvatarUpload/>
              </Form.Item>
              <div>142*72 png图片</div>
            </div>
          </div>
        </Form.Item>

        <Form.Item
          label="描述"
          name="helpDescription"
          rules={[{ required: true, message: '请输入描述' }]}
        >
          <Input placeholder="描述" />
        </Form.Item>

        <Form.Item
          label="排序"
          name="helpSort"
          rules={[{ required: true, message: '请输入排序' }]}
        >
          <InputNumber min={1} placeholder="排序" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="上级分类"
          name="parentId"
          rules={[{ required: true, message: '请选择上级分类' }]}
        >
          <Space>
            <Button icon={<PlusOutlined />}></Button>
            <Radio.Group>
              <Radio value="helpCenter">帮助中心</Radio>
            </Radio.Group>
          </Space>
        </Form.Item>

        <Form.Item
          label="语言"
          name="languageCode"
          rules={[{ required: true, message: '请选择语言' }]}
        >
          <LanguageSelector value={language} onChange={handleLanguageChange} />
        </Form.Item>

        <Form.Item
          label="标题"
          name="articleTitle"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input 
            placeholder="输入当前语言的标题" 
            maxLength={30} 
            value={currentTitle}
            onChange={handleTitleChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryFormModal; 