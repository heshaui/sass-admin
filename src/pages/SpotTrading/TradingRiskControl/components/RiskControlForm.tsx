import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Space, Button, Row, Col } from 'antd';

interface RiskControlFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;
  loading: boolean;
}

const RiskControlForm: React.FC<RiskControlFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  loading,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        // 处理初始值格式转换
        const formattedValues = { ...initialValues };
        if (initialValues.priceDeviation) {
          const match = initialValues.priceDeviation.match(/(\d+)%\/(\d+)min/);
          if (match) {
            formattedValues.priceDeviationPercent = parseFloat(match[1]);
            formattedValues.priceDeviationMinutes = parseFloat(match[2]);
          }
        }
        if (initialValues.priceFluctuation) {
          const match = initialValues.priceFluctuation.match(/(\d+)%\/(\d+)min/);
          if (match) {
            formattedValues.priceFluctuationPercent = parseFloat(match[1]);
            formattedValues.priceFluctuationMinutes = parseFloat(match[2]);
          }
        }
        form.setFieldsValue(formattedValues);
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // 格式化为后端需要的格式
      const formattedValues = {
        ...values,
        priceDeviation: `${values.priceDeviationPercent}%/${values.priceDeviationMinutes}min`,
        priceFluctuation: `${values.priceFluctuationPercent}%/${values.priceFluctuationMinutes}min`,
      };
      onSubmit(formattedValues);
    } catch (error) {
      // 表单验证失败
    }
  };

  return (
    <Modal
      title={initialValues ? '修改风控规则' : '添加风控规则'}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      maskClosable={false}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          提交
        </Button>,
      ]}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          priceDeviationPercent: 3,
          priceDeviationMinutes: 30,
          priceFluctuationPercent: 3,
          priceFluctuationMinutes: 30,
        }}
      >
        <Form.Item
          name="symbol"
          label="币对"
          rules={[{ required: true, message: '请选择币对' }]}
        >
          <Select
            placeholder="请选择币对"
            options={[
              { label: 'BTC/USDT', value: 'BTC/USDT' },
              { label: 'ETH/USDT', value: 'ETH/USDT' },
              { label: 'BNB/USDT', value: 'BNB/USDT' },
            ]}
          />
        </Form.Item>
        
        <Form.Item
          label={<span style={{ color: '#ff4d4f' }}>* 交易价格偏离</span>}
          required
        >
          <Row gutter={8} align="middle">
            <Col span={6}>
              <Form.Item
                name="priceDeviationPercent"
                noStyle
                rules={[{ required: true, message: '请输入数值' }]}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={2} style={{ textAlign: 'center' }}>
              <span>%</span>
            </Col>
            <Col span={6}>
              <span>报警间隔</span>
            </Col>
            <Col span={6}>
              <Form.Item
                name="priceDeviationMinutes"
                noStyle
                rules={[{ required: true, message: '请输入时间' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={4} style={{ textAlign: 'center' }}>
              <span>分钟</span>
            </Col>
          </Row>
          <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
            任意一笔交易与前一笔交易价格偏离&gt;3%时报警，报警后30分钟内不在发送
          </div>
        </Form.Item>
        
        <Form.Item
          label={<span style={{ color: '#ff4d4f' }}>* 近30分钟内价格波动</span>}
          required
        >
          <Row gutter={8} align="middle">
            <Col span={6}>
              <Form.Item
                name="priceFluctuationPercent"
                noStyle
                rules={[{ required: true, message: '请输入数值' }]}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={2} style={{ textAlign: 'center' }}>
              <span>%</span>
            </Col>
            <Col span={6}>
              <span>报警间隔</span>
            </Col>
            <Col span={6}>
              <Form.Item
                name="priceFluctuationMinutes"
                noStyle
                rules={[{ required: true, message: '请输入时间' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={4} style={{ textAlign: 'center' }}>
              <span>分钟</span>
            </Col>
          </Row>
          <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
            币对近半小时内价格波动&gt;3%时报警，报警后30分钟内不在发送
          </div>
        </Form.Item>
        
        <Form.Item
          name="notificationEmail"
          label={<span style={{ color: '#ff4d4f' }}>* 报警通知</span>}
          rules={[
            { required: true, message: '请输入报警通知邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' }
          ]}
        >
          <Input placeholder="邮箱账号，以英文逗号隔开" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RiskControlForm; 