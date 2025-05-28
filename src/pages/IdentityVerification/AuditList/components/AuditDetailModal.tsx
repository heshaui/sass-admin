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
import { useIntl } from 'umi';
import styles from './AuditDetailModal.module.less';
interface AuditDetailModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  record: any;
  title?: React.ReactNode;
}
// 1居民身份证  2普通护照  3港澳通行证  4台湾通行证  5台湾身份证  6外国人永久居住身份证
const cardType=(cardType:number, intl: any)=>{
  switch(cardType){
    case 1:
      return intl.formatMessage({ id: 'auditDetail.cardType.idCard' });
    case 2:
      return intl.formatMessage({ id: 'auditDetail.cardType.passport' });
    case 3:
      return intl.formatMessage({ id: 'auditDetail.cardType.hkMacauPass' });
    case 4:
      return intl.formatMessage({ id: 'auditDetail.cardType.taiwanPass' });
    case 5:
      return intl.formatMessage({ id: 'auditDetail.cardType.taiwanIdCard' });
    case 6:
      return intl.formatMessage({ id: 'auditDetail.cardType.foreignerCard' });
    default:
      return '-';
  }
}
const AuditDetailModal: React.FC<AuditDetailModalProps> = ({
  visible,
  onClose,
  onSuccess,
  record,
}) => {
  const intl = useIntl();
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
        message.success(intl.formatMessage({ id: 'auditDetail.message.approveSuccess' }));
        onSuccess();
      } else {
        message.error(intl.formatMessage({ id: 'auditDetail.message.operationFailed' }));
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'auditDetail.message.operationFailed' }));
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
      message.error(intl.formatMessage({ id: 'auditDetail.modal.emptyRejectReason' }));
      return;
    }

    try {
      await updateUserIdentityVerificationById({
        id: record.id,
        authStatus: '0',
        remark: rejectReason.trim(),
      });

      setRejectModalVisible(false);
      message.success(intl.formatMessage({ id: 'auditDetail.message.rejectSuccess' }));
      onSuccess();
    } catch (error) {
      message.error(intl.formatMessage({ id: 'auditDetail.message.operationFailed' }));
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
    // 
    Modal.confirm({
      title: intl.formatMessage({ id: 'auditDetail.confirm.revokeTitle' }),
      content: intl.formatMessage({ id: 'auditDetail.confirm.revokeContent' }),
      onOk: async () => {
        const res = await updateUserIdentityVerificationById({
          id: record.id,
          authStatus: '2',
        });
        if (res.code === '0') {
          message.success(intl.formatMessage({ id: 'auditDetail.message.revokeSuccess' }));
          onSuccess();
        } else {
          message.error(intl.formatMessage({ id: 'auditDetail.message.operationFailed' }));
        }
      },
    });
  };

  if (!visible) {
    return null;
  }

  return (
    <>
      <Card title={intl.formatMessage({ id: 'auditDetail.title' })} extra={<Button onClick={onClose}>{intl.formatMessage({ id: 'auditList.button.close' })}</Button>}>
        <div className={styles.statusBar}>
          <div className={styles.statusLabel}>{intl.formatMessage({ id: 'auditDetail.statusLabel' })}</div>
          <div
            className={styles.statusValue}
            style={{
              color: record?.authStatus === 0 ? 'red' : record?.authStatus === 1 ? 'green' : 'gray',
            }}
          >
            {record?.authStatus === 0 ? 
              intl.formatMessage({ id: 'auditList.status.rejected' }) : 
              record?.authStatus === 1 ? 
                intl.formatMessage({ id: 'auditList.status.approved' }) : 
                intl.formatMessage({ id: 'auditList.status.pending' })}
          </div>
        </div>

        <Descriptions bordered column={2}>
          <Descriptions.Item label={intl.formatMessage({ id: 'auditDetail.description.userId' })} span={1}>
            {record?.userId}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'auditDetail.description.firstName' })} span={1}>
            {record?.firstName}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'auditDetail.description.country' })} span={1}>
            {record?.country}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'auditDetail.description.surname' })} span={1}>
            {record?.surname}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'auditDetail.description.birthday' })} span={1}>
            {dayjs(record?.birthday).format('YYYY-MM-DD')}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'auditDetail.description.cardType' })} span={1}>
            {cardType(record?.cardType, intl)}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'auditDetail.description.currentLanguage' })} span={1}>
            {record?.currentLanguage}
          </Descriptions.Item>
          <Descriptions.Item label={intl.formatMessage({ id: 'auditDetail.description.cardCode' })} span={2}>
            {record?.cardCode}
          </Descriptions.Item>
        </Descriptions>

        <div className={styles.actionButtons}>
          {(record?.authStatus === 3 || record?.authStatus === 2 || record?.authStatus === 0) && (
            <Space size="middle">
              <Button type="primary" onClick={handleApprove}>
                {intl.formatMessage({ id: 'auditList.button.approve' })}
              </Button>
              <Button danger onClick={showRejectModal}>
                {intl.formatMessage({ id: 'auditList.button.reject' })}
              </Button>
            </Space>
          )}
          {record?.authStatus === 1 && (
            <Space size="middle">
              <Button type="primary" danger onClick={handleRevoke}>
                {intl.formatMessage({ id: 'auditList.button.revoke' })}
              </Button>
            </Space>
          )}
        </div>

        {/* 显示驳回原因 */}
        {record?.authStatus === 0 && record?.remark && (
          <div className={styles.rejectReasonSection}>
            <h3>{intl.formatMessage({ id: 'auditDetail.rejectReasonTitle' })}：</h3>
            <div className={styles.rejectReasonContent}>
              {record?.remark?.split('&&').map((reason:string, index:number) => (
                <div key={index} className={styles.rejectReasonItem}>
                  <span className={styles.bulletPoint}>•</span> {reason}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.documentSection}>
          <h3>{intl.formatMessage({ id: 'auditDetail.documentSection' })}</h3>
          <Row gutter={16}>
            <Col span={8}>
              <div className={styles.imageBox}>
                <div className={styles.imageLabel}>{intl.formatMessage({ id: 'auditDetail.frontSide' })}</div>
                <div className={styles.imageContainer}>
                  {record?.frontUrl ? (
                    <Image src={record.frontUrl} alt={intl.formatMessage({ id: 'auditDetail.frontSide' })} className={styles.documentImage} width={200} height={200} />
                  ) : (
                    <ImagePlaceholder />
                  )}
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.imageBox}>
                <div className={styles.imageLabel}>{intl.formatMessage({ id: 'auditDetail.backSide' })}</div>
                <div className={styles.imageContainer}>
                  {record?.backUrl ? (
                    <Image src={record.backUrl} alt={intl.formatMessage({ id: 'auditDetail.backSide' })} className={styles.documentImage} width={200} height={200} />
                  ) : (
                    <ImagePlaceholder />
                  )}
                </div>
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.imageBox}>
                <div className={styles.imageLabel}>{intl.formatMessage({ id: 'auditDetail.selfie' })}</div>
                <div className={styles.imageContainer}>
                  {record?.selfieUrl ? (
                    <Image src={record.selfieUrl} alt={intl.formatMessage({ id: 'auditDetail.selfie' })} className={styles.documentImage} width={200} height={200} />
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
        title={intl.formatMessage({ id: 'auditDetail.modal.rejectTitle' })}
        open={rejectModalVisible}
        onCancel={handleRejectCancel}
        footer={[
          <Button key="cancel" onClick={handleRejectCancel}>
            {intl.formatMessage({ id: 'auditList.button.cancel' })}
          </Button>,
          <Button key="submit" type="primary" onClick={handleRejectConfirm}>
            {intl.formatMessage({ id: 'auditList.button.confirm' })}
          </Button>,
        ]}
      >
        <Input.TextArea
          placeholder={intl.formatMessage({ id: 'auditDetail.modal.placeholder' })}
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

export default AuditDetailModal;
