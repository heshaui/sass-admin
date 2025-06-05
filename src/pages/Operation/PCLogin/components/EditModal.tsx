import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Image, message } from 'antd';
import type { TableItem } from '../index';
import { useIntl } from 'umi';
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
  const intl = useIntl();
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
        message.success(intl.formatMessage({ id: 'pcLogin.modal.message.saveSuccess' }));
        onSuccess();
      } else {
        message.error(intl.formatMessage({ id: 'pcLogin.modal.message.saveFailed' }));
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'pcLogin.modal.message.saveFailed' }), error);
      message.error(intl.formatMessage({ id: 'pcLogin.modal.message.saveFailed' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={intl.formatMessage(
        { id: activeTab === 'login' ? 'pcLogin.modal.title.login' : 'pcLogin.modal.title.register' }
      )}
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
          label={intl.formatMessage({ id: 'pcLogin.modal.form.title' })}
          name="title"
        >
          <Input placeholder={intl.formatMessage({ id: 'pcLogin.modal.form.title.placeholder' })} />
        </Form.Item>
        
        <Form.Item
          label={intl.formatMessage({ id: 'pcLogin.modal.form.image' })}
          name="image"
          rules={[{ required: true, message: intl.formatMessage({ id: 'pcLogin.modal.form.image.required' }) }]}
          extra={intl.formatMessage({ id: 'pcLogin.modal.form.image.extra' })}
        >
          <AvatarUpload/>
        </Form.Item>
        
        <Form.Item
          label={intl.formatMessage({ id: 'pcLogin.modal.form.url' })}
          name="url"
        >
          <Input placeholder={intl.formatMessage({ id: 'pcLogin.modal.form.url.placeholder' })} />
        </Form.Item>

      
      </Form>
    </Modal>
  );
};

export default EditModal;