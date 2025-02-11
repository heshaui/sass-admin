import React from "react";
import { Form, Input, Button, Select, Typography } from "antd";

const { Option } = Select;

const MerchantEdit: React.FC<{ record?: any; isCreating?: boolean; onSubmit: (values: any) => void; onCancel: () => void }> = ({
  record,
  isCreating,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();

  // 提交表单
  const onFinish = (values: any) => {
    console.log(isCreating ? "新建商户数据：" : "更新商户数据：", values);
    onSubmit(values);

  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        exchangeName: record?.exchange || "",
        merchantId: record?.id || "",
        contact: record?.contact || "",
        countryCode: "+86 中国",
        phone: "",
        email: "",
      }}
    >
      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        {isCreating ? "新增商户" : "编辑商户"}
      </Typography.Title>

      <Form.Item label="交易所名称" name="tenantName" rules={[{ required: true, message: "请输入交易所名称" }]}>
        <Input />
      </Form.Item>

      <Form.Item label="商户ID" name="merchantId">
        <Input disabled={!isCreating} style={{ background: "#f5f5f5" }} />
      </Form.Item>

      <Form.Item label="联系人" name="tenantContact" rules={[{ required: true, message: "请输入联系人姓名" }]}>
        <Input />
      </Form.Item>

      <Form.Item label="国家编码" name="tenantContact">
        <Select>
          <Option value="+86 中国">+86 中国</Option>
          <Option value="+1 美国">+1 美国</Option>
        </Select>
      </Form.Item>

      <Form.Item label="手机号" name="tenantPhone">
        <Input />
      </Form.Item>

      <Form.Item label="邮箱" name="tenantEmail">
        <Input />
      </Form.Item>

      <Form.Item style={{ textAlign: "center" }}>
        <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
          {isCreating ? "新增" : "提交"}
        </Button>
        <Button onClick={onCancel}>取消</Button>
      </Form.Item>
    </Form>
  );
};

export default MerchantEdit;