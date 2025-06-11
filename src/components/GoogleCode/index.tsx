import React, { useState, useEffect } from 'react';
import { Button, Input, message, Modal } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import styles from './index.module.css';
import { QRCodeSVG } from 'qrcode.react';
import { useIntl } from '@umijs/max';

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
  secretKey,
  qrCodeUrl,
  onSubmit,
  onCancel,
  visible = false,
  title,
  width = 500,
  maskClosable = false,
  centered = true
}) => {
  const intl = useIntl();
  const defaultTitle = intl.formatMessage({ id: 'component.googleCode.title' });
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(intl.formatMessage({ id: 'component.googleCode.errorMessage' }));
  const [countdown, setCountdown] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(false);

  const isTotpUri = qrCodeUrl?.startsWith('otpauth://');

  useEffect(() => {
    if (isTotpUri && !secretKey) {
      try {
        if (!qrCodeUrl) return;
        const url = new URL(qrCodeUrl);
        const secret = url.searchParams.get('secret');
        if (secret) {
          // 更新 secretKey
          // 注意：这里需要一个状态变量来存储提取的密钥，如果 secretKey 是不可变的 prop
        }
      } catch (e) {
        console.error(intl.formatMessage({ id: 'component.googleCode.parseError' }), e);
      }
    }
  }, [qrCodeUrl, secretKey, isTotpUri]);

  useEffect(() => {
    if (!visible) {
      setVerificationCode('');
      setError(false);
    }
  }, [visible]);

  const handleCopySecretKey = () => {
    navigator.clipboard.writeText(secretKey || '')
      .then(() => {
        message.success(intl.formatMessage({ id: 'component.googleCode.copySuccess' }));
      })
      .catch(() => {
        message.error(intl.formatMessage({ id: 'component.googleCode.copyFailed' }));
      });
  };

  const handleSubmit = async () => {
    if (!verificationCode) {
      setError(true);
      setErrorMessage(intl.formatMessage({ id: 'component.googleCode.enterCode' }));
      return;
    }

    if (verificationCode.length !== 6) {
      setError(true);
      setErrorMessage(intl.formatMessage({ id: 'component.googleCode.codeLength' }));
      return;
    }

    setLoading(true);
    try {
      if (onSubmit) {
        const result = await onSubmit(verificationCode);
        if (!result) {
          setError(true);
          setErrorMessage(intl.formatMessage({ id: 'component.googleCode.codeInvalid' }));
        }
      }
    } catch (err) {
      setError(true);
      setErrorMessage(intl.formatMessage({ id: 'component.googleCode.verifyError' }));
      console.error(intl.formatMessage({ id: 'component.googleCode.submitError' }), err);
    } finally {
      setLoading(false);
    }
  };

  const isCountdownLow = countdown < 10;

  const googleCodeContent = (
    <div className={styles.container}>
      <p className={styles.description}
        dangerouslySetInnerHTML={{
          __html: intl.formatMessage({ id: 'component.googleCode.recommendation' })
        }}
      />

      <div className={styles.qrCode}>
        {isTotpUri ? (
          <QRCodeSVG value={qrCodeUrl || ''} size={200} />
        ) : (
          <img src={qrCodeUrl} alt={intl.formatMessage({ id: 'component.googleCode.qrCodeAlt' })} width={200} height={200} />
        )}
      </div>

      <div className={styles.secretKeyContainer}>
        <div className={styles.secretKeyLabel}>{intl.formatMessage({ id: 'component.googleCode.secretKey' })}</div>
        <div className={styles.secretKey}>{secretKey}</div>
        <Button
          icon={<CopyOutlined />}
          className={styles.copyButton}
          onClick={handleCopySecretKey}
          aria-label={intl.formatMessage({ id: 'component.googleCode.copyButton' })}
        />
      </div>

      <div className={styles.inputContainer}>
        <span className={styles.required}>*</span>
        <span className={styles.label}>{intl.formatMessage({ id: 'component.googleCode.verificationCode' })}</span>
        <Input
          placeholder={intl.formatMessage({ id: 'component.googleCode.placeholder' })}
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
      title={title || defaultTitle}
      open={visible}
      onCancel={onCancel}
      width={width}
      maskClosable={maskClosable}
      centered={centered}
      destroyOnClose={true}
      footer={
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <Button key="cancel" onClick={onCancel} className={styles.cancelButton}>
            {intl.formatMessage({ id: 'component.googleCode.cancel' })}
          </Button>
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            className={styles.submitButton}
            disabled={verificationCode.length !== 6}
          >
            {intl.formatMessage({ id: 'component.googleCode.submit' })}
          </Button>
        </div>
      }
    >
      {googleCodeContent}
    </Modal>
  );
};

export default GoogleCode;
