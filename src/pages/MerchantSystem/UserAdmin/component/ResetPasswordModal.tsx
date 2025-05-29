import React from 'react';
import { useIntl } from 'umi';
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
  const intl = useIntl();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validation Failed:', info);
        message.error(intl.formatMessage({ id: 'merchantSystem.resetPasswordModal.message.fillRequired' }));
      });
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'merchantSystem.resetPasswordModal.title' })}
      visible={visible}
      onCancel={onClose}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="newPassword"
          label={intl.formatMessage({ id: 'merchantSystem.resetPasswordModal.form.newPassword' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'merchantSystem.resetPasswordModal.form.newPassword.required' }) }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ResetPasswordModal;