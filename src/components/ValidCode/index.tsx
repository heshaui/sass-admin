import React, { useState } from 'react';
import { Input, message, Modal } from 'antd';

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
  const [googleCode, setGoogleCode] = useState('');

  const handleOk = async () => {
    if (!googleCode.trim()) {
      message.error('请输入谷歌验证码');
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
      title="谷歌验证"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <p>请输入谷歌验证码</p>
        <Input
          placeholder="谷歌验证码"
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
