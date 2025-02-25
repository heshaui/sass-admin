import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Radio, message } from 'antd';
import { updateKv } from '@/services/ant-design-pro/kv';

const { Option } = Select;
const { TextArea } = Input;

interface EditModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  record: any;
}

const EditModal: React.FC<EditModalProps> = ({ visible, onCancel, onSuccess, record }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue({
        theme: record.theme,
        type: record.type,
        show: record.show.toString(),
        describe: record.describe,
        keyProperty: record.keyProperty,
        keyValue: record.keyValue,
      });
    }
  }, [visible, record, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const data = {
        id: record.id,
        status: record.status,
        ...values
      };
      
      const response = await updateKv(data);
      if (response.code === '0') {
        message.success('修改成功');
        onSuccess();
        onCancel();
      } else {
        message.error(`修改失败: ${response.message}`);
      }
    } catch (error) {
      console.error('表单验证或提交失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="修改KV配置"
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
      >
        <Form.Item
          name="theme"
          label="标题"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="请输入标题" />
        </Form.Item>

        <Form.Item
          name="type"
          label="类别"
          rules={[{ required: true, message: '请选择类别' }]}
        >
          <Select placeholder="请选择类别">
            <Option value="基础功能">基础功能</Option>
            <Option value="法币交易">法币交易</Option>
            <Option value="币币交易">币币交易</Option>
            <Option value="系统配置">系统配置</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="show"
          label="是否对商户显示"
        >
          <Radio.Group>
            <Radio value="1">是</Radio>
            <Radio value="0">否</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="describe"
          label="描述"
        >
          <TextArea rows={4} placeholder="用于描述该配置的用途" />
        </Form.Item>

        <Form.Item
          name="keyProperty"
          label="唯一Key"
          rules={[{ required: true, message: '请输入唯一Key' }]}
        >
          <Input placeholder="这是一个KV" disabled />
        </Form.Item>

        <Form.Item
          name="keyValue"
          label="配置值"
          rules={[{ required: true, message: '请输入配置值' }]}
        >
          <Input placeholder="请输入配置值" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal; 