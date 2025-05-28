import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message, Tree, Select } from 'antd';
import { useIntl } from 'umi';

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
  const intl = useIntl();
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
        message.error(intl.formatMessage({ id: 'roleModal.validation.fillRequired' }));
      });
  };

 

  return (
    <Modal
      visible={visible}
      title={initialValues ? 
        intl.formatMessage({ id: 'roleModal.title.edit' }) : 
        intl.formatMessage({ id: 'roleModal.title.create' })
      }
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
          label={intl.formatMessage({ id: 'roleModal.form.roleName' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'roleModal.form.roleName.required' }) }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="describe"
          label={intl.formatMessage({ id: 'roleModal.form.description' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'roleModal.form.description.required' }) }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="status"
          label={intl.formatMessage({ id: 'roleModal.form.status' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'roleModal.form.status.required' }) }]}
        >
          <Select placeholder={intl.formatMessage({ id: 'roleModal.form.status.placeholder' })}>
            <Select.Option value={1}>{intl.formatMessage({ id: 'roleModal.form.status.enabled' })}</Select.Option>
            <Select.Option value={0}>{intl.formatMessage({ id: 'roleModal.form.status.disabled' })}</Select.Option>
          </Select>
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default RoleModal;