import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Upload, Button, message, Space, Modal, Form, Input, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { request } from 'umi';

const { Meta } = Card;

const PCImages: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchImages = async () => {
    setLoading(true);
    try {
      // 替换为实际的API请求
      const response = await request('/api/pc-images');
      const images = response.data || [];
      
      setFileList(images.map((img: any) => ({
        uid: img.id,
        name: img.title || '广告图',
        status: 'done',
        url: img.url,
        thumbUrl: img.url,
        linkUrl: img.linkUrl,
        title: img.title,
      })));
    } catch (error) {
      message.error('获取图片列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || 
                        file.type === 'image/png' || 
                        file.type === 'image/gif';
    if (!isJpgOrPng) {
      message.error('只支持JPG/PNG/GIF格式的图片');
    }
    
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能超过5MB');
    }
    
    return isJpgOrPng && isLt5M;
  };

  const handlePreview = (file: UploadFile) => {
    setPreviewImage(file.url || file.thumbUrl || '');
    setPreviewVisible(true);
  };

  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleEdit = (file: UploadFile) => {
    setCurrentImage(file);
    form.setFieldsValue({
      title: file.title,
      linkUrl: file.linkUrl,
    });
    setEditVisible(true);
  };

  const handleDelete = async (file: UploadFile) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这张图片吗？',
      onOk: async () => {
        try {
          // 替换为实际的API请求
          await request(`/api/pc-images/${file.uid}`, {
            method: 'DELETE',
          });
          message.success('删除成功');
          fetchImages();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleSubmitEdit = async () => {
    try {
      const values = await form.validateFields();
      
      // 替换为实际的API请求
      await request(`/api/pc-images/${currentImage.uid}`, {
        method: 'PUT',
        data: {
          ...values,
          id: currentImage.uid,
        },
      });
      
      message.success('更新成功');
      setEditVisible(false);
      fetchImages();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const customUploadRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // 替换为实际的API请求
      const response = await request('/api/pc-images/upload', {
        method: 'POST',
        data: formData,
      });
      
      message.success('上传成功');
      onSuccess(response, file);
      fetchImages();
    } catch (error) {
      message.error('上传失败');
      onError(error);
    }
  };

  return (
    <PageContainer>
      <div style={{ marginBottom: 16 }}>
        <p>提示：支持JPG/PNG/JPEG格式，大小不得超过5M，建议尺寸343*124，最大可配置5个</p>
      </div>
      
      <Row gutter={[16, 16]}>
        {fileList.map(file => (
          <Col xs={24} sm={12} md={8} lg={6} key={file.uid}>
            <Card
              hoverable
              cover={<img alt={file.name} src={file.url || file.thumbUrl} />}
              actions={[
                <a key="edit" onClick={() => handleEdit(file)}>编辑</a>,
                <a key="delete" onClick={() => handleDelete(file)}>删除</a>,
              ]}
            >
              <Meta title={file.title || '邀请好友'} description={file.linkUrl} />
            </Card>
          </Col>
        ))}
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Upload
            listType="picture-card"
            customRequest={customUploadRequest}
            beforeUpload={beforeUpload}
            onChange={handleUploadChange}
            showUploadList={false}
            disabled={fileList.length >= 5}
          >
            {fileList.length >= 5 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            )}
          </Upload>
        </Col>
      </Row>

      <Modal
        visible={previewVisible}
        title="预览图片"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>

      <Modal
        visible={editVisible}
        title="编辑图片信息"
        onOk={handleSubmitEdit}
        onCancel={() => setEditVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入图片标题' }]}
          >
            <Input placeholder="请输入图片标题" />
          </Form.Item>
          <Form.Item
            name="linkUrl"
            label="链接地址"
          >
            <Input placeholder="请输入链接地址(选填)" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default PCImages; 