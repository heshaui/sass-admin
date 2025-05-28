import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import { useIntl } from 'umi';

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
  const intl = useIntl();
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
        message.error(intl.formatMessage({ id: 'resetPasswordModal.validation.failed' }));
      });
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'resetPasswordModal.title' })}
      visible={visible}
      onCancel={onClose}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="newPassword"
          label={intl.formatMessage({ id: 'resetPasswordModal.form.newPassword' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'resetPasswordModal.form.newPassword.required' }) }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ResetPasswordModal;