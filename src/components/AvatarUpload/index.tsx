import React, { useState, useEffect } from "react";
import { Upload, message, Image, Spin, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { ossImgFile } from "@/services/ant-design-pro/api";

// 定义组件 props 接口
interface AvatarUploadProps {
  value?: string;
  onChange?: (value: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ value, onChange }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  
  // 当外部value变化时更新内部状态
  useEffect(() => {
    console.log('AvatarUpload value changed:', value);
    if (value) {
      setImageUrl(value);
    }else{
      setImageUrl('');
    }
  }, [value]);

  // 自定义文件上传方法
  const customUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await ossImgFile(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.code === '0') {
        const url = res.data.data || '';
        setImageUrl(url);
        if (onChange) {
          onChange(url);
        }
        onSuccess(res, file);
        message.success('上传成功');
      } else {
        message.error('上传失败');
        onError(new Error('上传失败'));
      }
    } catch (error) {

      onError(error);
    } finally {
      setLoading(false);
    }
  };

  // 处理上传成功后的回调
  const handleChange = (info: any) => {
    console.log('Upload status:', info.file.status);
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      console.log('Upload success, new URL:', info.file.response?.data || '');
    }
  };

  // 处理删除图片
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发Upload点击事件
    setImageUrl('');
    if (onChange) {
      onChange('');
    }
  };

  console.log('Current imageUrl in render:', imageUrl);

  return (
    <Upload
      name="file"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      customRequest={customUpload}
      onChange={handleChange}
    >
      {loading ? (
        <Spin />
      ) : imageUrl ? (
        <div 
          className="avatar-wrapper" 
          style={{ position: 'relative', width: '100%', height: '100%' }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Image 
            src={imageUrl} 
            alt="avatar" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            preview={false}
          />
          {isHovering && (
            <Button 
              type="primary" 
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={handleDelete}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                opacity: 0.8,
              }}
            />
          )}
        </div>
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