import React, { useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";

interface ServerAdminProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;
}

const ServerAdmin: React.FC<ServerAdminProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initialValues || {});
  }, [initialValues, visible]);

  // **提交表单**
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      message.error("请检查输入内容！");
    }
  };

  return (
    <Modal title="服务器管理" open={visible} onCancel={onCancel} onOk={handleOk} width={600}>
      <Form form={form} layout="vertical">
        {/* IP 配置 */}
        {/* <Form.Item name="ipWhitelist" label="服务器 IP 白名单" extra="最大不超过 10 个，多个 IP 用 ',' 隔开">
          <Input.TextArea placeholder="请输入 IP 地址" rows={2} />
        </Form.Item> */}

        {/* 域名配置 */}
        <Form.Item name="tenantHost" label="域名" rules={[{ required: true, message: "请输入域名" }]}>
          <Input placeholder="请输入域名" />
        </Form.Item>

        {/* <Form.Item name="subDomain" label="子域名">
          <Input placeholder="请输入子域名" />
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default ServerAdmin;