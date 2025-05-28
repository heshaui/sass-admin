// src/components/PermissionModal.tsx
import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useIntl } from 'umi';

interface PermissionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;  // 编辑时传递的初始值
}

const PermissionModal: React.FC<PermissionModalProps> = ({ visible, onClose, onSubmit, initialValues }) => {
  const intl = useIntl();
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title={initialValues ? 
        intl.formatMessage({ id: 'permissionModal.title.edit' }) : 
        intl.formatMessage({ id: 'permissionModal.title.create' })
      }
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
          label={intl.formatMessage({ id: 'permissionModal.form.systemType' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'permissionModal.form.validation.select' }, { field: intl.formatMessage({ id: 'permissionModal.form.systemType' }) }) }]}
        >
          <Select>
            <Select.Option value="1">{intl.formatMessage({ id: 'permissionModal.form.systemType.admin' })}</Select.Option>
            <Select.Option value="2">{intl.formatMessage({ id: 'permissionModal.form.systemType.merchant' })}</Select.Option>
            <Select.Option value="3">{intl.formatMessage({ id: 'permissionModal.form.systemType.common' })}</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="title"
          label={intl.formatMessage({ id: 'permissionModal.form.title' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'permissionModal.form.validation.required' }, { field: intl.formatMessage({ id: 'permissionModal.form.title' }) }) }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="titleKey"
          label={intl.formatMessage({ id: 'permissionModal.form.titleKey' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'permissionModal.form.validation.required' }, { field: intl.formatMessage({ id: 'permissionModal.form.titleKey' }) }) }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          label={intl.formatMessage({ id: 'permissionModal.form.name' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'permissionModal.form.validation.required' }, { field: intl.formatMessage({ id: 'permissionModal.form.name' }) }) }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label={intl.formatMessage({ id: 'permissionModal.form.type' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'permissionModal.form.validation.required' }, { field: intl.formatMessage({ id: 'permissionModal.form.type' }) }) }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="optionType"
          label={intl.formatMessage({ id: 'permissionModal.form.optionType' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'permissionModal.form.validation.required' }, { field: intl.formatMessage({ id: 'permissionModal.form.optionType' }) }) }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="path"
          label={intl.formatMessage({ id: 'permissionModal.form.path' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'permissionModal.form.validation.required' }, { field: intl.formatMessage({ id: 'permissionModal.form.path' }) }) }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="component"
          label={intl.formatMessage({ id: 'permissionModal.form.component' })}
          rules={[{ message: intl.formatMessage({ id: 'permissionModal.form.validation.required' }, { field: intl.formatMessage({ id: 'permissionModal.form.component' }) }) }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label={intl.formatMessage({ id: 'permissionModal.form.description' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'permissionModal.form.validation.required' }, { field: intl.formatMessage({ id: 'permissionModal.form.description' }) }) }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="parentId"
          label={intl.formatMessage({ id: 'permissionModal.form.parentId' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'permissionModal.form.validation.required' }, { field: intl.formatMessage({ id: 'permissionModal.form.parentId' }) }) }]}

        >
          <Input />
        </Form.Item>
        <Form.Item
          name="sort"
          label={intl.formatMessage({ id: 'permissionModal.form.sort' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'permissionModal.form.validation.required' }, { field: intl.formatMessage({ id: 'permissionModal.form.sort' }) }) }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="icon"
          label={intl.formatMessage({ id: 'permissionModal.form.icon' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'permissionModal.form.validation.required' }, { field: intl.formatMessage({ id: 'permissionModal.form.icon' }) }) }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PermissionModal;