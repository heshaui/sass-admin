import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Typography } from "antd";
import { useIntl } from 'umi';
import { getAreaCodeList } from "@/services/ant-design-pro/merchant";
const { Option } = Select;

const MerchantEdit: React.FC<{ record?: any; isCreating?: boolean; onSubmit: (values: any) => void; onCancel: () => void }> = ({
  record,
  isCreating,
  onSubmit,
  onCancel,
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [areaList, setAreaList] = useState([]);

  const getAreaList = async () => {
    const res = await getAreaCodeList();
    console.log(res);
    if (res.code === '0') {
      setAreaList(res.data);
    }
  }
  // 监听 record 和 isCreating 变化，重置表单
  useEffect(() => {
    getAreaList();
    if (isCreating) {
      form.setFieldsValue({
        tenantName: "",
        tenantContact: "",
        tenantPhone: "",
        tenantEmail: "",
        areaCode: "",
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
              areaCode: "",
            }
          : {
              tenantId: record?.tenantId || "",
              tenantName: record?.tenantName || "",
              tenantContact: record?.tenantContact || "",
              tenantPhone: record?.tenantPhone || "",
              tenantEmail: record?.tenantEmail || "",
              areaCode: record?.areaCode || "",
            }
      }
    >
      {!isCreating && (
        <Form.Item 
          label={intl.formatMessage({ id: 'free.merchantEdit.form.merchantId' })} 
          name="tenantId"
        >
          <Input disabled style={{ background: "#f5f5f5" }} />
        </Form.Item>
      )}

      <Form.Item 
        label={intl.formatMessage({ id: 'free.merchantEdit.form.exchangeName' })} 
        name="tenantName" 
        rules={[{ 
          required: true, 
          message: intl.formatMessage({ id: 'free.merchantEdit.form.exchangeName.required' }) 
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item 
        label={intl.formatMessage({ id: 'free.merchantEdit.form.contact' })} 
        name="tenantContact" 
        rules={[{ 
          required: true, 
          message: intl.formatMessage({ id: 'free.merchantEdit.form.contact.required' }) 
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item 
        label={intl.formatMessage({ id: 'free.merchantEdit.form.countryCode' })} 
        name="areaCode"
      >
        <Select>
          {areaList.map((item: any) => (  
            <Option key={item.areaCode} value={item.areaCode}>
              +{item.areaCode} {item.areaName}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item 
        label={intl.formatMessage({ id: 'free.merchantEdit.form.phone' })} 
        name="tenantPhone"
      >
        <Input />
      </Form.Item>

      <Form.Item 
        label={intl.formatMessage({ id: 'free.merchantEdit.form.email' })} 
        name="tenantEmail" 
        rules={[{ 
          required: true, 
          type: "email", 
          message: intl.formatMessage({ id: 'free.merchantEdit.form.email.required' }) 
        }]}
      >
        <Input />
      </Form.Item>

      <Form.Item style={{ textAlign: "center" }}>
        <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
          {isCreating 
            ? intl.formatMessage({ id: 'free.merchantEdit.button.create' })
            : intl.formatMessage({ id: 'free.merchantEdit.button.submit' })}
        </Button>
        <Button onClick={onCancel}>
          {intl.formatMessage({ id: 'free.merchantEdit.button.cancel' })}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MerchantEdit;