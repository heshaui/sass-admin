import React, { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, message, Card, Select } from "antd";
import { useIntl } from 'umi';
import dayjs from "dayjs";
import { tenantParams, updateTenantById } from "@/services/ant-design-pro/merchant";
import { getAreaCodeList } from "@/services/ant-design-pro/merchant";

const { Option } = Select;
interface MerchantEditProps {
  tenantId: string | null;
  onBack: () => void; // 增加返回按钮
}

const MerchantEdit: React.FC<MerchantEditProps> = ({ tenantId, onBack }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [areaList, setAreaList] = useState([]);
    const getAreaList = async () => {
      const res = await getAreaCodeList();
      console.log(res);
      if (res.code === '0') {
        setAreaList(res.data);
      }
    }
  useEffect(() => {
    getAreaList();
    const fetchMerchant = async () => {
      if (!tenantId) return;
      setLoading(true);
      try {
        const res = await tenantParams(tenantId);
        if (res.code === "0") {
          const merchantData = res.data || {};

          // **填充表单数据**
          form.setFieldsValue({
            tenantName: merchantData.tenantName,
            tenantId: merchantData.tenantId,
            tenantContact: merchantData.tenantContact,
            tenantPhone: merchantData.tenantPhone,
            tenantEmail: merchantData.tenantEmail,
            areaCode:merchantData.areaCode,
            // **时间格式转换** - 从时间戳转换成 dayjs
            tenantStartTime: merchantData.tenantStartTime ? dayjs(merchantData.tenantStartTime) : null,
            tenantEndTime: merchantData.tenantEndTime ? dayjs(merchantData.tenantEndTime) : null,
          });
        } else {
          message.error(intl.formatMessage({ id: 'merchantEdit.message.fetchFailed' }));
        }
      } catch (error) {
        message.error(intl.formatMessage({ id: 'merchantEdit.message.requestError' }));
      }
      setLoading(false);
    };

    fetchMerchant();
  }, [tenantId]);

  // **表单提交处理**
  const onFinish = async (values: any) => {
    console.log("原始表单数据:", values);

    // **确保 tenantId 存在**
    if (!tenantId) {
      message.error(intl.formatMessage({ id: 'merchantEdit.message.invalidMerchantId' }));
      return;
    }

    // **转换时间戳**
    const formattedData = {
      ...values,
      tenantId,
      tenantStartTime: values.tenantStartTime ? values.tenantStartTime.valueOf() : null, // 转换为时间戳
      tenantEndTime: values.tenantEndTime ? values.tenantEndTime.valueOf() : null, // 转换为时间戳
    };

    console.log("提交到后端的数据:", formattedData);

    try {
      const res = await updateTenantById(formattedData);
      if (res.code === "0") {
        message.success(intl.formatMessage({ id: 'merchantEdit.message.updateSuccess' }));
        onBack(); // 返回上一页
      } else {
        message.error(intl.formatMessage({ id: 'merchantEdit.message.updateFailed' }));
      }
    } catch (error) {
      message.error("请求出错，请稍后重试");
    }
  };

  return (
    <Card 
      title={intl.formatMessage({ id: 'merchantEdit.title' })} 
      extra={
        <Button onClick={onBack}>
          {intl.formatMessage({ id: 'merchantEdit.button.back' })}
        </Button>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item 
          label={intl.formatMessage({ id: 'merchantEdit.form.exchangeName' })}
          name="tenantName" 
          rules={[{ 
            required: true, 
            message: intl.formatMessage({ id: 'merchantEdit.form.exchangeName.required' }) 
          }]}
        >
          <Input />
        </Form.Item>

        <Form.Item 
          label={intl.formatMessage({ id: 'merchantEdit.form.merchantId' })} 
          name="tenantId"
        >
          <Input disabled />
        </Form.Item>

        <Form.Item 
          label={intl.formatMessage({ id: 'merchantEdit.form.contact' })} 
          name="tenantContact" 
          rules={[{ 
            required: true, 
            message: intl.formatMessage({ id: 'merchantEdit.form.contact.required' }) 
          }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item 
          label={intl.formatMessage({ id: 'merchantEdit.form.countryCode' })} 
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
          label={intl.formatMessage({ id: 'merchantEdit.form.email' })}
          name="tenantEmail" 
          rules={[{ 
            required: true, 
            type: "email", 
            message: intl.formatMessage({ id: 'merchantEdit.form.email.required' }) 
          }]}
        >
          <Input />
        </Form.Item>

        <Form.Item 
          label={intl.formatMessage({ id: 'merchantEdit.form.serviceStart' })} 
          name="tenantStartTime"
        >
          <DatePicker showTime style={{ width: "100%" }} disabled />
        </Form.Item>

        <Form.Item 
          label={intl.formatMessage({ id: 'merchantEdit.form.serviceEnd' })} 
          name="tenantEndTime"
        >
          <DatePicker showTime style={{ width: "100%" }} disabled/>
        </Form.Item>

        <Form.Item style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
            {intl.formatMessage({ id: 'merchantEdit.button.submit' })}
          </Button>
          <Button onClick={onBack}>
            {intl.formatMessage({ id: 'merchantEdit.button.cancel' })}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default MerchantEdit;