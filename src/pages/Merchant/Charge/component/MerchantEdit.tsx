import React, { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, message, Card,  Select } from "antd";
import dayjs from "dayjs";
import { tenantParams, updateTenantById } from "@/services/ant-design-pro/merchant";
import { getAreaCodeList } from "@/services/ant-design-pro/merchant";

const { Option } = Select;
interface MerchantEditProps {
  tenantId: string | null;
  onBack: () => void; // 增加返回按钮
}

const MerchantEdit: React.FC<MerchantEditProps> = ({ tenantId, onBack }) => {
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
          message.error("获取商户详情失败");
        }
      } catch (error) {
        message.error("请求出错，请稍后重试");
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
      message.error("无效的商户ID");
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
        message.success("更新商户信息成功");
        onBack(); // 返回上一页
      } else {
        message.error("更新商户信息失败");
      }
    } catch (error) {
      message.error("请求出错，请稍后重试");
    }
  };

  return (
    <Card title="编辑商户信息" extra={<Button onClick={onBack}>返回</Button>}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="交易所名称" name="tenantName" rules={[{ required: true, message: "请输入交易所名称" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="商户ID" name="tenantId">
          <Input disabled />
        </Form.Item>

        <Form.Item label="联系人" name="tenantContact" rules={[{ required: true, message: "请输入联系人姓名" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="联系人" name="tenantContact" rules={[{ required: true, message: "请输入联系人姓名" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="国家编码" name="areaCode">
        <Select>
          {areaList.map((item: any) => (  
            <Option key={item.areaCode} value={item.areaCode}>+{item.areaCode} {item.areaName}</Option>
          ))}
        </Select>
      </Form.Item>

        <Form.Item label="邮箱" name="tenantEmail" rules={[{ required: true, type: "email", message: "请输入有效的邮箱地址" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="服务开始" name="tenantStartTime">
          <DatePicker showTime style={{ width: "100%" }} disabled />
        </Form.Item>

        <Form.Item label="服务到期" name="tenantEndTime">
          <DatePicker showTime style={{ width: "100%" }} disabled/>
        </Form.Item>

        {/* ✅ 按钮居中对齐 */}
        <Form.Item style={{ textAlign: "center" }}>
          <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
            提交
          </Button>
          <Button onClick={onBack}>取消</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default MerchantEdit;