// src/components/UserModal.tsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';

interface UserModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any; // 编辑时传递的初始值
}

const UserModal: React.FC<UserModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  // 编辑时填充初始值
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  // 提交表单
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values); // 调用提交函数
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
        message.error('请填写所有必填项');
      });
  };

  return (
    <Modal
      visible={visible}
      title={initialValues ? '编辑用户' : '新建用户'}
      onCancel={onClose}
      onOk={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="nickname"
          label="昵称"
          rules={[{ required: true, message: '请输入昵称' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="手机号"
          rules={[{ required: true, message: '请输入手机号' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="邮箱"
          rules={[{ required: true, message: '请输入邮箱' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择用户状态' }]}
        >
          <Select>
            <Select.Option value="1">正常</Select.Option>
            <Select.Option value="0">禁用</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;