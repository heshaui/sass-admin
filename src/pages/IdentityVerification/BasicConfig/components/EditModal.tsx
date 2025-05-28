import React, { useState, useEffect } from 'react';
import { Modal, Button, Radio, Input, Slider, Space } from 'antd';
import { useIntl } from 'umi';

interface EditModalProps {
  visible: boolean;
  record: any; // 当前编辑的记录
  onCancel: () => void;
  onSave: (values: any) => void;
}

const EditModal: React.FC<EditModalProps> = ({ visible, record, onCancel, onSave }) => {
  const intl = useIntl();
  const [cryptoWithdrawal, setCryptoWithdrawal] = useState<number>(1);
  const [withdrawalLimit, setWithdrawalLimit] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState<number>(5);
  const [cryptoDeposit, setCryptoDeposit] = useState<number>(1);

  // 当record变化时更新表单值
  useEffect(() => {
    if (record) {

      
      // 从benefitResps找到对应的配置项
      const cryptoWithdrawalBenefit = record.benefitResps?.find(
        (item: any) => item.benefitValue === 'cyptocurrency_withdrawal'
      );
      
      const cryptoDepositBenefit = record.benefitResps?.find(
        (item: any) => item.benefitValue === 'cyptocurrency_recharge'
      );
      console.log(cryptoDepositBenefit);
      // 设置加密货币提现状态
      setCryptoWithdrawal(
        cryptoWithdrawalBenefit?.status
      );
      console.log(cryptoWithdrawal);
      // 设置加密货币充值状态
      setCryptoDeposit(
        cryptoDepositBenefit?.status
      );
      
      // 设置提现限额
      if (cryptoWithdrawalBenefit?.params?.amountLimit) {
        setWithdrawalLimit(cryptoWithdrawalBenefit.params.amountLimit);
      } else {
        setWithdrawalLimit(70000); // 默认值
      }
      
      // 滑块值保持默认
      setSliderValue(5);
    }
  }, [record]);

  // 提交表单
  const handleSubmit = () => {
    // 构建保存的数据结构
    const updatedBenefits = [];
    
    // 更新加密货币提现配置
    if (record?.benefitResps) {
      const withdrawalBenefit = record.benefitResps.find(
        (item: any) => item.benefitValue ==='cyptocurrency_withdrawal'
      );
      
      if (withdrawalBenefit) {
        updatedBenefits.push({
          ...withdrawalBenefit,
          status: cryptoWithdrawal,
          params: {
            ...withdrawalBenefit.params,
            amountLimit: withdrawalLimit,
          }
        });
      }
      
      // 更新加密货币充值配置
      const depositBenefit = record.benefitResps.find(
        (item: any) => item.benefitValue === 'cyptocurrency_recharge'
      );
      
      if (depositBenefit) {
        updatedBenefits.push({
          ...depositBenefit,
          status: cryptoDeposit
        });
      }
    }
    
    onSave({
      ...record,
      benefitResps: updatedBenefits
    });
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'editModal.title' })}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {intl.formatMessage({ id: 'editModal.button.cancel' })}
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {intl.formatMessage({ id: 'editModal.button.confirm' })}
        </Button>,
      ]}
      closeIcon={<span style={{ fontSize: '18px' }}>X</span>}
    >
      <div style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 10 }}>{intl.formatMessage({ id: 'editModal.cryptoWithdrawal' })}</div>
        <Radio.Group 
          value={cryptoWithdrawal} 
          onChange={(e) => setCryptoWithdrawal(e.target.value)}
        >
          <Radio value={1}>{intl.formatMessage({ id: 'editModal.allow' })}</Radio>
          <Radio value={0}>{intl.formatMessage({ id: 'editModal.deny' })}</Radio>
        </Radio.Group>
      </div>

      <div style={{ marginBottom: 20 }}>
        <Space align="center">
          <Input
            value={withdrawalLimit}
            onChange={(e) => setWithdrawalLimit(Number(e.target.value))}
            style={{ width: 200 }}
          />
          <span>{intl.formatMessage({ id: 'editModal.limitPerDay' })}</span>
        </Space>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 10 }}>{intl.formatMessage({ id: 'editModal.cryptoDeposit' })}</div>
        <Radio.Group 
          value={cryptoDeposit} 
          onChange={(e) => setCryptoDeposit(e.target.value)}
        >
          <Radio value={1}>{intl.formatMessage({ id: 'editModal.allow' })}</Radio>
          <Radio value={0}>{intl.formatMessage({ id: 'editModal.deny' })}</Radio>
        </Radio.Group>
      </div>
    </Modal>
  );
};

export default EditModal; 