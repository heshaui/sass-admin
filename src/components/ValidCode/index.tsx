import React, { useState, useEffect } from 'react';
import { Button, Input, message, Modal } from 'antd';
import styles from './index.module.css';




const ValidCode: React.FC = ({ 

}) => {




     const [googleModalVisible, setGoogleModalVisible] = useState(false);
     const [googleCode, setGoogleCode] = useState('');
 
  const handleGoogleModalOk = async () => {
    if (!googleCode) {
      message.error('请输入谷歌验证码');
      return;
    }
  };


  return (
      <Modal
        title="谷歌验证"
        open={googleModalVisible}
        onOk={handleGoogleModalOk}
        onCancel={() => setGoogleModalVisible(false)}
      >
        <div style={{ marginBottom: 16 }}>
          <p>请输入谷歌验证码</p>
          <Input
            placeholder="谷歌验证码"
            value={googleCode}
            onChange={(e) => setGoogleCode(e.target.value)}
          />
        </div>
      </Modal>
  );
};

export default ValidCode;
