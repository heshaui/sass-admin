import { ImagePlaceholder } from '@/components/ImagePlaceholder';
import { updateUserIdentityVerificationById } from '@/services/ant-design-pro/IdentityVerification';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Image,
  Input,
  message,
  Modal,
  Row,
  Space,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import styles from './AuditDetailModal.module.less';
interface AuditDetailModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  record: any;
  title?: React.ReactNode;
}

const AuditDetailCard: React.FC<AuditDetailModalProps> = ({
  visible,
  onClose,
  onSuccess,
  record,
}) => {
  const [form] = Form.useForm();
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectReasonCount, setRejectReasonCount] = useState(0);
  const maxRejectReasonLength = 50;
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
      const res = await updateUserIdentityVerificationById({
        id: record.id,
        authStatus: '1',
      });
      if (res.code === '0') {
        message.success('已通过审核');
        onSuccess();
      } else {
        message.error('操作失败');
      }
    } catch (error) {
      message.error('操作失败');
      console.error(error);
    }
  };

  // 显示驳回原因的模态框
  const showRejectModal = () => {
    setRejectReason('');
    setRejectReasonCount(0);
    setRejectModalVisible(true);
  };

  // 处理取消驳回
  const handleRejectCancel = () => {
    setRejectModalVisible(false);
  };

  // 处理确认驳回
  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      message.error('请填写拒绝原因');
      return;
    }

    try {
      await updateUserIdentityVerificationById({
        id: record.id,
        authStatus: '0',
        rejectReason: rejectReason.trim(),
      });

      setRejectModalVisible(false);
      message.success('驳回成功');
      onSuccess();
    } catch (error) {
      message.error('操作失败');
      console.error(error);
    }
  };

  // 处理驳回原因输入
  const handleRejectReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxRejectReasonLength) {
      setRejectReason(value);
      setRejectReasonCount(value.length);
    }
  };

  const handleRevoke = async () => {
    const res = await updateUserIdentityVerificationById({
      id: record.id,
      authStatus: '2',
    });
    if (res.code === '0') {
      message.success('撤销成功');
      onSuccess();
    } else {
      message.error('操作失败');
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <>
      <Card title="审核详情" extra={<Button onClick={onClose}>关闭</Button>}>
        <div className={styles.statusBar}>
          <div className={styles.statusLabel}>审核状态</div>
          <div
            className={styles.statusValue}
            style={{
              color: record?.authStatus === 0 ? 'red' : record?.authStatus === 1 ? 'green' : 'gray',
            }}
          >
            {record?.authStatus === 0 ? '驳回' : record?.authStatus === 1 ? '通过' : '未审核'}
          </div>
        </div>

        <Descriptions bordered column={2}>
          <Descriptions.Item label="用户ID" span={1}>
            {record?.userId}
          </Descriptions.Item>
          <Descriptions.Item label="名" span={1}>
            {record?.firstName}
          </Descriptions.Item>
          <Descriptions.Item label="国家或地区" span={1}>
            {record?.country}
          </Descriptions.Item>
          <Descriptions.Item label="姓" span={1}>
            {record?.surname}
          </Descriptions.Item>
          <Descriptions.Item label="出生日期" span={1}>
            {dayjs(record?.birthday).format('YYYY-MM-DD')}
          </Descriptions.Item>
          <Descriptions.Item label="证件类型" span={1}>
            {record?.cardType}
          </Descriptions.Item>
          <Descriptions.Item label="当前语言" span={1}>
            {record?.currentLanguage}
          </Descriptions.Item>
          <Descriptions.Item label="证件号" span={2}>
            {record?.cardCode}
          </Descriptions.Item>
        </Descriptions>

        <div className={styles.actionButtons}>
          {record?.authStatus === 2 && (
            <Space size="middle">
              <Button type="primary" onClick={handleApprove}>
                通过
              </Button>
              <Button danger onClick={showRejectModal}>
                驳回
              </Button>
            </Space>
          )}
          {record?.authStatus === 1 && (
            <Space size="middle">
              <Button type="primary" danger onClick={handleRevoke}>
                撤销
              </Button>
            </Space>
          )}
        </div>

        <div className={styles.documentSection}>
          <h3>证件照</h3>
          <Row gutter={16}>
            <Col span={8}>
              <div className={styles.imageBox}>
                <div className={styles.imageLabel}>正面</div>
                <div className={styles.imageContainer}>
                  {record?.frontUrl ? (
                    <Image src={record.frontUrl} alt="证件正面" className={styles.documentImage} width={200} height={200} />
                  ) : (
                    <ImagePlaceholder />
                  )}
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.imageBox}>
                <div className={styles.imageLabel}>背面</div>
                <div className={styles.imageContainer}>
                  {record?.backUrl ? (
                    <Image src={record.backUrl} alt="证件背面" className={styles.documentImage} width={200} height={200} />
                  ) : (
                    <ImagePlaceholder />
                  )}
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.imageBox}>
                <div className={styles.imageLabel}>自拍照</div>
                <div className={styles.imageContainer}>
                  {record?.selfieUrl ? (
                    <Image src={record.selfieUrl} alt="自拍照" className={styles.documentImage} width={200} height={200} />
                  ) : (
                    <ImagePlaceholder />
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Card>

      {/* 驳回原因模态框 */}
      <Modal
        title="驳回原因"
        open={rejectModalVisible}
        onCancel={handleRejectCancel}
        footer={[
          <Button key="cancel" onClick={handleRejectCancel}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={handleRejectConfirm}>
            确认
          </Button>,
        ]}
      >
        <Input.TextArea
          placeholder="请输入"
          value={rejectReason}
          onChange={handleRejectReasonChange}
          rows={4}
        />
        <div style={{ textAlign: 'right', marginTop: 4 }}>
          {rejectReasonCount}/{maxRejectReasonLength}
        </div>
      </Modal>
    </>
  );
};

export default AuditDetailCard;
