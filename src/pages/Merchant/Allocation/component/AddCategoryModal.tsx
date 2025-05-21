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
  const intl = useIntl();
  const [form] = Form.useForm();


 

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
      title={intl.formatMessage({ 
        id: editingRecord ? 'addCategory.modal.editTitle' : 'addCategory.modal.addTitle' 
      })}
      open={visible}
      onCancel={onCancel}
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {intl.formatMessage({ id: 'addCategory.button.cancel' })}
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          {intl.formatMessage({ id: 'addCategory.button.submit' })}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={intl.formatMessage({ id: 'addCategory.form.categoryName.label' })}
          name="roleName"
          rules={[{ 
            required: true, 
            message: intl.formatMessage({ id: 'addCategory.form.categoryName.required' }) 
          }]}
        >
          <Input 
            maxLength={20} 
            placeholder={intl.formatMessage({ id: 'addCategory.form.categoryName.placeholder' })} 
          />
        </Form.Item>
        <Form.Item
          label={intl.formatMessage({ id: 'addCategory.form.categoryDescription.label' })}
          name="describe"
          rules={[{ 
            required: true, 
            message: intl.formatMessage({ id: 'addCategory.form.categoryDescription.required' }) 
          }]}
        >
          <Input 
            maxLength={20} 
            placeholder={intl.formatMessage({ id: 'addCategory.form.categoryDescription.placeholder' })} 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCategoryModal;