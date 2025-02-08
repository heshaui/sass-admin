import React from 'react';
import { Modal, Form, Input, message } from 'antd';

interface ResetPasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: { newPassword: string }) => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validation Failed:', info);
        message.error('请填写新密码');
      });
  };

  return (
    <Modal
      title="重置密码"
      visible={visible}
      onCancel={onClose}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[{ required: true, message: '请输入新密码' }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ResetPasswordModal;