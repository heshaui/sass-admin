import React, { useEffect,useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Button, Row, Col } from 'antd';
import { useIntl } from '@umijs/max';
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
  const intl = useIntl();
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
        // Process initial value format conversion
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
      // Format values for backend requirements
      const formattedValues = {
        ...values,
      };
      onSubmit(formattedValues);
    } catch (error) {
      // Form validation failed
    }
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'tradingRiskControl.form.title' })}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      maskClosable={false}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {intl.formatMessage({ id: 'tradingRiskControl.form.cancel' })}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          {intl.formatMessage({ id: 'tradingRiskControl.form.submit' })}
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
          label={intl.formatMessage({ id: 'tradingRiskControl.form.tradingPair' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'tradingRiskControl.form.tradingPairPlaceholder' }) }]}
        >
         <Input placeholder={intl.formatMessage({ id: 'tradingRiskControl.form.tradingPairPlaceholder' })} value={initialValues?.symbol} disabled={true} />
        </Form.Item>
        
        <Form.Item
          label={<span style={{ color: '#ff4d4f' }}>{intl.formatMessage({ id: 'tradingRiskControl.form.priceDeviation' })}</span>}
          required
        >
          <Row gutter={8} align="middle">
            <Col span={6}>
              <Form.Item
                name="priceDeviationPercent"
                noStyle
                rules={[{ required: true, message: intl.formatMessage({ id: 'tradingRiskControl.form.enterValue' }) }]}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={2} style={{ textAlign: 'center' }}>
              <span>{intl.formatMessage({ id: 'tradingRiskControl.form.percent' })}</span>
            </Col>
            <Col span={6}>
              <span>{intl.formatMessage({ id: 'tradingRiskControl.form.alarmInterval' })}</span>
            </Col>
            <Col span={6}>
              <Form.Item
                name="priceDeviationMinutes"
                noStyle
                rules={[{ required: true, message: intl.formatMessage({ id: 'tradingRiskControl.form.enterTime' }) }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={4} style={{ textAlign: 'center' }}>
              <span>{intl.formatMessage({ id: 'tradingRiskControl.form.minutes' })}</span>
            </Col>
          </Row>
          <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
            {intl.formatMessage({ id: 'tradingRiskControl.form.priceDeviationTip' }, { percent: priceDeviationPercent, minutes: priceDeviationMinutes })}
          </div>
        </Form.Item>
        
        <Form.Item
          label={<span style={{ color: '#ff4d4f' }}>{intl.formatMessage({ id: 'tradingRiskControl.form.priceFluctuation' })}</span>}
          required
        >
          <Row gutter={8} align="middle">
            <Col span={6}>
              <Form.Item
                name="priceFluctuationPercent"
                noStyle
                rules={[{ required: true, message: intl.formatMessage({ id: 'tradingRiskControl.form.enterValue' }) }]}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={2} style={{ textAlign: 'center' }}>
              <span>{intl.formatMessage({ id: 'tradingRiskControl.form.percent' })}</span>
            </Col>
            <Col span={6}>
              <span>{intl.formatMessage({ id: 'tradingRiskControl.form.alarmInterval' })}</span>
            </Col>
            <Col span={6}>
              <Form.Item
                name="priceFluctuationMinutes"
                noStyle
                rules={[{ required: true, message: intl.formatMessage({ id: 'tradingRiskControl.form.enterTime' }) }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={4} style={{ textAlign: 'center' }}>
              <span>{intl.formatMessage({ id: 'tradingRiskControl.form.minutes' })}</span>
            </Col>
          </Row>
          <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
            {intl.formatMessage({ id: 'tradingRiskControl.form.priceFluctuationTip' }, { percent: priceFluctuationPercent, minutes: priceFluctuationMinutes })}
          </div>
        </Form.Item>
        
        <Form.Item
          name="alarmNotifyEmail"
          label={<span style={{ color: '#ff4d4f' }}> {intl.formatMessage({ id: 'tradingRiskControl.form.alarmNotification' })}</span>}
          rules={[
            { required: true, message: intl.formatMessage({ id: 'tradingRiskControl.form.enterAlarmEmail' }) },
          ]}
        >
          <Input placeholder={intl.formatMessage({ id: 'tradingRiskControl.form.alarmNotificationPlaceholder' })} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RiskControlForm; 