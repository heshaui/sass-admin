import React, { useState, useEffect } from 'react';
import { Modal, Button, Radio, Input, Slider, Space } from 'antd';

interface EditModalProps {
  visible: boolean;
  record: any; // 当前编辑的记录
  onCancel: () => void;
  onSave: (values: any) => void;
}

const EditModal: React.FC<EditModalProps> = ({ visible, record, onCancel, onSave }) => {
  const [cryptoWithdrawal, setCryptoWithdrawal] = useState<string>('允许');
  const [withdrawalLimit, setWithdrawalLimit] = useState<number>(70000);
  const [sliderValue, setSliderValue] = useState<number>(5);
  const [cryptoDeposit, setCryptoDeposit] = useState<string>('允许');

  // 当record变化时更新表单值
  useEffect(() => {
    if (record) {
      // 这里根据实际record字段设置初始值
      setCryptoWithdrawal('允许');
      setWithdrawalLimit(70000);
      setSliderValue(5);
      setCryptoDeposit('允许');
    }
  }, [record]);

  // 提交表单
  const handleSubmit = () => {
    onSave({
      cryptoWithdrawal,
      withdrawalLimit,
      sliderValue,
      cryptoDeposit,
      id: record?.id // 确保包含记录ID
    });
  };

  return (
    <Modal
      title="编辑"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          确认
        </Button>,
      ]}
      closeIcon={<span style={{ fontSize: '18px' }}>X</span>}
    >
      <div style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 10 }}>加密货币提现</div>
        <Radio.Group 
          value={cryptoWithdrawal} 
          onChange={(e) => setCryptoWithdrawal(e.target.value)}
        >
          <Radio value="允许">允许</Radio>
          <Radio value="禁止">禁止</Radio>
        </Radio.Group>
      </div>

      <div style={{ marginBottom: 20 }}>
        <Space align="center">
          <Input
            value={withdrawalLimit}
            onChange={(e) => setWithdrawalLimit(Number(e.target.value))}
            style={{ width: 200 }}
          />
          <span>USDT/24小时</span>
        </Space>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
          <Slider
            min={1}
            max={10}
            value={sliderValue}
            onChange={setSliderValue}
            style={{ flex: 1, marginRight: 10 }}
          />
          <div 
            style={{ 
              width: 30, 
              height: 30, 
              backgroundColor: '#F8C25A', 
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {sliderValue}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 10 }}>加密货币充值</div>
        <Radio.Group 
          value={cryptoDeposit} 
          onChange={(e) => setCryptoDeposit(e.target.value)}
        >
          <Radio value="允许">允许</Radio>
          <Radio value="禁止">禁止</Radio>
        </Radio.Group>
      </div>
    </Modal>
  );
};

export default EditModal; 