import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Tree, Button } from "antd";
import { useIntl } from 'umi';

interface AddCategoryModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  editingRecord?: any; // 传入正在编辑的记录
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ visible, onCancel, onSubmit, editingRecord }) => {
  const [form] = Form.useForm();
  const intl = useIntl();


 

  // **表单数据回显**
  useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue(editingRecord);

    } else {
      form.resetFields();

    }
  }, [editingRecord, visible]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit({ ...values });
      form.resetFields();

    });
  };

  return (
    <Modal
      title={editingRecord ? intl.formatMessage({ id: 'merchantSystem.roleAdmin.modal.edit' }) : intl.formatMessage({ id: 'merchantSystem.roleAdmin.modal.add' })}
      open={visible}
      onCancel={onCancel}
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {intl.formatMessage({ id: 'merchantSystem.roleAdmin.button.cancel' })}
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          {intl.formatMessage({ id: 'merchantSystem.roleAdmin.button.submit' })}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={intl.formatMessage({ id: 'merchantSystem.roleAdmin.form.roleName' })}
          name="roleName"
          rules={[{ required: true, message: intl.formatMessage({ id: 'merchantSystem.roleAdmin.form.roleName.required' }) }]}
        >
          <Input maxLength={20} placeholder={intl.formatMessage({ id: 'merchantSystem.roleAdmin.form.placeholder.maxLength' })} />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'merchantSystem.roleAdmin.form.describeText' })}
          name="describeText"
          rules={[{ required: true, message: intl.formatMessage({ id: 'merchantSystem.roleAdmin.form.describeText.required' }) }]}
        >
          <Input maxLength={20} placeholder={intl.formatMessage({ id: 'merchantSystem.roleAdmin.form.placeholder.maxLength' })} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCategoryModal;