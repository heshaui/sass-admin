import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import AvatarUpload from '@/components/AvatarUpload';
import { updateValue } from '@/services/ant-design-pro/kv';

interface EditModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  record: any;
  backgroundData: any;
  activeLanguage: string;
  activeMode: string;
  activeStatus: string;
}

const EditModal: React.FC<EditModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  record,
  backgroundData,
  activeLanguage,
  activeMode,
  activeStatus,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue({
        title: record.title,
        subtitle: record.subtitle,
        image: record.image,
        buttonText: record.buttonText,
        url: record.url,
      });
    }
  }, [visible, record, form]);

  const changeImge = (url: string) => {
    console.log(url);
  }
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const newData = { ...backgroundData };
      
      // 根据当前选择的语言、模式和状态更新数据
      if (!newData[activeLanguage]) {
        newData[activeLanguage] = {};
      }
      if (!newData[activeLanguage][activeMode]) {
        newData[activeLanguage][activeMode] = {};
      }
      newData[activeLanguage][activeMode][activeStatus] = values;

      setLoading(true);
      const result = await updateValue({
        keyProperty: 'HomeBanner',
        keyValue: JSON.stringify(newData)
      });

      if (result.code === '0'&&result.data) {
        message.success('保存成功');
        onSuccess();
      } else {
        message.error('保存失败');
      }
    } catch (error) {
      console.error('保存数据失败:', error);
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="编辑背景配置"
      open={visible}
      onOk={handleSave}
      onCancel={onCancel}
      confirmLoading={loading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          label="主标题"
          name="title"
          rules={[{ required: true, message: '请输入主标题' }]}
        >
          <Input placeholder="请输入主标题" />
        </Form.Item>

        <Form.Item
          label="副标题"
          name="subtitle"
          rules={[{ required: true, message: '请输入副标题' }]}
        >
          <Input placeholder="请输入副标题" />
        </Form.Item>

        <Form.Item
          label="背景图"
          name="image"
          rules={[{ required: true, message: '请上传背景图' }]}
          extra="建议尺寸：2560*540"
        >
          <AvatarUpload />
        </Form.Item>

        <Form.Item
          label="按钮文案"
          name="buttonText"
          rules={[{ required: true, message: '请输入按钮文案' }]}
        >
          <Input placeholder="请输入按钮文案" />
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