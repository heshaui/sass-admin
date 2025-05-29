import React, { useState } from 'react';
import { Input, message, Modal } from 'antd';
import { useIntl } from 'umi';

interface ValidCodeProps {
  visible: boolean;
  onOk: (code: string) => Promise<void> | void;
  onCancel: () => void;
  loading?: boolean;
}

const ValidCode: React.FC<ValidCodeProps> = ({ 
  visible,
  onOk,
  onCancel,
  loading = false
}) => {
  const intl = useIntl();
  const [googleCode, setGoogleCode] = useState('');

  const handleOk = async () => {
    if (!googleCode.trim()) {
      message.error(intl.formatMessage({ id: 'component.validCode.errorMessage' }));
      return;
    }
    try {
      await onOk(googleCode);
      setGoogleCode('');
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'component.validCode.title' })}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <p>{intl.formatMessage({ id: 'component.validCode.enterCode' })}</p>
        <Input
          placeholder={intl.formatMessage({ id: 'component.validCode.placeholder' })}
          value={googleCode}
          onChange={(e) => setGoogleCode(e.target.value)}
          onPressEnter={handleOk}
          maxLength={6}
        />
      </div>
    </Modal>
  );
};

export default ValidCode;
