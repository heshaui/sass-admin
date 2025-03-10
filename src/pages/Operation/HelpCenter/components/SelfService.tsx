import React, { useState } from 'react';
import { Button, Space, message, Radio } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { languages } from '@/config/language';
import styles from '../index.less';

const SelfService: React.FC = () => {
  const [activeLanguage, setActiveLanguage] = useState('en_US');

  // 添加自助服务
  const handleAddService = () => {
    message.info('添加自助服务');
  };

  return (
    <>
      <div className={styles.languageSelector}>
        <Space>
          <Radio.Group 
            value={activeLanguage} 
            onChange={(e) => setActiveLanguage(e.target.value)}
          >
            {languages.map(lang => (
              <Radio.Button key={lang.key} value={lang.key}>{lang.label}</Radio.Button>
            ))}
          </Radio.Group>
        </Space>
      </div>
      <div className={styles.addServiceContainer}>
        <Button 
          icon={<PlusOutlined />} 
          onClick={handleAddService}
          className={styles.addButton}
        />
        <div className={styles.helpText}>
          <p>1. 点击"+" 弹出 添加自助服务弹窗</p>
          <p>2. 默认选中文。</p>
          <p>最大可以添加10， 超出不显示"+"</p>
        </div>
      </div>
    </>
  );
};

export default SelfService; 