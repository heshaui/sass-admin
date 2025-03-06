import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Image, message } from 'antd';
import type { TableItem } from '../index';
import { updateValue } from '@/services/ant-design-pro/kv';
import AvatarUpload from '@/components/AvatarUpload'
interface EditModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  record: TableItem | null;
  activeLanguage: string;
  activeTab: string;
  pcLoginData: any;
}

const EditModal: React.FC<EditModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  record,
  activeLanguage,
  activeTab,
  pcLoginData,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue(record);
    }
  }, [visible, record, form]);

  const handleSave = async () => {
    try {
      setSubmitting(true);
      // 创建一个深拷贝，避免直接修改原始数据
      const newPcLoginData = JSON.parse(JSON.stringify(pcLoginData || {}));
      
      // 确保当前语言数据结构存在
      if (!newPcLoginData[activeLanguage]) {
        newPcLoginData[activeLanguage] = {};
      }
      
      // 只更新当前语言和当前标签页的数据
      newPcLoginData[activeLanguage][activeTab] = {
        title: form.getFieldValue('title'),
        image: form.getFieldValue('image'),
        url: form.getFieldValue('url')
      };
      
      // 保存到服务器
      const result = await updateValue({
        keyProperty: 'pcLogin',
        keyValue: JSON.stringify(newPcLoginData)
      });
      
      if (result.code === '0') {
        message.success('保存成功');
        onSuccess();
      } else {
        message.error('保存失败');
      }
    } catch (error) {
      console.error('保存数据失败:', error);
      message.error('保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={`编辑${activeTab === 'login' ? '登录' : '注册'}配置`}
      open={visible}
      onOk={handleSave}
      onCancel={onCancel}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={record || {}}
      >
        <Form.Item
          label="标题"
          name="title"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="请输入标题" />
        </Form.Item>
        
        <Form.Item
          label="图片"
          name="image"
          rules={[{ required: true, message: '请上传图片' }]}
          extra="建议尺寸：126*869"
        >
          <AvatarUpload/>
        </Form.Item>
        
        <Form.Item
          label="跳转地址"
          name="url"
          rules={[{ required: true, message: '请输入跳转地址' }]}
        >
          <Input placeholder="请输入跳转地址" />
        </Form.Item>

      
      </Form>
    </Modal>
  );
};

export default EditModal;