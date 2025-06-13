import { getCoinGiftCheckImport, getCoinGiftTemplate } from '@/services/ant-design-pro/fundsTools';
import { DownloadOutlined, RightCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import { message, Upload } from 'antd';
import React, { useEffect } from 'react';
import styles from './styles/gift.module.less';

// const { Option } = Select;

interface BulkGiftProps {
  type: string;
  setps1Next: () => void;
}

const BulkGiftSetp1: React.FC<BulkGiftProps> = ({ type, setps1Next }) => {
  const intl = useIntl();
  // const [form] = Form.useForm();
  // const [typeList, setTypeList] = useState<SelectProps['options']>([]);
  const downloadTemplate = async () => {
    try {
      // 直接获取blob数据
      const blob = await getCoinGiftTemplate();

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
      setps1Next();
      // 上传成功的处理已在customUpload中完成
    }
  };
  // 自定义文件上传方法
  const customUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await getCoinGiftCheckImport(
        { file: file, type: type },
        //  {headers: { "Content-Type": "multipart/form-data" }, }
      );
      if (res.code === '0') {
        // const url = res.data.data || '';

        onSuccess(res, file);
        message.success(
          intl.formatMessage({
            id: 'presentTool.steps.upload.success',
            defaultMessage: '上传成功',
          }),
        );
      } else {
        message.error(
          intl.formatMessage({
            id: 'presentTool.steps.upload.failed',
            defaultMessage: '上传失败',
          }),
        );
        onError(new Error('上传失败'));
      }
    } catch (error) {
      onError(error);
    }
  };

  useEffect(() => {}, []);

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
    </div>
  );
};

export default BulkGiftSetp1;
