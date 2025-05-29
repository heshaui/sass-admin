import React from 'react';
import { Modal, message } from 'antd';
import FileUpload from '@/components/FileUpload';
import { updateEndpointInfo } from '@/services/ant-design-pro/WebConfig';
import { useIntl } from 'umi';

interface UploadModalProps {
  visible: boolean;
  onCancel: () => void;
  record: { id: number; langEncode: string };
  onSuccess: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ visible, onCancel, record, onSuccess }) => {
  const intl = useIntl();
  const handleChange = async (response: any) => {
    console.log(response)
    // 直接处理响应数据
    if (response?.code === '0') {
      try {


        const data = {
          tenantLangEndpointId: record.id,
          langEncode: record.langEncode,
          fileUrl: response.data.filePath,
          fileName:response.data.fileName
        };
        
        const updateRes = await updateEndpointInfo(data);

        if (updateRes.code === '0') {
          message.success(intl.formatMessage({ id: 'language.message.upload.success' }));
          onSuccess();
          onCancel();
        } else {
          message.error(intl.formatMessage({ id: 'language.message.update.failed.reason' }, { message: updateRes.message }));
        }
      } catch (error) {
        message.error(intl.formatMessage({ id: 'language.message.update.retry' }));
      }
    } else {
      message.error(intl.formatMessage({ id: 'language.message.upload.failed' }, { message: response?.message || intl.formatMessage({ id: 'language.message.unknown.error', defaultMessage: '未知错误' }) }));
    }
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'language.modal.upload.title' })}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <FileUpload
        accept=".xlsx,.xls"
        action="/api/language/upload"
        data={{ tenantId: 1007, langEncode: record.langEncode }}
        onChange={handleChange}
      />
    </Modal>
  );
};

export default UploadModal;