import React from 'react';
import { Form, Button, Select, Radio, Input, Space, Modal } from 'antd';

const { Option } = Select;

interface AssetAdjustmentFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const AssetAdjustmentForm: React.FC<AssetAdjustmentFormProps> = ({ 
  visible, 
  onCancel, 
  onSubmit 
}) => {
  const [form] = Form.useForm();
  
  return (
    <Modal
      title="增减代币"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            form.validateFields().then(values => {
              onSubmit(values);
              form.resetFields();
            });
          }}
        >
          提交
        </Button>,
      ]}
      width={800}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="账户" name="account" initialValue="公司总账户">
          <Input disabled />
        </Form.Item>
        
        <Form.Item label="方向" name="direction" initialValue="increase">
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="increase" style={{width: '50%', textAlign: 'center'}}>增币</Radio.Button>
            <Radio.Button value="decrease" style={{width: '50%', textAlign: 'center'}}>减币</Radio.Button>
          </Radio.Group>
        </Form.Item>
        
        <Form.Item label="币种" name="currency" initialValue="USDT">
          <Select>
            <Option value="BTC">BTC</Option>
            <Option value="ETH">ETH</Option>
            <Option value="USDT">USDT</Option>
          </Select>
        </Form.Item>
        
        <Form.Item label="金额" name="amount" rules={[{ required: true, message: '请输入金额' }]}>
          <Input placeholder="金额" />
        </Form.Item>
        
        <Form.Item label="备注" name="reason">
          <Input placeholder="原因" />
        </Form.Item>
        
        <Form.Item label="谷歌验证码" name="googleCode" rules={[{ required: true, message: '请输入谷歌验证码' }]}>
          <Input addonBefore="前往绑定" placeholder="谷歌验证器" />
        </Form.Item>
        
        <div style={{marginTop: '20px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <span>账户余额</span>
            <Space>
              <span>12.620</span>
              <span>USDT</span>
            </Space>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
            <span>累计增发金额</span>
            <Space>
              <span>12.620</span>
              <span>USDT</span>
            </Space>
          </div>
          
          <div style={{marginTop: '20px', color: 'red'}}>
            <div>注意事项:</div>
            <div>1. 增发资产建议谨慎操作，若资金流向用户，您需要承担对应损失；</div>
            <div>2. 建议用于做市服务。</div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AssetAdjustmentForm; 