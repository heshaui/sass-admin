// src/components/PermissionModal.tsx
import React from 'react';
import { Modal, Form, Input } from 'antd';
import { useIntl } from 'umi';

interface PermissionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;  // 编辑时传递的初始值
}

const PermissionModal: React.FC<PermissionModalProps> = ({ visible, onClose, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const intl = useIntl();

  return (
    <Modal
      visible={visible}
      title={initialValues ? intl.formatMessage({ id: 'merchantSystem.permissionModal.title.edit' }) : intl.formatMessage({ id: 'merchantSystem.permissionModal.title.create' })}
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
          name="title"
          label={intl.formatMessage({ id: 'merchantSystem.permissionModal.form.title' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'merchantSystem.permissionModal.form.title.required' }) }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="titleKey"
          label={intl.formatMessage({ id: 'merchantSystem.permissionModal.form.titleKey' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'merchantSystem.permissionModal.form.title.required' }) }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          label={intl.formatMessage({ id: 'merchantSystem.permissionModal.form.name' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'merchantSystem.permissionModal.form.title.required' }) }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label={intl.formatMessage({ id: 'merchantSystem.permissionModal.form.type' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'merchantSystem.permissionModal.form.title.required' }) }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="optionType"
          label={intl.formatMessage({ id: 'merchantSystem.permissionModal.form.optionType' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'merchantSystem.permissionModal.form.title.required' }) }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="path"
          label={intl.formatMessage({ id: 'merchantSystem.permissionModal.form.path' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'merchantSystem.permissionModal.form.path.required' }) }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="component"
          label={intl.formatMessage({ id: 'merchantSystem.permissionModal.form.component' })}
          rules={[{ message: intl.formatMessage({ id: 'merchantSystem.permissionModal.form.component.required' }) }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label={intl.formatMessage({ id: 'merchantSystem.permissionModal.form.description' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'merchantSystem.permissionModal.form.description.required' }) }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="parentId"
          label={intl.formatMessage({ id: 'merchantSystem.permissionModal.form.parentId' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'merchantSystem.permissionModal.form.parentId.required' }) }]}

        >
          <Input />
        </Form.Item>
        <Form.Item
          name="sort"
          label={intl.formatMessage({ id: 'merchantSystem.permissionModal.form.sort' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'merchantSystem.permissionModal.form.sort.required' }) }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="icon"
          label={intl.formatMessage({ id: 'merchantSystem.permissionModal.form.icon' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'merchantSystem.permissionModal.form.icon.required' }) }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PermissionModal;