import React, { useState } from 'react';
import { Modal, Form, Input, Select, Radio, message } from 'antd';
import { addKv } from '@/services/ant-design-pro/kv';

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
  const isMerchant = process.env.UMI_APP_MERCHANT_FLAG === '1';

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
    const data={
      status:0,
      ...values
    }
      const response = await addKv(data);
      if (response.code === '0') {
        message.success('添加成功');
        form.resetFields();
        onSuccess();
        onCancel();
      } else {
        message.error(`添加失败: ${response.message}`);
      }
    } catch (error) {
      console.error('表单验证或提交失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="新增KV配置"
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
        
      {
        isAdmin && (
          <Form.Item
            name="show"
            label="是否对商户显示"
          >
            <Radio.Group>
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
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
          label="描述"
        >
          <TextArea rows={4} placeholder="用于描述该配置的用途" />
        </Form.Item>

        <Form.Item
          name="keyProperty"
          label="唯一Key"
          rules={[{ required: true, message: '请输入唯一Key' }]}
        >
          <Input placeholder="这是一个KV" />
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

export default AddModal; 