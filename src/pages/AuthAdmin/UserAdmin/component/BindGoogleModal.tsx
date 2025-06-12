import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message, Typography, Spin } from 'antd';
import { sendGoogleKey } from '@/services/ant-design-pro/authAdmin';
import { useIntl } from '@umijs/max';

const { Text } = Typography;

interface BindGoogleModalProps {
  visible: boolean;
  showGoogleKey?: boolean;
  onClose: () => void;
  onSubmit: (values: { googleCode: string; secretKey: string }) => void;
  userId: number | null;
}

const BindGoogleModal: React.FC<BindGoogleModalProps> = ({
  visible,
  showGoogleKey,
  onClose,
  onSubmit,
  userId,
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [googleData, setGoogleData] = useState<any>(null);

  // 获取谷歌验证信息
  const fetchGoogleKeyData = async () => {
    if (!visible) return;

    setLoading(true);
    try {
      const res = await sendGoogleKey({ userId });
      if (res.code === '0' && res.data) {
        setGoogleData(res.data);
      } else {
        message.error(
          res.message || intl.formatMessage({ id: 'bindGoogleModal.message.fetchFailed' }),
        );
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'bindGoogleModal.message.fetchFailedDetail' }), error);
      message.error(intl.formatMessage({ id: 'bindGoogleModal.message.fetchFailed' }));
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
          secretKey: googleData.secretKey,
        });
      }
    } catch (error) {}
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'bindGoogleModal.title' })}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          {intl.formatMessage({ id: 'bindGoogleModal.button.cancel' })}
        </Button>,
        !showGoogleKey && (
          <Button key="submit" type="primary" onClick={handleSubmit}>
            {intl.formatMessage({ id: 'bindGoogleModal.button.confirm' })}
          </Button>
        ),
      ]}
      maskClosable={false}
    >
      <Spin spinning={loading}>
        {googleData ? (
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>{intl.formatMessage({ id: 'bindGoogleModal.text.enterKey' })}</Text>
            </div>
            {/* {googleData.codeUri && (
              <div style={{ marginBottom: 16 }}>
                <img
                  src={googleData.codeUri}
                  alt={intl.formatMessage({ id: 'bindGoogleModal.image.qrcode' })}
                  style={{ width: 200, height: 200 }}
                />
              </div>
            )} */}
            {googleData.secretKey && (
              <div style={{ marginBottom: 16 }}>
                <Text>{intl.formatMessage({ id: 'bindGoogleModal.text.key' })}</Text>
                <Text copyable strong>
                  {googleData.secretKey}
                </Text>
              </div>
            )}
          </div>
        ) : (
          !loading && (
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Text type="danger">
                {intl.formatMessage({ id: 'bindGoogleModal.text.fetchFailed' })}
              </Text>
            </div>
          )
        )}

        {!showGoogleKey && (
          <Form form={form} layout="vertical">
            <Form.Item
              name="googleCode"
              label={intl.formatMessage({ id: 'bindGoogleModal.form.googleCode' })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'bindGoogleModal.form.googleCode.required' }),
                },
              ]}
            >
              <Input
                placeholder={intl.formatMessage({
                  id: 'bindGoogleModal.form.googleCode.placeholder',
                })}
                maxLength={6}
              />
            </Form.Item>
          </Form>
        )}
      </Spin>
    </Modal>
  );
};

export default BindGoogleModal;
