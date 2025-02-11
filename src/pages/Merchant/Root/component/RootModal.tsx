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
    <Modal title={initialValues ? "编辑商户" : "新增商户"} open={visible} onCancel={onCancel} onOk={handleOk} width={600}>
      <Form form={form} layout="vertical">
        <Form.Item name="nickname" label="nickname" rules={[{ required: true, message: "请输入交易所名称" }]}>
          <Input placeholder="请输入交易所名称" />
        </Form.Item>
        <Form.Item name="contact" label="联系人" rules={[{ required: true, message: "请输入联系人" }]}>
          <Input placeholder="请输入联系人" />
        </Form.Item>
        <Form.Item name="email" label="邮箱" rules={[{ required: true, message: "请输入邮箱" }]}>
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item name="phone" label="手机号">
          <Input placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item name="status" label="交易所状态" rules={[{ required: true, message: "请选择状态" }]}>
          <Select>
            <Select.Option value="1">服务中</Select.Option>
            <Select.Option value="0">已欠费</Select.Option>
          </Select>
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