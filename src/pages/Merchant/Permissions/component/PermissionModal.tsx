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
      title={initialValues ? 
        intl.formatMessage({ id: 'permissions.modal.editTitle' }) : 
        intl.formatMessage({ id: 'permissions.modal.createTitle' })}
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
          label={intl.formatMessage({ id: 'permissions.form.chineseTitle' })}
          rules={[{ 
            required: true, 
            message: intl.formatMessage({ id: 'permissions.form.chineseTitle.required' }) 
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="titleKey"
          label={intl.formatMessage({ id: 'permissions.form.i18nKey' })}
          rules={[{ 
            required: true, 
            message: intl.formatMessage({ id: 'permissions.form.i18nKey.required' }) 
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          label={intl.formatMessage({ id: 'permissions.form.name' })}
          rules={[{ 
            required: true, 
            message: intl.formatMessage({ id: 'permissions.form.name.required' }) 
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label={intl.formatMessage({ id: 'permissions.form.menuPermission' })}
          rules={[{ 
            required: true, 
            message: intl.formatMessage({ id: 'permissions.form.name.required' }) 
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="optionType"
          label={intl.formatMessage({ id: 'permissions.form.operationPermission' })}
          rules={[{ 
            required: true, 
            message: intl.formatMessage({ id: 'permissions.form.name.required' }) 
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="path"
          label={intl.formatMessage({ id: 'permissions.form.pagePath' })}
          rules={[{ 
            required: true, 
            message: intl.formatMessage({ id: 'permissions.form.pagePath.required' }) 
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="component"
          label={intl.formatMessage({ id: 'permissions.form.frontendPath' })}
          rules={[{ 
            message: intl.formatMessage({ id: 'permissions.form.frontendPath.required' }) 
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label={intl.formatMessage({ id: 'permissions.form.description' })}
          rules={[{ 
            required: true,
            message: intl.formatMessage({ id: 'permissions.form.description.required' }) 
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="parentId"
          label={intl.formatMessage({ id: 'permissions.form.parentId' })}
          rules={[{ 
            required: true, 
            message: intl.formatMessage({ id: 'permissions.form.parentId.required' }) 
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="sort"
          label={intl.formatMessage({ id: 'permissions.form.sort' })}
          rules={[{ 
            required: true, 
            message: intl.formatMessage({ id: 'permissions.form.sort.required' }) 
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="icon"
          label={intl.formatMessage({ id: 'permissions.form.icon' })}
          rules={[{ 
            required: true, 
            message: intl.formatMessage({ id: 'permissions.form.icon.required' }) 
          }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PermissionModal;