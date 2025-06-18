import React from 'react';
import { FileImageOutlined } from '@ant-design/icons';
import styles from './index.module.less';

interface ImagePlaceholderProps {
  width?: number | string;
  height?: number | string;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  width = '100%',
  height = '100%'
}) => {
  return (
    <div
      className={styles.imagePlaceholder}
      style={{ width, height }}
    >
      <FileImageOutlined className={styles.icon} />
      <div className={styles.text}>暂无图片</div>
    </div>
  );
};

export default ImagePlaceholder;
