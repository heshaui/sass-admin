import React, { useState, useEffect } from "react";
import { Upload, message, Image, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ossImgFile } from "@/services/ant-design-pro/api";

// 定义组件 props 接口
interface AvatarUploadProps {
  value?: string;
  onChange?: (value: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ value, onChange }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  
  // 当外部value变化时更新内部状态
  useEffect(() => {
    console.log('AvatarUpload value changed:', value);
    if (value) {
      setImageUrl(value);
    }
  }, [value]);

  // 处理上传成功后的回调
  const handleChange = (info: any) => {
    console.log('Upload status:', info.file.status);
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // 获取上传后的URL
      const url = info.file.response?.data || '';
      console.log('Upload success, new URL:', url);
      setImageUrl(url);
      if (onChange) {
        onChange(url);
      }
    }
  };

  console.log('Current imageUrl in render:', imageUrl);

  return (
    <Upload
      name="file"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="/tenant/v1/upload"
      onChange={handleChange}
    >
      {imageUrl ? (
        <Image 
          src={imageUrl} 
          alt="avatar" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          preview={false}
        />
      ) : (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>上传</div>
        </div>
      )}
    </Upload>
  );
};

export default AvatarUpload;