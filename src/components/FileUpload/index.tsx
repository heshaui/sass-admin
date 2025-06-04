import React, { useState } from "react";
import { Upload, message, Spin } from "antd";
import { PlusOutlined, FileOutlined } from "@ant-design/icons";
import { uploadFile } from "@/services/ant-design-pro/api";
import { useIntl } from '@umijs/max';

// Define component props interface
interface FileUploaderProps {
  onChange?: (url: string | null) => void; // Callback function to pass file URL
}

const FileUploader: React.FC<FileUploaderProps> = ({ onChange }) => {
  const intl = useIntl();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Optional: Add file validation if needed
  const beforeUpload = (file: File) => {
    // You can add size limit or specific file type restrictions here
    const isLt10M = file.size / 1024 / 1024 < 10; // Example: 10MB limit
    if (!isLt10M) {
      message.error(intl.formatMessage({ id: 'component.fileUpload.fileSizeLimit' }));
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  // Custom upload handler
  const handleCustomRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadFile(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrl = response.data.data; // Assuming the file URL is in response.data.data
      setFileUrl(uploadedUrl);
      setFileName(file.name); // Store original file name
      onChange?.(response); // Pass URL to parent component
      onSuccess(response);
      message.success(intl.formatMessage({ id: 'component.fileUpload.uploadSuccess' }));
    } catch (error) {
      onError(error);
      message.error(intl.formatMessage({ id: 'component.fileUpload.uploadFailed' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading} tip={intl.formatMessage({ id: 'component.fileUpload.uploading' })}>
      <Upload
        name="file"
        listType="picture-card"
        className="file-uploader"
        showUploadList={false}
        customRequest={handleCustomRequest}
        beforeUpload={beforeUpload}
        disabled={loading}
      >
        {fileUrl ? (
          <div style={{ textAlign: "center" }}>
            <FileOutlined style={{ fontSize: "24px" }} />
            <div style={{ marginTop: 8, wordBreak: "break-all" }}>
              {fileName}
            </div>
          </div>
        ) : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>{intl.formatMessage({ id: 'component.fileUpload.uploadFile' })}</div>
          </div>
        )}
      </Upload>
    </Spin>
  );
};

export default FileUploader;