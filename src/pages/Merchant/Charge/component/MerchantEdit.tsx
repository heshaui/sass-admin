import React from "react";
import { Form, Input, Button, Select, DatePicker } from "antd";

const { Option } = Select;

const MerchantEdit: React.FC = () => {
  const [form] = Form.useForm();

  // 表单提交处理
  const onFinish = (values: any) => {
    console.log("Form Submitted:", values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        exchangeName: "马克的公司",
        merchantId: "123",
        contact: "马克",
        countryCode: "+86 中国",
        phone: "123123",
        email: "123@qq.com",
        serviceStart: "2027-12-12 12:12:12",
        serviceEnd: "2027-12-12 12:12:12",
      }}
    >
      <Form.Item label="交易所名称" name="exchangeName" rules={[{ required: true, message: "请输入交易所名称" }]}>
        <Input />
      </Form.Item>

      <Form.Item label="商户ID" name="merchantId">
        <Input disabled />
      </Form.Item>

      <Form.Item label="联系人" name="contact" rules={[{ required: true, message: "请输入联系人姓名" }]}>
        <Input />
      </Form.Item>

      <Form.Item label="国家编码" name="countryCode" rules={[{ required: true, message: "请选择国家编码" }]}>
        <Select>
          <Option value="+86 中国">+86 中国</Option>
          <Option value="+1 美国">+1 美国</Option>
          <Option value="+44 英国">+44 英国</Option>
        </Select>
      </Form.Item>

      <Form.Item label="手机号" name="phone" rules={[{ required: true, message: "请输入手机号" }]}>
        <Input />
      </Form.Item>

      <Form.Item label="邮箱" name="email" rules={[{ required: true, type: "email", message: "请输入有效的邮箱地址" }]}>
        <Input />
      </Form.Item>

      <Form.Item label="服务开始" name="serviceStart">
        <DatePicker showTime disabled style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="服务到期" name="serviceEnd">
        <DatePicker showTime disabled style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
          提交
        </Button>
        <Button htmlType="button">取消</Button>
      </Form.Item>
    </Form>
  );
};

export default MerchantEdit;