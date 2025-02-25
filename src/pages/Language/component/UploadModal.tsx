import React from 'react';
import { Modal, message } from 'antd';
import FileUpload from '@/components/FileUpload';
import { updateEndpointInfo } from '@/services/ant-design-pro/WebConfig';

interface UploadModalProps {
  visible: boolean;
  onCancel: () => void;
  record: { id: number; langEncode: string };
  onSuccess: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ visible, onCancel, record, onSuccess }) => {
  const handleChange = async (response: any) => {
    console.log(response)
    // 直接处理响应数据
    if (response?.code === '0') {
      try {


        const data = {
          tenantLangId: record.id,
          langEncode: record.langEncode,
          fileUrl: response.data,
        };
        
        const updateRes = await updateEndpointInfo(data);

        if (updateRes.code === '0') {
          message.success('文件上传并更新成功');
          onSuccess();
          onCancel();
        } else {
          message.error(`更新失败: ${updateRes.message}`);
        }
      } catch (error) {
        message.error('更新信息失败，请重试');
      }
    } else {
      message.error(`上传失败: ${response?.message || '未知错误'}`);
    }
  };

  return (
    <Modal
      title="上传语言文件"
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