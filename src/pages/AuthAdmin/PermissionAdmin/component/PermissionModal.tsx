// src/components/PermissionModal.tsx
import React from 'react';
import { Modal, Form, Input, Select } from 'antd';

interface PermissionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;  // 编辑时传递的初始值
}

const PermissionModal: React.FC<PermissionModalProps> = ({ visible, onClose, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title={initialValues ? '编辑权限' : '新建权限'}
      onCancel={onClose}
      onOk={() => {
        form.validateFields().then((values) => {
          onSubmit(values);
          form.resetFields();
        });
      }}
    >
      <Form
        form={form}
        initialValues={initialValues}
        layout="vertical"
      >
         <Form.Item
          name="systemType"
          label="系统"
          rules={[{ required: true, message: '请选择系统' }]}
        >
          <Select>
            <Select.Option value="1">总后台</Select.Option>
            <Select.Option value="2">商户后台</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="title"
          label="中文标题"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="titleKey"
          label="多语言"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label="菜单权限"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="optionType"
          label="操作权限"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="path"
          label="页面路径"
          rules={[{ required: true, message: '请输入页面路径' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="component"
          label="前端路径"
          rules={[{ message: '请输入前端路径' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true,message: '请输入描述' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="parentId"
          label="父级ID"
          rules={[{ required: true, message: '请输入父级ID' }]}

        >
          <Input />
        </Form.Item>
        <Form.Item
          name="sort"
          label="排序"
          rules={[{ required: true, message: '请输入排序' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="icon"
          label="icon"
          rules={[{ required: true, message: '请输入icon' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PermissionModal;