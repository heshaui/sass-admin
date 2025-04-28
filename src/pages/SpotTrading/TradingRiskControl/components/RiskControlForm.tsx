import React, { useEffect,useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Button, Row, Col } from 'antd';
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
  const [priceDeviationPercent, setPriceDeviationPercent] = useState<number>(0);
  const [priceDeviationMinutes, setPriceDeviationMinutes] = useState<number>(0);
  const [priceFluctuationPercent, setPriceFluctuationPercent] = useState<number>(0);
  const [priceFluctuationMinutes, setPriceFluctuationMinutes] = useState<number>(0);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {

        console.log(initialValues, 'initialValues');
        // 处理初始值格式转换
        const formattedValues = { ...initialValues };
        if(initialValues.transactionPriceDeviation){
          let data=JSON.parse(initialValues.transactionPriceDeviation);
          formattedValues.priceDeviationPercent=data.percentage;
          formattedValues.priceDeviationMinutes=data.time;
          setPriceDeviationPercent(data.percentage);
          setPriceDeviationMinutes(data.time);
        }
        if(initialValues.priceFluctuation){
          let data=JSON.parse(initialValues.priceFluctuation);
          formattedValues.priceFluctuationPercent=data.percentage;
          formattedValues.priceFluctuationMinutes=data.time;
          setPriceFluctuationPercent(data.percentage);
          setPriceFluctuationMinutes(data.time);
        }
        if(initialValues.coinSymbol&&initialValues.baseSymbol){
          formattedValues.symbol=initialValues.coinSymbol+'/'+initialValues.baseSymbol;
        }
        if(initialValues.alarmNotifyEmail){
          formattedValues.alarmNotifyEmail=initialValues.alarmNotifyEmail;
        }
        form.setFieldsValue(formattedValues);
      }
    }
  }, [visible, initialValues, form]);

  const handleValuesChange = (changedValues: any, allValues: any) => {
    setPriceDeviationPercent(allValues.priceDeviationPercent || 0);
    setPriceDeviationMinutes(allValues.priceDeviationMinutes || 0);
    setPriceFluctuationPercent(allValues.priceFluctuationPercent || 0);
    setPriceFluctuationMinutes(allValues.priceFluctuationMinutes || 0);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // 格式化为后端需要的格式
      const formattedValues = {
        ...values,
      };
      onSubmit(formattedValues);
    } catch (error) {
      // 表单验证失败
    }
  };

  return (
    <Modal
      title={'修改风控规则' }
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
        }}
        onValuesChange={handleValuesChange}
      >
        <Form.Item
          name="symbol"
          label="币对"
          rules={[{ required: true, message: '请选择币对' }]}
        >
         <Input placeholder="请输入币对" value={initialValues?.symbol} disabled={true} />
        </Form.Item>
        
        <Form.Item
          label={<span style={{ color: '#ff4d4f' }}>交易价格偏离</span>}
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
            任意一笔交易与前一笔交易价格偏离&gt;{priceDeviationPercent}%时报警，报警后{priceDeviationMinutes}分钟内不在发送
          </div>
        </Form.Item>
        
        <Form.Item
          label={<span style={{ color: '#ff4d4f' }}>近30分钟内价格波动</span>}
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
            币对近半小时内价格波动&gt;{priceFluctuationPercent}%时报警，报警后{priceFluctuationMinutes}分钟内不在发送
          </div>
        </Form.Item>
        
        <Form.Item
          name="alarmNotifyEmail"
          label={<span style={{ color: '#ff4d4f' }}> 报警通知</span>}
          rules={[
            { required: true, message: '请输入报警通知邮箱' },
          ]}
        >
          <Input placeholder="邮箱账号，以英文逗号隔开" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RiskControlForm; 