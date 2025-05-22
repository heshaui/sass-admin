import React, { useState } from 'react';
import { Modal, Form, Input, Select, Radio, message } from 'antd';
import { useIntl } from 'umi';
import { addKv,addTenantKv,  } from '@/services/ant-design-pro/kv';

const { Option } = Select;
const { TextArea } = Input;

interface AddModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isAdmin = process.env.UMI_APP_ADMIN_FLAG === '1';
  const intl = useIntl();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
    const data={
      status:0,
      ...values
    }
      const response = isAdmin
      ?await addKv(data):await addTenantKv(data)
      if (response.code === '0') {
        message.success(intl.formatMessage({ id: 'kv.message.addSuccess' }));
        form.resetFields();
        onSuccess();
        onCancel();
      } else {
        message.error(intl.formatMessage({ id: 'kv.message.addFailed' }, { message: response.message }));
      }
    } catch (error) {
      console.error('表单验证或提交失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'kv.modal.add.title' })}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      maskClosable={false}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ isShow: '是' }}
      >
        <Form.Item
          name="theme"
          label={intl.formatMessage({ id: 'kv.form.theme' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'kv.form.theme.required' }) }]}
        >
          <Input placeholder={intl.formatMessage({ id: 'kv.form.theme.placeholder' })} />
        </Form.Item>

        <Form.Item
          name="type"
          label={intl.formatMessage({ id: 'kv.form.type' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'kv.form.type.required' }) }]}
        >
          <Select placeholder={intl.formatMessage({ id: 'kv.form.type.placeholder' })}>
            <Option value="basic_functions">
              {intl.formatMessage({ id: 'kv.form.type.basic_functions' })}
            </Option>
            <Option value="coin_exchange">
              {intl.formatMessage({ id: 'kv.form.type.coin_exchange' })}
            </Option>
            <Option value="system_configuration">
              {intl.formatMessage({ id: 'kv.form.type.system_configuration' })}
            </Option>
          </Select>
        </Form.Item>
        
      {
        isAdmin && (
          <Form.Item
            name="show"
            label={intl.formatMessage({ id: 'kv.form.show' })}
          >
            <Radio.Group>
              <Radio value="1">{intl.formatMessage({ id: 'kv.form.show.yes' })}</Radio>
              <Radio value="0">{intl.formatMessage({ id: 'kv.form.show.no' })}</Radio>
            </Radio.Group>
          </Form.Item>
        )
      }
        {/* <Form.Item
          name="show"
          label="是否对商户显示"
        >
          <Radio.Group>
            <Radio value="1">是</Radio>
            <Radio value="0">否</Radio>
          </Radio.Group>
        </Form.Item> */}

        <Form.Item
          name="describe"
          label={intl.formatMessage({ id: 'kv.form.describe' })}
        >
          <TextArea rows={4} placeholder={intl.formatMessage({ id: 'kv.form.describe.placeholder' })} />
        </Form.Item>

        <Form.Item
          name="keyProperty"
          label={intl.formatMessage({ id: 'kv.form.keyProperty' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'kv.form.keyProperty.required' }) }]}
        >
          <Input placeholder={intl.formatMessage({ id: 'kv.form.keyProperty.placeholder' })} />
        </Form.Item>

        <Form.Item
          name="keyValue"
          label={intl.formatMessage({ id: 'kv.form.keyValue' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'kv.form.keyValue.required' }) }]}
        >
          <Input placeholder={intl.formatMessage({ id: 'kv.form.keyValue.placeholder' })} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddModal; 