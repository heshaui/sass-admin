import { Button, Form, Input, InputNumber, Modal } from 'antd';
import React from 'react';
import { useIntl } from 'umi';

interface TradingFee {
  id: string;
  pairName: string;
  buyFee: number;
  sellFee: number;
  coinSymbol: string;
  baseSymbol: string;
}

interface EditFormProps {
  visible: boolean;
  record: TradingFee | null;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const EditForm: React.FC<EditFormProps> = ({ visible, record, onCancel, onSubmit }) => {
  const intl = useIntl();
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (record && visible) {
      form.setFieldsValue({
        pairName: record.coinSymbol + '/' + record.baseSymbol,
        buyFee: record.buyFee, // 转换为百分比显示
        sellFee: record.sellFee,
      });
    }
  }, [record, visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error(intl.formatMessage({ id: 'tradingFees.form.error' }), error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'tradingFees.form.title' })}
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item name="pairName" label={intl.formatMessage({ id: 'tradingFees.form.tradingPair' })}>
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="buyFee"
          label={intl.formatMessage({ id: 'tradingFees.form.makerFee' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'tradingFees.form.makerFee.required' }) }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} max={1} addonAfter="%" />
        </Form.Item>

        <Form.Item
          name="sellFee"
          label={intl.formatMessage({ id: 'tradingFees.form.takerFee' })}
          rules={[{ required: true, message: intl.formatMessage({ id: 'tradingFees.form.takerFee.required' }) }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} max={1} addonAfter="%" />
        </Form.Item>

        <div style={{ color: 'red', marginBottom: '16px' }}>{intl.formatMessage({ id: 'tradingFees.form.tip' })}</div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleCancel} style={{ marginRight: '8px' }}>
            {intl.formatMessage({ id: 'tradingFees.form.cancel' })}
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            {intl.formatMessage({ id: 'tradingFees.form.submit' })}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditForm;
