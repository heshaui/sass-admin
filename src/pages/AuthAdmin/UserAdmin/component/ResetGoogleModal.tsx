import React from 'react';
import { Modal, message } from 'antd';
import { useIntl } from 'umi';

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
      title={intl.formatMessage({ id: 'resetGoogleModal.title' })}
      visible={visible}
      onCancel={onClose}
      onOk={handleOk}
    >
      <p>{intl.formatMessage({ id: 'resetGoogleModal.confirmation' })}</p>
    </Modal>
  );
};

export default ResetGoogleModal;