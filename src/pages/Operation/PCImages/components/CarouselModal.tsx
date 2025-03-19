import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Button, Input, InputNumber, Radio, Select, Switch, message } from 'antd';
import LanguageSelector from '@/components/LanguageSelector';
import AvatarUpload  from '@/components/AvatarUpload';
import { pcAccessPathAll } from "@/services/ant-design-pro/WebConfig";

interface CarouselModalProps {
  visible: boolean;
  mode: 'create' | 'edit';
  initialValues?: any;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const CarouselModal: React.FC<CarouselModalProps> = ({
  visible,
  mode,
  initialValues,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [urlType, setUrlType] = useState<'custom' | 'pc'>('custom');
  const [language, setLanguage] = useState<string>('en_US');
  const [languageEntries, setLanguageEntries] = useState<any[]>([]);
  const [pcAccessPaths, setPcAccessPaths] = useState<any[]>([]);

  // 使用ref来跟踪表单值的最新状态
  const formValuesRef = useRef<any>({});
  // 跟踪用户实际编辑过的语言
  const editedLanguagesRef = useRef<Set<string>>(new Set());
  
  // 保存当前语言的表单值到ref
  const updateFormValuesRef = () => {
    const currentValues = form.getFieldsValue();
    
    // 检查是否有实际内容
    const hasContent = currentValues.title || currentValues.image ||
                      (urlType === 'custom' && currentValues.linkUrl) ||
                      (urlType === 'pc' && currentValues.pcFunction);
    
    if (hasContent) {
      // 标记该语言已被编辑
      editedLanguagesRef.current.add(language);
      
      formValuesRef.current = {
        ...formValuesRef.current,
        [language]: {
          title: currentValues.title || '',
          linkUrl: urlType === 'custom' ? currentValues.linkUrl || '' : undefined,
          pcFunction: urlType === 'pc' ? currentValues.pcFunction || '' : undefined,
          image: currentValues.image || ''
        }
      };
      console.log(`已保存${language}的表单值到ref:`, formValuesRef.current[language]);
    }
  };

  // 同步ref中的数据到languageEntries状态，只保留已编辑的语言
  const syncRefToLanguageEntries = () => {
    // 只保留用户编辑过的语言条目
    const entries = Array.from(editedLanguagesRef.current)
      .filter(lang => formValuesRef.current[lang])
      .map(lang => ({
        language: lang,
        ...formValuesRef.current[lang]
      }));
    
    console.log('从ref同步到languageEntries (只包含编辑过的语言):', entries);
    setLanguageEntries(entries);
    return entries; // 返回最新的entries用于提交
  };

  // 处理语言切换
  const handleLanguageChange = (newLanguage: string) => {
    // 保存当前语言的表单值到ref
    updateFormValuesRef();
    
    // 切换语言
    setLanguage(newLanguage);
    
    // 加载新语言的表单值
    if (formValuesRef.current[newLanguage]) {
      const values = formValuesRef.current[newLanguage];
      form.setFieldsValue({
        title: values.title || '',
        linkUrl: values.linkUrl || '',
        pcFunction: values.pcFunction || '',
        image: values.image || '',
      });
      
      // 根据新语言内容设置urlType
      if (values.pcFunction) {
        setUrlType('pc');
      } else if (values.linkUrl) {
        setUrlType('custom');
      }
    } else {
      // 如果是新语言，重置表单
      form.setFieldsValue({
        title: '',
        linkUrl: '',
        pcFunction: '',
        image: '',
      });
    }
  };

  const handleSubmit = async () => {
    try {
      // 验证表单
      await form.validateFields();
      
      // 保存当前语言的表单值
      updateFormValuesRef();
      
      // 同步ref到状态并获取最新的entries（只包含编辑过的语言）
      const currentEntries = syncRefToLanguageEntries();
      
      // 检查是否至少有一个语言有内容
      if (currentEntries.length === 0) {
        message.error('请至少添加一种语言的内容');
        return;
      }
      
      // 构建提交数据
      const mainValues = form.getFieldsValue(['isShow', 'sort', 'urlType']);
      const defaultImage = currentEntries[0]?.image || '';
      
      const formData = {
        ...mainValues,
        title: currentEntries.find(e => e.language === language)?.title || '',
        linkUrl: urlType === 'custom' ? form.getFieldValue('linkUrl') : '',
        pcFunction: urlType === 'pc' ? form.getFieldValue('pcFunction') : '',
        image: defaultImage,
        languageEntries: currentEntries,
        id: mode === 'edit' ? initialValues?.id : undefined,
      };
      
      console.log('最终提交的数据:', formData);
      onSubmit(formData);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 初始化加载数据
  useEffect(() => {
    getPcAccessPath();
    
    if (visible) {
      form.resetFields();
      formValuesRef.current = {}; // 重置ref
      editedLanguagesRef.current = new Set(); // 重置编辑过的语言集合
      
      if (mode === 'edit' && initialValues) {
        const { languageEntries: langEntries, ...baseValues } = initialValues;
        
        // 设置基础字段
        form.setFieldsValue({
          isShow: baseValues.isShow,
          sort: baseValues.sort,
          urlType: baseValues.urlType,
        });
        
        setUrlType(baseValues.urlType || 'custom');
        const defaultLanguage = baseValues.languageCode || 'en_US';
        setLanguage(defaultLanguage);
        
        // 处理语言条目
        if (langEntries && langEntries.length > 0) {
          // 将语言条目加载到ref，并标记为已编辑
          langEntries.forEach((entry: any) => {
            if (entry.title || entry.linkUrl || entry.pcFunction || entry.image) {
              formValuesRef.current[entry.language] = {
                title: entry.title || '',
                linkUrl: entry.linkUrl || '',
                pcFunction: entry.pcFunction || '',
                image: entry.image || baseValues.image || '',
              };
              // 标记为已编辑
              editedLanguagesRef.current.add(entry.language);
            }
          });
          
          // 加载当前语言的内容
          const currentLangEntry = langEntries.find(
            (entry: any) => entry.language === defaultLanguage
          );
          
          if (currentLangEntry) {
            form.setFieldsValue({
              title: currentLangEntry.title || '',
              linkUrl: currentLangEntry.linkUrl || '',
              pcFunction: currentLangEntry.pcFunction || '',
              image: currentLangEntry.image || baseValues.image || '',
            });
          }
          
          // 同步到状态
          syncRefToLanguageEntries();
        } else {
          // 如果没有语言条目，但有默认内容，创建一个默认条目
          if (baseValues.title || baseValues.linkUrl || baseValues.pcFunction || baseValues.image) {
            formValuesRef.current[defaultLanguage] = {
              title: baseValues.title || '',
              linkUrl: baseValues.linkUrl || '',
              pcFunction: baseValues.pcFunction || '',
              image: baseValues.image || '',
            };
            // 标记为已编辑
            editedLanguagesRef.current.add(defaultLanguage);
            
            form.setFieldsValue({
              title: baseValues.title || '',
              linkUrl: baseValues.linkUrl || '',
              pcFunction: baseValues.pcFunction || '',
              image: baseValues.image || '',
            });
          }
          
          syncRefToLanguageEntries();
        }
      } else {
        // 创建模式
        setUrlType('custom');
        setLanguage('en_US');
        setLanguageEntries([]);
      }
    }
  }, [visible, mode, initialValues, form]);

  // 获取PC功能列表
  const getPcAccessPath = async () => {
    try {
      const res = await pcAccessPathAll();
      if (res.code === '0' && res.data) {
        setPcAccessPaths(JSON.parse(res.data));
      }
    } catch (error) {
      console.error('获取PC功能失败:', error);
    }
  };

  const modalTitle = mode === 'create' ? '添加' : '编辑';

  return (
    <Modal
      title={modalTitle}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>取消</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>提交</Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item label="是否显示" name="isShow" valuePropName="checked" initialValue={true}>
          <Switch />
        </Form.Item>

        <Form.Item
          label="排序"
          name="sort"
          rules={[{ required: true, message: '请输入排序' }]}
        >
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item label="语言设置">
          <LanguageSelector value={language} onChange={handleLanguageChange} />
        </Form.Item>
        
        <Form.Item
          label="标题"
          name="title"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="标题" />
        </Form.Item>

        <Form.Item
          label="访问路径"
          name="urlType"
          rules={[{ required: true, message: '请选择访问路径类型' }]}
          initialValue="custom"
        >
          <Radio.Group onChange={(e) => setUrlType(e.target.value)}>
            <Radio value="pc">PC功能</Radio>
            <Radio value="custom">自定义URL</Radio>
          </Radio.Group>
        </Form.Item>
        {
            urlType === 'pc' && (
                <Form.Item
                    label="PC功能"
                    name="pcFunction"
                    rules={[{ required: true, message: '请选择PC功能' }]}
                >
                    <Select>
                        {pcAccessPaths.map((item) => (
                            <Select.Option value={item.accessPath} key={item.accessPath}>{item.functionName}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            )   
        }

        {urlType === 'custom' && (
          <Form.Item
            name="linkUrl"
            rules={[{ required: true, message: '请输入URL' }]}
          >
            <Input placeholder="请输入URL" />
          </Form.Item>
        )}

        <Form.Item
          label={`图片 (${language})`} 
          name="image"
          rules={[{ required: mode === 'create', message: '请上传图片' }]}
        >
          <AvatarUpload />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CarouselModal;