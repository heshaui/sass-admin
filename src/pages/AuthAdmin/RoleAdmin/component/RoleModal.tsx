import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message, Tree, Select } from 'antd';

interface RoleModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;  // 编辑时传递的初始值
  allPermissions: any[];  // 所有权限数据，包括树形结构的权限
}

const RoleModal: React.FC<RoleModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialValues,

}) => {
  const [form] = Form.useForm();


  // 设置初始权限选择，编辑时填充用户已分配的权限
  useEffect(() => {

    // 重置表单，确保每次打开都是新的状态
    form.resetFields();
  }, [visible, initialValues, form]);

  // 提交表单
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit({
          ...values,

        });
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
      title={initialValues ? '编辑角色' : '新建角色'}
      onCancel={onClose}
      onOk={handleSubmit}
    >
      <Form
        form={form}
        initialValues={initialValues}
        layout="vertical"
      >
        <Form.Item
          name="roleName"
          label="角色名称"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="describe"
          label="描述"
          rules={[{ required: true, message: '请输入角色描述' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="status"
          label="状态"
          rules={[{ required: true, message: '请选择角色状态' }]}
        >
          <Select placeholder="请选择状态">
            <Select.Option value={1}>启用</Select.Option>
            <Select.Option value={0}>禁用</Select.Option>
          </Select>
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default RoleModal;