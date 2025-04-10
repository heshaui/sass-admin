import React from 'react';
import { Form, Input, Select, InputNumber, Button, Modal } from 'antd';

interface TradingFee {
  id: string;
  pairName: string;
  makerFee: number;
  takerFee: number;
}

interface EditFormProps {
  visible: boolean;
  record: TradingFee | null;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const EditForm: React.FC<EditFormProps> = ({ visible, record, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  
  React.useEffect(() => {
    if (record && visible) {
      form.setFieldsValue({
        pairName: record.pairName,
        makerFee: record.makerFee * 100, // 转换为百分比显示
        takerFee: record.takerFee * 100,
      });
    }
  }, [record, visible, form]);
  
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('提交表单时出错:', error);
    }
  };
  
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="编辑交易手续费"
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="pairName"
          label="市对"
        >
          <Select disabled>
            <Select.Option value="BTC/USDT">BTC/USDT</Select.Option>
            <Select.Option value="ETH/USDT">ETH/USDT</Select.Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="takerFee"
          label="Taker手续费"
          rules={[
            { required: true, message: '请输入Taker手续费' },
            { type: 'number', min: 0, max: 1, message: '手续费必须在0-1%之间' }
          ]}
        >
          <InputNumber 
            style={{ width: '100%' }} 
            precision={2} 
            min={0} 
            max={1} 
            addonAfter="%" 
          />
        </Form.Item>
        
        <Form.Item
          name="makerFee"
          label="Maker手续费"
          rules={[
            { required: true, message: '请输入Maker手续费' },
            { type: 'number', min: 0, max: 1, message: '手续费必须在0-1%之间' }
          ]}
        >
          <InputNumber 
            style={{ width: '100%' }} 
            precision={2} 
            min={0} 
            max={1} 
            addonAfter="%" 
          />
        </Form.Item>
        
        <div style={{ color: 'red', marginBottom: '16px' }}>
          Tip: 手续费范围0~1%
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleCancel} style={{ marginRight: '8px' }}>
            取消
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            提交
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditForm; 