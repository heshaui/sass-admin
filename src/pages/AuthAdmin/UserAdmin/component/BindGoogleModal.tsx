import React, { useState, useEffect } from 'react';
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
        message.error(res.msg || '获取谷歌验证码失败');
      }
    } catch (error) {
      console.error('获取谷歌验证码失败:', error);
      message.error('获取谷歌验证码失败');
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

    }
  };

  return (
    <Modal
      title="绑定谷歌验证"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          确认绑定
        </Button>,
      ]}
      maskClosable={false}
    >
      <Spin spinning={loading}>
        {googleData ? (
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>请手动输入密钥</Text>
            </div>
            {/* {googleData.codeUri && (
              <div style={{ marginBottom: 16 }}>
                <img 
                  src={googleData.codeUri} 
                  alt="谷歌验证二维码" 
                  style={{ width: 200, height: 200 }}
                />
              </div>
            )} */}
            {googleData.secretKey && (
              <div style={{ marginBottom: 16 }}>
                <Text>密钥: </Text>
                <Text copyable strong>{googleData.secretKey}</Text>
              </div>
            )}
          </div>
        ) : !loading && (
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <Text type="danger">获取谷歌验证信息失败，请重试</Text>
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="googleCode"
            label="谷歌验证码"
            rules={[{ required: true, message: '请输入谷歌验证码' }]}
          >
            <Input placeholder="请输入谷歌验证器中的6位验证码" maxLength={6} />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default BindGoogleModal; 