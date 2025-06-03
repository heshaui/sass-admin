import React, { useState, useEffect } from "react";
import { Upload, message, Image, Button } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { ossImgFile } from "@/services/ant-design-pro/api";
import { useIntl } from 'umi';

// 定义组件 props 接口
interface AvatarUploadProps {
  value?: string;
  onChange?: (value: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ value, onChange }) => {
  const intl = useIntl();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isHovering, setIsHovering] = useState<boolean>(false);
  
  // 当外部value变化时更新内部状态
  useEffect(() => {
    if (value) {
      setImageUrl(value);
    } else {
      setImageUrl('');
    }
  }, [value]);

  // 自定义文件上传方法
  const customUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    
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
        message.success(intl.formatMessage({ id: 'component.avatarUpload.uploadSuccess', defaultMessage: '上传成功' }));
      } else {
        message.error(intl.formatMessage({ id: 'component.avatarUpload.uploadFailed', defaultMessage: '上传失败' }));
        onError(new Error('上传失败'));
      }
    } catch (error) {
      onError(error);
    }
  };

  // 处理上传成功后的回调
  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      // 上传成功的处理已在customUpload中完成
    }
  };

  // 处理删除图片
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发Upload点击事件
    setImageUrl('');
    if (onChange) {
      onChange('');
    }
  };

  // 处理预览点击事件
  const handlePreview = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发Upload点击事件
  };

  // 渲染上传按钮
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>
        {intl.formatMessage({ id: 'component.avatarUpload.upload', defaultMessage: '上传' })}
      </div>
    </div>
  );

  return (
    <div className="avatar-upload-container" style={{ display: 'inline-block' }}>
      {imageUrl ? (
        <div 
          className="avatar-wrapper" 
          style={{ 
            position: 'relative', 
            width: '104px', 
            height: '104px', 
            overflow: 'hidden', 
            border: '1px dashed #d9d9d9', 
            borderRadius: '8px' 
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div onClick={handlePreview}>
            <Image 
              src={imageUrl} 
              alt="avatar" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
              preview={{ 
                src: imageUrl,
              }}
            />
          </div>
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
        <Upload
          name="file"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          customRequest={customUpload}
          onChange={handleChange}
        >
          {uploadButton}
        </Upload>
      )}
    </div>
  );
};

export default AvatarUpload;