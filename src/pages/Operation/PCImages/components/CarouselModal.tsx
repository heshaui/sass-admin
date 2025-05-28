import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Button, Input, InputNumber, Radio, Select, Switch, message } from 'antd';
import { useIntl } from 'umi';
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
  const intl = useIntl();
  console.log(initialValues);
  const [form] = Form.useForm();
  const [accessType, setAccessType] = useState<1 | 2>(1);
  const [language, setLanguage] = useState<string>('en_US');
  const [languageEntries, setLanguageEntries] = useState<any[]>([]);
  const [pcAccessPaths, setPcAccessPaths] = useState<any[]>([]);
 // 获取PC功能列表
 const getPcAccessPath = async () => {
  try {
    let data = {
      pageNo: 1,
      pageSize: 10000
    }
    const res = await pcAccessPathAll(data);
    if (res.code === '0' && res.data) {
      setPcAccessPaths(JSON.parse(res.data));
    }
  } catch (error) {
    console.error(`${intl.formatMessage({ id: 'pcImages.message.getPcFunctionFailed' })}:`, error);
  }
};
  // 使用ref来跟踪表单值的最新状态
  const formValuesRef = useRef<any>({});
  // 跟踪用户实际编辑过的语言
  const editedLanguagesRef = useRef<Set<string>>(new Set());
  
  // 保存当前语言的表单值到ref
  const updateFormValuesRef = () => {
    const currentValues = form.getFieldsValue();
    
    // 检查是否有实际内容
    const hasContent = currentValues.title || currentValues.image ||
                      (accessType === 2 && currentValues.linkUrl) ||
                      (accessType === 1 && currentValues.pcFunction);
    
    if (hasContent) {
      // 标记该语言已被编辑
      editedLanguagesRef.current.add(language);
      
      formValuesRef.current = {
        ...formValuesRef.current,
        [language]: {
          title: currentValues.title || '',
          linkUrl: accessType === 2 ? currentValues.linkUrl || '' : undefined,
          pcFunction: accessType === 1 ? currentValues.pcFunction || '' : undefined,
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
        setAccessType(1);
      } else if (values.linkUrl) {
        setAccessType(2);
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
        message.error(intl.formatMessage({ id: 'pcImages.message.languageRequired' }));
        return;
      }
      
      // 构建提交数据
      const mainValues = form.getFieldsValue(['isShow', 'sort', 'urlType']);
      const defaultImage = currentEntries[0]?.image || '';
      
      // 将 language 字段重命名为 languageCode，linkUrl/pcFunction 统一为 accessUrl，image 改为 imageUrl
      // 并为每个语言条目添加 accessType
      const formattedEntries = currentEntries.map(entry => {
        const { language, linkUrl, pcFunction, image, ...rest } = entry;
        return { 
          languageCode: language, 
          accessUrl: accessType === 1 ? pcFunction : linkUrl,
          imageUrl: image,
          accessType, // 为每个语言条目添加 accessType
          ...rest 
        };
      });
      
      const formData = {
        ...mainValues,
        isShow: mainValues.isShow ? 1 : 0, // 将布尔值转换为 0 或 1
        title: currentEntries.find(e => e.language === language)?.title || '',
        accessUrl: accessType === 1 ? form.getFieldValue('pcFunction') : form.getFieldValue('linkUrl'),
        imageUrl: defaultImage,
        languageEntries: formattedEntries,
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
        // 处理后端返回的数据结构
        console.log('初始化数据:', initialValues);
        
        // 从carouselImageContents获取语言条目
        const langEntries = initialValues.carouselImageContents || [];
        
        // 获取accessType (可能在条目中或顶层)
        const firstEntry = langEntries[0] || {};
        // 确保accessType是数字类型1或2，默认为2
        const defaultAccessType = firstEntry.accessType ? Number(firstEntry.accessType) : 2;
        
        // 设置基础字段，包括accessType
        form.setFieldsValue({
          isShow: initialValues.isShow === 1,
          sort: initialValues.sort,
          accessType: defaultAccessType, // 明确设置accessType字段
        });
        
        // 更新状态值
        setAccessType(defaultAccessType);
        
        const defaultLanguage = langEntries[0]?.languageCode || 'en_US';
        setLanguage(defaultLanguage);
        
        // 处理语言条目
        if (langEntries && langEntries.length > 0) {
          // 将语言条目加载到ref，并标记为已编辑
          langEntries.forEach((entry: any) => {
            // 确保使用数字类型的accessType
            const entryAccessType = entry.accessType ? Number(entry.accessType) : defaultAccessType;
            
            if (entry.title || entry.accessUrl || entry.imageUrl) {
              formValuesRef.current[entry.languageCode] = {
                title: entry.title || '',
                linkUrl: entryAccessType === 2 ? entry.accessUrl || '' : '',
                pcFunction: entryAccessType === 1 ? entry.accessUrl || '' : '',
                image: entry.imageUrl || '',
              };
              // 标记为已编辑
              editedLanguagesRef.current.add(entry.languageCode);
            }
          });
          
          // 加载当前语言的内容
          const currentLangEntry = langEntries.find(
            (entry: any) => entry.languageCode === defaultLanguage
          );
          
          if (currentLangEntry) {
            const entryAccessType = currentLangEntry.accessType ? Number(currentLangEntry.accessType) : defaultAccessType;
            form.setFieldsValue({
              title: currentLangEntry.title || '',
              linkUrl: entryAccessType === 2 ? currentLangEntry.accessUrl || '' : '',
              pcFunction: entryAccessType === 1 ? currentLangEntry.accessUrl || '' : '',
              image: currentLangEntry.imageUrl || '',
            });
          }
          
          // 同步到状态
          syncRefToLanguageEntries();
        }
      } else {
        // 创建模式
        setAccessType(2);
        form.setFieldsValue({ accessType: 2 }); // 设置默认值
        setLanguage('en_US');
        setLanguageEntries([]);
      }
    }
  }, [visible, mode, initialValues, form]);

 

  const modalTitle = mode === 'create' ? 
    intl.formatMessage({ id: 'carousel.modal.add' }) : 
    intl.formatMessage({ id: 'carousel.modal.edit' });

  return (
    <Modal
      title={modalTitle}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {intl.formatMessage({ id: 'carousel.modal.button.cancel' })}
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {intl.formatMessage({ id: 'carousel.modal.button.submit' })}
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item 
          label={intl.formatMessage({ id: 'carousel.modal.form.isShow' })} 
          name="isShow" 
          valuePropName="checked" 
          initialValue={true}
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'carousel.modal.form.sort' })}
          name="sort"
          rules={[{ required: true, message: intl.formatMessage({ id: 'carousel.modal.form.sort.required' }) }]}
        >
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item label={intl.formatMessage({ id: 'carousel.modal.form.language' })}>
          <LanguageSelector value={language} onChange={handleLanguageChange} />
        </Form.Item>
        
        <Form.Item
          label={intl.formatMessage({ id: 'carousel.modal.form.title' })}
          name="title"
          rules={[{ required: true, message: intl.formatMessage({ id: 'carousel.modal.form.title.required' }) }]}
        >
          <Input placeholder={intl.formatMessage({ id: 'carousel.modal.form.title.placeholder' })} />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'carousel.modal.form.accessPath' })}
          name="accessType"
          rules={[{ required: true, message: intl.formatMessage({ id: 'carousel.modal.form.accessPath.required' }) }]}
        >
          <Radio.Group onChange={(e) => setAccessType(e.target.value)}>
            <Radio value={1}>{intl.formatMessage({ id: 'carousel.modal.form.pcFunction' })}</Radio>
            <Radio value={2}>{intl.formatMessage({ id: 'carousel.modal.form.customUrl' })}</Radio>
          </Radio.Group>
        </Form.Item>
        {
            accessType === 1 && (
                <Form.Item
                    label={intl.formatMessage({ id: 'carousel.modal.form.pcFunction' })}
                    name="pcFunction"
                    rules={[{ required: true, message: intl.formatMessage({ id: 'carousel.modal.form.pcFunction.required' }) }]}
                >
                    <Select>
                        {pcAccessPaths.map((item) => (
                            <Select.Option value={item.accessPath} key={item.accessPath}>{item.functionName}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            )   
        }

        {accessType === 2 && (
          <Form.Item
            name="linkUrl"
            rules={[{ required: true, message: intl.formatMessage({ id: 'carousel.modal.form.url.required' }) }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'carousel.modal.form.url.placeholder' })} />
          </Form.Item>
        )}

        <Form.Item
          label={intl.formatMessage({ id: 'carousel.modal.form.image' }, { language })} 
          name="image"
          rules={[{ required: mode === 'create', message: intl.formatMessage({ id: 'carousel.modal.form.image.required' }) }]}
        >
          <AvatarUpload />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CarouselModal;