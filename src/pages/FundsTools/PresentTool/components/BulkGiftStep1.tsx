import { getCoinGiftCheckImport, getCoinGiftTemplate } from '@/services/ant-design-pro/fundsTools';
import { DownloadOutlined, RightCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { Button, message, Upload } from 'antd';
import React, { useState } from 'react';
import styles from './styles/gift.module.less';

// const { Option } = Select;

interface BulkGiftProps {
  type: string;
  onCancel: () => void;
  onNext: () => void;
}

const BulkGiftSetp1: React.FC<BulkGiftProps> = ({ type, onCancel, onNext }) => {
  const intl = useIntl();
  const [steps1NextFlag, setSteps1NextFlag] = useState(false);

  const handleNext = () => {
    if (!steps1NextFlag) return;
    onNext();
  };
  const downloadTemplate = async () => {
    try {
      // 获取响应对象，包含数据和headers
      const response = await getCoinGiftTemplate();

      // 检查是否有响应数据
      if (!response || !response.data) {
        message.error(intl.formatMessage({ id: 'presentTool.steps.download.failed' }));
        return;
      }

      // 从响应中提取blob数据
      const blob = response.data;

      // 检查blob是否为空
      if (blob.size === 0) {
        message.error(intl.formatMessage({ id: 'presentTool.steps.download.empty' }));
        return;
      }

      // 创建一个URL对象
      const url = window.URL.createObjectURL(blob);

      // 创建一个隐藏的a标签用于下载
      const link = document.createElement('a');
      link.href = url;
      link.download = `${intl.formatMessage({ id: 'presentTool.steps.template' })}.xlsx`; // 设置下载的文件名
      document.body.appendChild(link);
      link.click();

      // 清理
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success(intl.formatMessage({ id: 'presentTool.steps.download.success' }));
    } catch (error) {
      console.error('Download template error:', error);
      message.error(intl.formatMessage({ id: 'presentTool.steps.download.failed' }));
    }
  };
  // 处理上传成功后的回调
  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      setSteps1NextFlag(true);
      // 上传成功的处理已在customUpload中完成
    }
  };
  // 自定义文件上传方法
  const customUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      // 直接调用API，FormData处理已移至API函数内部
      const res = await getCoinGiftCheckImport(
        { file: file, type: type },
        //  {headers: { "Content-Type": "multipart/form-data" }, }
      );
      if (res.code === '0') {
        sessionStorage.setItem('checkData', JSON.stringify(res.data));
        onSuccess(res, file);
        message.success(
          intl.formatMessage({
            id: 'presentTool.steps.upload.success',
            defaultMessage: intl.formatMessage({ id: 'presentTool.steps.upload.success' }), //'上传成功',
          }),
        );
      } else {
        console.error('Upload error1:', res);
        message.error(
          intl.formatMessage({
            id: 'presentTool.steps.upload.failed',
            defaultMessage: intl.formatMessage({ id: 'presentTool.steps.upload.failed' }), //'上传失败',
          }),
        );
        onError(
          new Error(res.message || intl.formatMessage({ id: 'presentTool.steps.upload.failed' })),
        );
      }
    } catch (error) {
      console.error('Upload error2:', error);
      onError(error);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <div className={styles.outlined_box}>
        <div className={`${styles.outlined_item} ${styles.mr_10}`} onClick={downloadTemplate}>
          <p className={styles.outlined_item_title}>
            {intl.formatMessage({ id: 'presentTool.steps.downloadTemplate' })}
          </p>
          <p className={styles.outlined_item_icon}>
            <DownloadOutlined style={{ fontSize: '50px', marginRight: 10 }} />
            {intl.formatMessage({ id: 'presentTool.steps.download' })}
          </p>
          {/* <UploadOutlined /> */}
          <p className={styles.outlined_item_tip}>
            {intl.formatMessage({ id: 'presentTool.steps.downloadTip' })}
          </p>
        </div>
        <RightCircleOutlined style={{ fontSize: '20px', color: '#666' }} />
        <Upload
          style={{ display: 'inline-block' }}
          className={`${styles.outlined_item} ${styles.ml_20}`}
          name="file"
          showUploadList={false}
          customRequest={customUpload}
          onChange={handleChange}
        >
          <div className={`${styles.outlined_item2} `}>
            <p className={styles.outlined_item_title}>
              {intl.formatMessage({ id: 'presentTool.steps.uploadFile' })}
            </p>
            <p className={styles.outlined_item_icon}>
              <UploadOutlined style={{ fontSize: '50px', marginRight: 10 }} />
              {intl.formatMessage({ id: 'presentTool.steps.upload' })}
            </p>
            <p className={styles.outlined_item_tip}>
              {intl.formatMessage({ id: 'presentTool.steps.uploadTip' })}
            </p>
          </div>
        </Upload>
      </div>
      <ul className={styles.mt_tipList}>
        <li>{intl.formatMessage({ id: 'presentTool.steps.tip' })}</li>
        <li>{intl.formatMessage({ id: 'presentTool.steps.tip1' })}</li>
        <li>{intl.formatMessage({ id: 'presentTool.steps.tip2' })}</li>
      </ul>
      <div className={styles.button_box}>
        <div>
          <Button key="cancel" onClick={onCancel} style={{ marginRight: 10 }}>
            {intl.formatMessage({ id: 'presentTool.button.cancel' })}
          </Button>
          <Button key="next" type={'primary'} onClick={handleNext} disabled={!steps1NextFlag}>
            {intl.formatMessage({ id: 'presentTool.button.next' })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkGiftSetp1;
