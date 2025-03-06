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

  // 监听 record 和 isCreating 变化，重置表单
  React.useEffect(() => {
    if (isCreating) {
      form.setFieldsValue({
        tenantName: "",
        tenantContact: "",
        tenantPhone: "",
        tenantEmail: "",
      });
    } else {
      form.resetFields();
    }
  }, [form, record, isCreating]);

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
      initialValues={
        isCreating 
          ? {
              tenantName: "",
              tenantContact: "",
              tenantPhone: "",
              tenantEmail: "",
            }
          : {
              tenantId: record?.tenantId || "",
              tenantName: record?.tenantName || "",
              tenantContact: record?.tenantContact || "",
              tenantPhone: record?.tenantPhone || "",
              tenantEmail: record?.tenantEmail || "",
            }
      }
    >
      {!isCreating && (
        <Form.Item label="商户ID" name="tenantId">
          <Input disabled style={{ background: "#f5f5f5" }} />
        </Form.Item>
      )}

      <Form.Item label="交易所名称" name="tenantName" rules={[{ required: true, message: "请输入交易所名称" }]}>
        <Input />
      </Form.Item>

      {/* <Form.Item label="商户ID" name="merchantId">
        <Input disabled={!isCreating} style={{ background: "#f5f5f5" }} />
      </Form.Item> */}

      <Form.Item label="联系人" name="tenantContact" rules={[{ required: true, message: "请输入联系人姓名" }]}>
        <Input />
      </Form.Item>

      {/* <Form.Item label="国家编码" name="tenantContact">
        <Select>
          <Option value="+86 中国">+86 中国</Option>
          <Option value="+1 美国">+1 美国</Option>
        </Select>
      </Form.Item> */}

      <Form.Item label="手机号" name="tenantPhone">
        <Input />
      </Form.Item>

      <Form.Item label="邮箱" name="tenantEmail" rules={[{ required: true, type: "email", message: "请输入有效的邮箱地址" }]}>
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