import React, { useState } from "react";
import { Upload, message, Image, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ossImgFile } from "@/services/ant-design-pro/api";

// 定义组件 props 接口
interface AvatarUploaderProps {
  onChange?: (url: string | null) => void; // 回调函数，传递图片 URL
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ onChange }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // 上传前校验
  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("只能上传图片文件!");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  // 自定义上传方法
  const handleCustomRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await ossImgFile(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrl = response.data.data; // 假设返回的图片 URL 在 response.data.data 中
      setImageUrl(uploadedUrl);
      onChange?.(uploadedUrl); // 将 URL 传递给父组件
      onSuccess(response);
      message.success("图片上传成功");
    } catch (error) {
      onError(error);
      message.error("图片上传失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading} tip="上传中...">
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        customRequest={handleCustomRequest}
        beforeUpload={beforeUpload}
        disabled={loading}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="avatar"
            style={{ width: "100%", borderRadius: "50%" }}
            preview={{ visible: previewVisible, onVisibleChange: (visible) => setPreviewVisible(visible) }}
          />
        ) : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
          </div>
        )}
      </Upload>
    </Spin>
  );
};

export default AvatarUploader;