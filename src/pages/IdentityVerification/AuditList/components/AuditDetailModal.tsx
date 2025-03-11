import React, { useEffect } from 'react';
import { Modal, Button, Form, Input, Select, message } from 'antd';
import { updateUserIdentityVerificationById } from '@/services/ant-design-pro/IdentityVerification';

interface AuditDetailModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  record: any;
}

const AuditDetailModal: React.FC<AuditDetailModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  record,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && record) {
      form.setFieldsValue({
        userId: record.userId,
        userName: record.userName,
        idType: record.idType,
        status: record.status,
        rejectReason: record.rejectReason || '',
      });
    }
  }, [visible, record, form]);

  const handleApprove = async () => {
    try {
      await updateUserIdentityVerificationById({
        id: record.id,
        status: 'approved',
      });
      message.success('已通过审核');
      onSuccess();
    } catch (error) {
      message.error('操作失败');
      console.error(error);
    }
  };

  const handleReject = async () => {
    try {
      const values = await form.validateFields();
      if (!values.rejectReason) {
        message.error('请填写拒绝原因');
        return;
      }
      
      await updateUserIdentityVerificationById({
        id: record.id,
        status: 'rejected',
        rejectReason: values.rejectReason
      });
      
      message.success('已拒绝审核');
      onSuccess();
    } catch (error) {
      message.error('操作失败');
      console.error(error);
    }
  };

  const renderFooter = () => {
    const buttons = [
      <Button key="cancel" onClick={onCancel}>
        关闭
      </Button>
    ];

    if (record?.status === 'pending') {
      buttons.push(
        <Button 
          key="approve" 
          type="primary" 
          onClick={handleApprove}
        >
          通过
        </Button>,
        <Button 
          key="reject" 
          danger 
          onClick={handleReject}
        >
          拒绝
        </Button>
      );
    }

    return buttons;
  };

  return (
    <Modal
      title="审核详情"
      open={visible}
      onCancel={onCancel}
      footer={renderFooter()}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item name="userId" label="用户ID">
          <Input disabled />
        </Form.Item>
        <Form.Item name="userName" label="用户名">
          <Input disabled />
        </Form.Item>
        <Form.Item name="idType" label="证件类型">
          <Select disabled>
            <Select.Option value="idcard">身份证</Select.Option>
            <Select.Option value="passport">护照</Select.Option>
            <Select.Option value="other">其他证件</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select disabled>
            <Select.Option value="pending">待审核</Select.Option>
            <Select.Option value="approved">已通过</Select.Option>
            <Select.Option value="rejected">已拒绝</Select.Option>
          </Select>
        </Form.Item>
        {(record?.status === 'pending') && (
          <Form.Item name="rejectReason" label="拒绝原因" rules={[{ required: false, message: '请填写拒绝原因' }]}>
            <Input.TextArea rows={4} placeholder="若选择拒绝，请填写拒绝原因" />
          </Form.Item>
        )}
        {(record?.status === 'rejected') && (
          <Form.Item name="rejectReason" label="拒绝原因">
            <Input.TextArea rows={4} disabled />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default AuditDetailModal; 