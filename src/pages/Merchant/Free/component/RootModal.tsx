import React, { useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";

interface MerchantFormProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: any) => void;
  initialValues?: any;
}

const RootModal: React.FC<MerchantFormProps> = ({ visible, onCancel, onSave, initialValues }) => {
  const [form] = Form.useForm();

  // **当 `initialValues` 变化时，重置表单数据**
  useEffect(() => {
    form.setFieldsValue(initialValues || {});
  }, [initialValues, visible]);

  // **提交表单**
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
      form.resetFields();
    } catch (error) {
      message.error("请检查表单输入！");
    }
  };

  return (
    <Modal title='创建root账号' open={visible} onCancel={onCancel} onOk={handleOk} width={600}>
      <Form form={form} layout="vertical">
        <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: "请输入昵称" }]}>
          <Input placeholder="请输入交易所名称" />
        </Form.Item>
        <Form.Item name="role" label="角色" rules={[{ required: true, message: "请输入角色" }]}>
          <Input placeholder="请输入角色" />
        </Form.Item>
       
        <Form.Item name="email" label="邮箱" rules={[{ required: true, message: "请输入邮箱" }]}>
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item name="phone" label="手机号" rules={[{ required: true, message: "请输入邮箱" }]}>
          <Input placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <Input placeholder="请输入联系人" />
        </Form.Item>
        {/* <Form.Item name="accountStatus" label="商户状态" rules={[{ required: true, message: "请选择状态" }]}>
          <Select>
            <Select.Option value="正常">正常</Select.Option>
            <Select.Option value="冻结">冻结</Select.Option>
          </Select>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default RootModal;