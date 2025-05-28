import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { useIntl } from 'umi';
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
  const intl = useIntl();
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
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const newData = { ...backgroundData };
      
      // Update data based on current language, mode and status
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
        message.success(intl.formatMessage({ id: 'webConfig.editModal.saveSuccess' }));
        onSuccess();
      } else {
        message.error(intl.formatMessage({ id: 'webConfig.editModal.saveFailed' }));
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'webConfig.editModal.saveError' }), error);
      message.error(intl.formatMessage({ id: 'webConfig.editModal.saveFailed' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'webConfig.editModal.title' })}
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
          label={intl.formatMessage({ id: 'webConfig.editModal.form.title' })}
          name="title"
          rules={[{ required: true, message: intl.formatMessage({ id: 'webConfig.editModal.form.title.required' }) }]}
        >
          <Input placeholder={intl.formatMessage({ id: 'webConfig.editModal.form.title.placeholder' })} />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'webConfig.editModal.form.subtitle' })}
          name="subtitle"
          rules={[{ required: true, message: intl.formatMessage({ id: 'webConfig.editModal.form.subtitle.required' }) }]}
        >
          <Input placeholder={intl.formatMessage({ id: 'webConfig.editModal.form.subtitle.placeholder' })} />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'webConfig.editModal.form.image' })}
          name="image"
          rules={[{ required: true, message: intl.formatMessage({ id: 'webConfig.editModal.form.image.required' }) }]}
          extra={intl.formatMessage({ id: 'webConfig.editModal.form.image.extra' })}
        >
          <AvatarUpload />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'webConfig.editModal.form.buttonText' })}
          name="buttonText"
          rules={[{ required: true, message: intl.formatMessage({ id: 'webConfig.editModal.form.buttonText.required' }) }]}
        >
          <Input placeholder={intl.formatMessage({ id: 'webConfig.editModal.form.buttonText.placeholder' })} />
        </Form.Item>

        <Form.Item
          label={intl.formatMessage({ id: 'webConfig.editModal.form.url' })}
          name="url"
          rules={[{ required: true, message: intl.formatMessage({ id: 'webConfig.editModal.form.url.required' }) }]}
        >
          <Input placeholder={intl.formatMessage({ id: 'webConfig.editModal.form.url.placeholder' })} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal; 