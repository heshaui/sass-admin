import React, { useEffect, useState } from "react";
import { Modal, Form, DatePicker, Button, message } from "antd";
import { useIntl } from 'umi';
import dayjs from "dayjs";

interface ConvertToPaidProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;
}

const ConvertToPaid: React.FC<ConvertToPaidProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [selectedTime, setSelectedTime] = useState<string>("");
 
  useEffect(() => {
    if (initialValues) {
      const endTime = initialValues.tenantEndTime ? dayjs(initialValues.tenantEndTime) : null;
      form.setFieldsValue({
        tenantEndTime: endTime,
      });
      
      if (endTime) {
        setSelectedTime(endTime.format("YYYY-MM-DD HH:mm:ss"));
      } else {
        setSelectedTime("");
      }
    }
  }, [initialValues, visible]);

  // **提交表单**
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      // 检查所选日期是否在当前时间的10天内
      // const selectedDate = values.tenantEndTime;
      // const tenDaysLater = dayjs().add(10, 'day');
      
      // if (selectedDate.isAfter(tenDaysLater)) {
      //   message.error(intl.formatMessage({ id: 'convertToPaid.validation.maxDays' }));
      //   return;
      // }
      
      onSubmit({ ...initialValues, tenantEndTime: values.tenantEndTime.format("YYYY-MM-DD HH:mm:ss") });
      form.resetFields();
    } catch (error) {
      message.error(intl.formatMessage({ id: 'convertToPaid.form.required' }));
    }
  };

  return (
    <Modal 
      title={intl.formatMessage({ id: 'convertToPaid.title' })} 
      open={visible} 
      onCancel={onCancel} 
      onOk={handleOk} 
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="tenantEndTime"
          label={
            <span style={{ fontWeight: "bold", fontSize: 16 }}>
              {intl.formatMessage({ id: 'convertToPaid.form.duration' })}
            </span>
          }
          rules={[{ 
            required: true, 
            message: intl.formatMessage({ id: 'convertToPaid.form.required' }) 
          }]}
        >
          <DatePicker 
            showTime 
            format="YYYY-MM-DD HH:mm:ss" 
            placeholder={intl.formatMessage({ id: 'convertToPaid.form.placeholder' })} 
            style={{ width: "100%" }} 
            disabledDate={(current) => {
              // Can't select days before today
              return current && current < dayjs().startOf('day');
            }}
            onChange={(date) => {
              if (date) {
                setSelectedTime(date.format("YYYY-MM-DD HH:mm:ss"));
              } else {
                setSelectedTime("");
              }
            }}
          />
        </Form.Item>
        <p style={{ color: "#999", marginBottom: 0 }}>
          {intl.formatMessage({ id: 'convertToPaid.note.title' })}
        </p>
        <p style={{ color: "#999", margin: 0 }}>
          {intl.formatMessage({ id: 'convertToPaid.note.time' })}{selectedTime || initialValues.tenantEndTime || ""}
        </p>
      </Form>
    </Modal>
  );
};

export default ConvertToPaid;