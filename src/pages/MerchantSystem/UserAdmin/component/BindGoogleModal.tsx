import React, { useState, useEffect } from 'react';
import { useIntl } from 'umi';
import { Modal, Form, Input, Button, message, Space, Typography, Spin } from 'antd';
import { sendGoogleKey } from '@/services/ant-design-pro/authAdmin';

const { Text } = Typography;

interface BindGoogleModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: { googleCode: string; secretKey: string }) => void;
  userId: number | null;
}

const BindGoogleModal: React.FC<BindGoogleModalProps> = ({ visible, onClose, onSubmit, userId }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [googleData, setGoogleData] = useState<any>(null);

  // 获取谷歌验证信息
  const fetchGoogleKeyData = async () => {
    if (!visible || !userId) return;
    
    setLoading(true);
    try {
      const res = await sendGoogleKey({ userId });
      if (res.code === '0' && res.data) {
        setGoogleData(res.data);
      } else {
        message.error(res.msg || intl.formatMessage({ id: 'merchantSystem.bindGoogleModal.message.getGoogleCode.failed' }));
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'merchantSystem.bindGoogleModal.message.getGoogleCode.failed' }), error);
      message.error(intl.formatMessage({ id: 'merchantSystem.bindGoogleModal.message.getGoogleCode.failed' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchGoogleKeyData();
      form.resetFields();
    }
  }, [visible, userId]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (googleData && googleData.secretKey) {
        onSubmit({
          googleCode: values.googleCode,
          secretKey: googleData.secretKey
        });
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'merchantSystem.bindGoogleModal.message.formValidation.failed' }), error);
    }
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'merchantSystem.bindGoogleModal.title' })}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          {intl.formatMessage({ id: 'merchantSystem.bindGoogleModal.button.cancel' })}
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {intl.formatMessage({ id: 'merchantSystem.bindGoogleModal.button.confirm' })}
        </Button>,
      ]}
      maskClosable={false}
    >
      <Spin spinning={loading}>
        {googleData ? (
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>{intl.formatMessage({ id: 'merchantSystem.bindGoogleModal.text.enterKey' })}</Text>
            </div>
            {/* {googleData.codeUri && (
              <div style={{ marginBottom: 16 }}>
                <img 
                  src={googleData.codeUri} 
                  alt={intl.formatMessage({ id: 'merchantSystem.bindGoogleModal.text.qrCode' })} 
                  style={{ width: 200, height: 200 }}
                />
              </div>
            )} */}
            {googleData.secretKey && (
              <div style={{ marginBottom: 16 }}>
                <Text>{intl.formatMessage({ id: 'merchantSystem.bindGoogleModal.text.secretKey' })}</Text>
                <Text copyable strong>{googleData.secretKey}</Text>
              </div>
            )}
          </div>
        ) : !loading && (
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <Text type="danger">{intl.formatMessage({ id: 'merchantSystem.bindGoogleModal.message.getGoogleInfo.failed' })}</Text>
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="googleCode"
            label={intl.formatMessage({ id: 'merchantSystem.bindGoogleModal.form.googleCode' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'merchantSystem.bindGoogleModal.form.googleCode.required' }) }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'merchantSystem.bindGoogleModal.form.googleCode.placeholder' })} maxLength={6} />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default BindGoogleModal; 