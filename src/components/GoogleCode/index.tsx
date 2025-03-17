import React, { useState, useEffect } from 'react';
import { Button, Input, message, Progress, Modal } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import styles from './index.module.css';

interface GoogleCodeProps {
  secretKey?: string;
  qrCodeUrl?: string;
  onSubmit?: (code: string) => Promise<boolean>;
  onCancel?: () => void;
  visible?: boolean;
  title?: string;
  width?: number;
  maskClosable?: boolean;
  centered?: boolean;
}

const GoogleCode: React.FC<GoogleCodeProps> = ({ 
  secretKey = '4D5F6G7H8RTFYG', 
  qrCodeUrl = '/qrcode.png', 
  onSubmit, 
  onCancel,
  visible = false,
  title = '谷歌验证',
  width = 500,
  maskClosable = false,
  centered = true
}) => {
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('验证码错误');
  const [countdown, setCountdown] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const currentTime = Math.floor(Date.now() / 1000);
    const initialCountdown = 30 - (currentTime % 30);
    setCountdown(initialCountdown);

    const timer = setInterval(() => {
      const newTime = Math.floor(Date.now() / 1000);
      const newCountdown = 30 - (newTime % 30);
      setCountdown(newCountdown);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!visible) {
      setVerificationCode('');
      setError(false);
    }
  }, [visible]);

  const handleCopySecretKey = () => {
    navigator.clipboard.writeText(secretKey)
      .then(() => {
        message.success('密钥已复制到剪贴板');
      })
      .catch(() => {
        message.error('复制失败，请手动复制');
      });
  };

  const handleSubmit = async () => {
    if (!verificationCode) {
      setError(true);
      setErrorMessage('请输入验证码');
      return;
    }
    
    if (verificationCode.length !== 6) {
      setError(true);
      setErrorMessage('验证码必须为6位数字');
      return;
    }

    setLoading(true);
    try {
      if (onSubmit) {
        const result = await onSubmit(verificationCode);
        if (!result) {
          setError(true);
          setErrorMessage('验证码错误或已过期');
        }
      }
    } catch (err) {
      setError(true);
      setErrorMessage('验证过程中出现错误，请重试');
      console.error('验证码提交错误:', err);
    } finally {
      setLoading(false);
    }
  };

  const isCountdownLow = countdown < 10;

  const googleCodeContent = (
    <div className={styles.container}>
      <p className={styles.description}>
        推荐使用 <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank" rel="noopener noreferrer">Google Authenticator</a> 即使您的设备未连接到互联网，您也可以生成验证码
      </p>
      
      <div className={styles.qrCode}>
        <img src={qrCodeUrl} alt="谷歌验证器二维码" width={200} height={200} />
      </div>
      
      <div className={styles.secretKeyContainer}>
        <div className={styles.secretKeyLabel}>密钥：</div>
        <div className={styles.secretKey}>{secretKey}</div>
        <Button 
          icon={<CopyOutlined />} 
          className={styles.copyButton}
          onClick={handleCopySecretKey}
          aria-label="复制密钥"
        />
      </div>
      
      <div className={styles.inputContainer}>
        <span className={styles.required}>*</span>
        <span className={styles.label}>谷歌验证码：</span>
        <Input
          placeholder="6位动态验证码"
          maxLength={6}
          value={verificationCode}
          onChange={(e) => {
            setVerificationCode(e.target.value.replace(/[^0-9]/g, ''));
            setError(false);
          }}
          className={error ? styles.errorInput : ''}
          onPressEnter={handleSubmit}
          aria-invalid={error}
          aria-describedby="verification-error"
          autoFocus
        />
      </div>
      
      {error && <div id="verification-error" className={styles.errorMessage}>{errorMessage}</div>}
      
      
    </div>
  );

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      width={width}
      maskClosable={maskClosable}
      centered={centered}
      destroyOnClose={true}
      footer={[
        <Button key="cancel" onClick={onCancel} className={styles.cancelButton}>
          取消
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleSubmit}
          loading={loading}
          className={styles.submitButton}
          disabled={verificationCode.length !== 6}
        >
          提交
        </Button>
      ]}
    >
      {googleCodeContent}
    </Modal>
  );
};

export default GoogleCode;
