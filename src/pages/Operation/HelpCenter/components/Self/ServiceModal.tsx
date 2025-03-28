import React, { useState,useEffect } from 'react';
import { Modal, Upload, Radio, Input, Form, Button, Space, message, Select } from 'antd';
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
      title="添加服务"
      open={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ language: defaultLanguage }}
      >
        <Form.Item label="图标" name="icon">
          <Space size={64}>
            <Form.Item
              name="nightIcon"
            >
                <div style={{marginBottom: 8,textAlign: 'center'}}>夜间</div>
                <AvatarUpload onChange={(url) => form.setFieldsValue({ nightIcon: url })} />
            </Form.Item>
            <Form.Item
              name="dayIcon"
            >
                   <div style={{marginBottom: 8,textAlign: 'center'}}>日间</div>
             
                   <AvatarUpload onChange={(url) => form.setFieldsValue({ dayIcon: url })} />
            </Form.Item>
         
          </Space>
          <div style={{ marginTop: 8 }}>
            <p>夜间版Logo为必传，若未上传日间版则默认使用夜间版</p>
          </div>
        </Form.Item>

        <Form.Item
          label='语言'
          name="language"
          rules={[{ required: true, message: '请选择语言' }]}
        >
             <LanguageSelector value={language} onChange={handleLanguageChange} />
        </Form.Item>
        <div style={{ marginTop: -16, marginBottom: 16 }}>
          <p>*支持多个语言编辑，英文为必填，其他语言配置则显示，不配置不显示</p>
        </div>

        <Form.Item
          label='标题'
          name="title"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="菜单名字" />
        </Form.Item>

        <Form.Item
          label='访问路径'
          name="accessType"
          initialValue="1"
        >
          <Radio.Group onChange={(e) => setAccessType(e.target.value)}>
            <Radio value="1">PC功能</Radio>
            <Radio value="2">自定义URL</Radio>
          </Radio.Group>
        </Form.Item>

        {accessType === '2' && (
          <Form.Item
            name="customUrl"
            rules={[{ required: accessType === '2', message: '请输入URL' }]}
          >
            <Input placeholder="请输入URL" />
          </Form.Item>
        )}
        {
            accessType === '1' && (
                <Form.Item
                    label='PC功能'
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
                提交
              </Button>
              <Button onClick={handleCancel}>
                取消
              </Button>
            </Space>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ServiceModal; 