import React from 'react';
import { Form, Input, Button, Modal, InputNumber, Switch } from 'antd';

// 拓展信息数据类型定义
export type ExtendInfoFormData = {
  coinId?: number;
  protocolId?: number;
  mainAddress?: string;
  token?: string;
  decimals?: number;
  status?: number;
  withdrawFee?: number;
  minWithdrawFee?: number;
  confirms?: number;
};

interface ExtendInfoFormProps {
  visible: boolean;
  initialValues?: ExtendInfoFormData | null;
  onSubmit: (values: ExtendInfoFormData) => void;
  onCancel: () => void;
}

const ExtendInfoForm: React.FC<ExtendInfoFormProps> = ({
  visible,
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="币种拓展信息"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      maskClosable={false}
      width={600}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          提交
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues || {}}
      >
        <Form.Item
          name="coinId"
          label="币种ID"
          rules={[{ required: true, message: '请输入币种ID' }]}
        >
          <InputNumber style={{ width: '100%' }} disabled={!!initialValues?.coinId} />
        </Form.Item>

        <Form.Item
          name="protocolId"
          label="协议ID"
          rules={[{ required: true, message: '请输入协议ID' }]}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="mainAddress"
          label="主地址"
          rules={[{ required: true, message: '请输入主地址' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="token"
          label="Token"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="decimals"
          label="小数位数"
          rules={[{ required: true, message: '请输入小数位数' }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} max={18} />
        </Form.Item>

        <Form.Item
          name="status"
          label="状态"
          valuePropName="checked"
        >
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>

        <Form.Item
          name="withdrawFee"
          label="提现手续费"
          rules={[{ required: true, message: '请输入提现手续费' }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} step={0.0001} />
        </Form.Item>

        <Form.Item
          name="minWithdrawFee"
          label="最小提现手续费"
          rules={[{ required: true, message: '请输入最小提现手续费' }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} step={0.0001} />
        </Form.Item>

        <Form.Item
          name="confirms"
          label="确认数"
          rules={[{ required: true, message: '请输入确认数' }]}
        >
          <InputNumber style={{ width: '100%' }} min={1} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExtendInfoForm; 