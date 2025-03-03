import React, { useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Space, message, Modal, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { 
  getMediaList, 
  addMedia, 
  updateMedia, 
  deleteMedia, 
  MediaItem 
} from '@/services/ant-design-pro/operation';
import AvatarUpload from '@/components/AvatarUpload';


const MediaPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('添加媒体');
  const [currentItem, setCurrentItem] = useState<MediaItem | null>(null);
  const [form] = Form.useForm();
  const actionRef = React.useRef<ActionType>();

  // 打开添加媒体表单
  const handleAdd = () => {
    setModalTitle('添加媒体');
    setCurrentItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开编辑媒体表单
  const handleEdit = (record: MediaItem) => {
    setModalTitle('编辑媒体');
    setCurrentItem(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (currentItem) {
        // 更新媒体
        const res = await updateMedia({
          ...values,
          id: currentItem.id,
        });
        
        if (res.success) {
          message.success('更新成功');
          setModalVisible(false);
          actionRef.current?.reload();
        } else {
          message.error('更新失败');
        }
      } else {
        // 添加媒体
        const res = await addMedia(values);
        
        if (res.success) {
          message.success('添加成功');
          setModalVisible(false);
          actionRef.current?.reload();
        } else {
          message.error('添加失败');
        }
      }
    } catch (error) {
      console.error('表单提交出错:', error);
    }
  };

  // 删除媒体
  const handleDelete = (record: MediaItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除 ${record.name} 吗？`,
      onOk: async () => {
        try {
          const res = await deleteMedia(record.id);
          
          if (res.success) {
            message.success(`已删除: ${record.name}`);
            actionRef.current?.reload();
          } else {
            message.error('删除失败');
          }
        } catch (error) {
          console.error('删除出错:', error);
          message.error('删除出错');
        }
      }
    });
  };

  const columns: ProColumns<MediaItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      render: (text: string) => <img src={text} alt="图标" style={{ width: 32, height: 32 }} />
    },
    {
      title: '跳转链接',
      dataIndex: 'link',
      key: 'link',
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleDelete(record)}>删除</a>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<MediaItem>
        headerTitle="媒体列表"
        actionRef={actionRef}
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            onClick={handleAdd}
            icon={<PlusOutlined />}
          >
            添加
          </Button>,
        ]}
        request={async (params) => {
          const res = await getMediaList({
            current: params.current,
            pageSize: params.pageSize,
          });
          return {
            data: res.data,
            success: res.success,
            total: res.total,
          };
        }}
        columns={columns}
      />
      
      {/* 添加/编辑表单模态框 */}
      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={currentItem || {}}
        >
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入媒体名称' }]}
          >
            <Input placeholder="请输入媒体名称" />
          </Form.Item>
          <Form.Item
            name="icon"
            label="图标"
            rules={[{ required: true, message: '请上传图标' }]}
          >
            <AvatarUpload />
          </Form.Item>
          <Form.Item
            name="link"
            label="跳转链接"
            rules={[{ required: true, message: '请输入跳转链接' }]}
          >
            <Input placeholder="请输入跳转链接" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default MediaPage;
