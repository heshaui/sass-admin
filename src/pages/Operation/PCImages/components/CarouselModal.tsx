import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Input, InputNumber, Radio, Select, Switch, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { getLanguageList } from '@/services/ant-design-pro/operation';
import LanguageSelector from '@/components/LanguageSelector';
import AvatarUpload  from '@/components/AvatarUpload';
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
  const [urlType, setUrlType] = useState<string>('custom');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [language, setLanguage] = useState('en_US');

  // 当模态框打开或模式/初始值变化时，重置表单
  useEffect(() => {
    if (visible) {
      form.resetFields();
      
      if (mode === 'edit' && initialValues) {
        form.setFieldsValue(initialValues);
        setUrlType(initialValues.urlType || 'custom');
        
        // 设置图片
        if (initialValues.imageUrl) {
          setFileList([
            {
              uid: '-1',
              name: 'image.png',
              status: 'done',
              url: initialValues.imageUrl,
            },
          ]);
        } else {
          setFileList([]);
        }
      } else {
        setUrlType('custom');
        setFileList([]);
      }
    }
  }, [visible, mode, initialValues, form]);


  const handleLanguageChange = (value: string) => {
    setLanguage(value);

  }
    
  const beforeUpload = (file: RcFile) => {
    const isPNG = file.type === 'image/png';
    if (!isPNG) {
      message.error('只能上传PNG图片!');
    }
    const isLt500K = file.size / 1024 < 500;
    if (!isLt500K) {
      message.error('图片必须小于500KB!');
    }
    return isPNG && isLt500K;
  };



  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 新建模式时必须上传图片，编辑模式可选
      if (mode === 'create' && fileList.length === 0) {
        message.error('请上传图片');
        return;
      }
      
      const formData = {
        ...values,
        imageFile: fileList[0],
        id: mode === 'edit' ? initialValues?.id : undefined,
      };
      
      onSubmit(formData);
    } catch (error) {
      console.error('表单验证失败:', error);
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

        <Form.Item
          label="语言"
          name="languageCode"
          rules={[{ required: true, message: '请选择语言' }]}
        >
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
                        <Select.Option value="home">首页</Select.Option>
                        <Select.Option value="product">产品</Select.Option>
                        <Select.Option value="news">新闻</Select.Option>
                        <Select.Option value="contact">联系我们</Select.Option>
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
          label="图片"
          name="image"
          rules={[{ required: mode === 'create', message: '请上传图片' }]}
        >
                <AvatarUpload/>

        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CarouselModal;