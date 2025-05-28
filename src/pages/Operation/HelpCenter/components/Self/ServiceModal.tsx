import React, { useState, useEffect } from 'react';
import { Modal, Upload, Radio, Input, Form, Button, Space, message, Select } from 'antd';
import { useIntl } from 'umi';
import type { UploadFile } from 'antd/es/upload/interface';
import LanguageSelector from '@/components/LanguageSelector';
import AvatarUpload  from '@/components/AvatarUpload';
import { pcAccessPathAll } from "@/services/ant-design-pro/WebConfig";

interface ServiceModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: any) => void;
  defaultLanguage: string;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  defaultLanguage,
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [nightIcon, setNightIcon] = useState<UploadFile[]>([]);
  const [dayIcon, setDayIcon] = useState<UploadFile[]>([]);
  const [accessType, setAccessType] = useState<'1' | '2'>('1');
  const [language, setLanguage] = useState<string>('en_US');
  const [languageFormData, setLanguageFormData] = useState<Record<string, any>>({
    en_US: { title: '', accessType: '1', customUrl: '', pcFunction: undefined }
  });
    const [pcAccessPath, setPcAccessPath] = useState<any[]>([]);
  const getPcAccessPath = async () => {
    const res = await pcAccessPathAll();
    setPcAccessPath(JSON.parse(res.data));
  };



  const handleLanguageChange = (lang: string) => {
    // 保存当前语言的表单数据
    const currentValues = form.getFieldsValue();
    const { title, accessType, customUrl, pcFunction } = currentValues;
    
    setLanguageFormData(prev => ({
      ...prev,
      [language]: { title, accessType, customUrl, pcFunction }
    }));
    
    // 切换到新语言
    setLanguage(lang);
    
    // 加载新语言的表单数据（如果有）
    const langData = languageFormData[lang] || { title: '', accessType: '1', customUrl: '', pcFunction: undefined };
    form.setFieldsValue(langData);
  };

  // 重置表单
  const handleCancel = () => {
    form.resetFields();
    setNightIcon([]);
    setDayIcon([]);
    setAccessType('1');
    setLanguage('en_US');
    setLanguageFormData({
      en_US: { title: '', accessType: '1', customUrl: '', pcFunction: undefined }
    });
    onCancel();
  };

  // 提交表单
  const handleSubmit = () => {
    // 先确保获取当前语言的表单数据
    form.validateFields().then(values => {
      console.log(values)
      const { title, accessType, customUrl, pcFunction, nightIcon, dayIcon } = values;
      console.log('values',values);
      // 更新当前语言的表单数据
      const updatedLanguageFormData = {
        ...languageFormData,
        [language]: { title, accessType, customUrl, pcFunction }
      };
      
      // 获取所有已编辑的语言
      const editedLanguages = Object.keys(updatedLanguageFormData);
      
      // 构建最终提交数据
      const homeHelpCenterCustomization = {
        // 修正图标数据的获取方式
        whiteIcon: dayIcon,
        
        blackIcon: nightIcon,
        accessType: accessType,
      };
      
      // 记录图标信息到控制台，便于调试
      console.log('图标数据:', { nightIcon, dayIcon });
      console.log('处理后的图标数据:', { 
        whiteIcon: homeHelpCenterCustomization.whiteIcon, 
        blackIcon: homeHelpCenterCustomization.blackIcon 
      });
      
      const homeHelpCenterCustomizationContents = editedLanguages.map(lang => {
        const langData = updatedLanguageFormData[lang];
        return {
          articleTitle: langData.title,
          languagePath: langData.accessType === '1' ? langData.pcFunction : langData.customUrl,
          languageCode: lang
        };
      });
      
      const submitData = {
        homeHelpCenterCustomization,
        homeHelpCenterCustomizationContents
      };
      
      console.log('提交的数据结构:', submitData);
      handleCancel();
      onSubmit(submitData);
    }).catch(err => {
      console.error('表单验证失败:', err);
    });
  };

  // 上传前检查文件大小和类型
 


  useEffect(() => {
    getPcAccessPath();
  }, []);
  return (
    <Modal
      title={intl.formatMessage({ id: 'helpCenter.serviceModal.title' })}
      open={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ language: defaultLanguage }}
      >
        <Form.Item label={intl.formatMessage({ id: 'helpCenter.serviceModal.form.icon' })} name="icon">
          <Space size={64}>
            <Form.Item
              name="nightIcon"
            >
                <div style={{marginBottom: 8,textAlign: 'center'}}>
                  {intl.formatMessage({ id: 'helpCenter.serviceModal.form.nightMode' })}
                </div>
                <AvatarUpload onChange={(url) => form.setFieldsValue({ nightIcon: url })} />
            </Form.Item>
            <Form.Item
              name="dayIcon"
            >
                <div style={{marginBottom: 8,textAlign: 'center'}}>
                  {intl.formatMessage({ id: 'helpCenter.serviceModal.form.dayMode' })}
                </div>
                <AvatarUpload onChange={(url) => form.setFieldsValue({ dayIcon: url })} />
            </Form.Item>
          </Space>
          <div style={{ marginTop: 8 }}>
            <p>{intl.formatMessage({ id: 'helpCenter.serviceModal.form.iconNote' })}</p>
          </div>
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'helpCenter.serviceModal.form.language' })}
          name="language"
          rules={[{ required: true, message: intl.formatMessage({ id: 'helpCenter.serviceModal.form.languageRequired' }) }]}
        >
             <LanguageSelector value={language} onChange={handleLanguageChange} />
        </Form.Item>
        <div style={{ marginTop: -16, marginBottom: 16 }}>
          <p>{intl.formatMessage({ id: 'helpCenter.serviceModal.form.languageNote' })}</p>
        </div>

        <Form.Item
          label={intl.formatMessage({ id: 'helpCenter.serviceModal.form.title' })}
          name="title"
          rules={[{ required: true, message: intl.formatMessage({ id: 'helpCenter.serviceModal.form.titleRequired' }) }]}
        >
          <Input placeholder={intl.formatMessage({ id: 'helpCenter.serviceModal.form.titlePlaceholder' })} />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'helpCenter.serviceModal.form.accessPath' })}
          name="accessType"
          initialValue="1"
        >
          <Radio.Group onChange={(e) => setAccessType(e.target.value)}>
            <Radio value="1">{intl.formatMessage({ id: 'helpCenter.serviceModal.form.pcFunction' })}</Radio>
            <Radio value="2">{intl.formatMessage({ id: 'helpCenter.serviceModal.form.customUrl' })}</Radio>
          </Radio.Group>
        </Form.Item>

        {accessType === '2' && (
          <Form.Item
            name="customUrl"
            rules={[{ required: accessType === '2', message: intl.formatMessage({ id: 'helpCenter.serviceModal.form.urlRequired' }) }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'helpCenter.serviceModal.form.urlPlaceholder' })} />
          </Form.Item>
        )}
        {
            accessType === '1' && (
                <Form.Item
                    label={intl.formatMessage({ id: 'helpCenter.serviceModal.form.pcFunction' })}
                    name='pcFunction'
                >
                    <Select>
                    {pcAccessPath.map((item) => (
                            <Select.Option value={item.accessPath} key={item.accessPath}>{item.functionName}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            )
        }

        <Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button type="primary" onClick={handleSubmit}>
                {intl.formatMessage({ id: 'helpCenter.serviceModal.button.submit' })}
              </Button>
              <Button onClick={handleCancel}>
                {intl.formatMessage({ id: 'helpCenter.serviceModal.button.cancel' })}
              </Button>
            </Space>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ServiceModal; 