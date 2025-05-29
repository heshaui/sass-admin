import React from 'react';
import { useIntl } from 'umi';
import { Modal, message } from 'antd';

interface ResetGoogleModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const ResetGoogleModal: React.FC<ResetGoogleModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const intl = useIntl();

  const handleOk = () => {
    onSubmit();
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'merchantSystem.resetGoogleModal.title' })}
      visible={visible}
      onCancel={onClose}
      onOk={handleOk}
    >
      <p>{intl.formatMessage({ id: 'merchantSystem.resetGoogleModal.content' })}</p>
    </Modal>
  );
};

export default ResetGoogleModal;