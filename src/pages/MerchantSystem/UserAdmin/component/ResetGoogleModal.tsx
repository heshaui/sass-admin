import React from 'react';
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
  const handleOk = () => {
    onSubmit();
  };

  return (
    <Modal
      title="重置谷歌身份验证"
      visible={visible}
      onCancel={onClose}
      onOk={handleOk}
    >
      <p>确定要重置此用户的谷歌身份验证吗？</p>
    </Modal>
  );
};

export default ResetGoogleModal;