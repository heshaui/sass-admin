import React, { useEffect } from "react";
import { Modal, Form, DatePicker, Button, message } from "antd";
import dayjs from "dayjs";

interface ConvertToPaidProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;
}

const ConvertToPaid: React.FC<ConvertToPaidProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        tenantEndTime: initialValues.tenantEndTime ? dayjs(initialValues.tenantEndTime) : null,
      });
    }
  }, [initialValues, visible]);

  // **提交表单**
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({ ...initialValues, tenantEndTime: values.tenantEndTime.format("YYYY-MM-DD HH:mm:ss") });
      form.resetFields();
    } catch (error) {
      message.error("请选择服务到期时间！");
    }
  };

  return (
    <Modal title="转为正式商户" open={visible} onCancel={onCancel} onOk={handleOk} width={500}>
      <Form form={form} layout="vertical">
        <Form.Item
          name="tenantEndTime"
          label={<span style={{ fontWeight: "bold", fontSize: 16 }}>服务到期</span>}
          rules={[{ required: true, message: "请选择服务到期时间！" }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" placeholder="请选择到期时间" style={{ width: "100%" }} />
        </Form.Item>
        <p>
          确定转移至付费商户后，服务开始计算，服务有效期至{" "}
          <strong>{initialValues?.tenantEndTime?dayjs(initialValues.tenantEndTime).format("YYYY-MM-DD HH:mm:ss"):'-'}</strong>！
         
        </p>
      </Form>
    </Modal>
  );
};

export default ConvertToPaid;