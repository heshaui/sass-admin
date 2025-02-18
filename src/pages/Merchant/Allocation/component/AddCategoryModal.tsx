import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Tree, Button } from "antd";

interface AddCategoryModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  editingRecord?: any; // 传入正在编辑的记录
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ visible, onCancel, onSubmit, editingRecord }) => {
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
      title={editingRecord ? "修改分类" : "添加分类"}
      open={visible}
      onCancel={onCancel}
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          提交
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="分类名称"
          name="roleName"
          rules={[{ required: true, message: "请输入分类名称" }]}
        >
          <Input maxLength={20} placeholder="20字符" />
        </Form.Item>
        <Form.Item
          label="分类描述"
          name="describe"
          rules={[{ required: true, message: "请输入分类描述" }]}
        >
          <Input maxLength={20} placeholder="20字符" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCategoryModal;