import React, { useState, useEffect, useRef } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Space, Modal, Image } from 'antd';
import { getCarouselImageList, deleteCarouselImage, addCarouselImage, updateCarouselImage } from '@/services/ant-design-pro/operation';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import CarouselModal from './components/CarouselModal';

const PCImages: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();

  // 显示创建模态框
  const showCreateModal = () => {
    setModalMode('create');
    setCurrentRecord(null);
    setModalVisible(true);
  };

  // 显示编辑模态框
  const showEditModal = (record: any) => {
    setModalMode('edit');
    setCurrentRecord(record);
    setModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setModalVisible(false);
  };

  // 处理提交
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (modalMode === 'create') {
        await addCarouselImage(values);
        message.success('添加成功');
      } else {
        await updateCarouselImage(values);
        message.success('更新成功');
      }
      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      message.error(modalMode === 'create' ? '添加失败' : '更新失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理删除
  const handleDelete = async (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这张图片吗？',
      onOk: async () => {
        try {
          await deleteCarouselImage(record.id);
          message.success('删除成功');
          actionRef.current?.reload();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const columns: ProColumns<any>[] = [
    {
      title: '图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (_, record: any) => (
        <Image src={record.imageUrl} width={100} height={100} />
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '链接',
      dataIndex: 'linkUrl',
      key: 'linkUrl',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <a key="edit" onClick={() => showEditModal(record)}>
          <EditOutlined /> 编辑
        </a>,
        <a key="delete" onClick={() => handleDelete(record)}>
          <DeleteOutlined /> 删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        actionRef={actionRef}
        headerTitle="轮播图列表"
        columns={columns}
        toolBarRender={() => [
          <Button type="primary" key="add" onClick={showCreateModal}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          try {
            const response = await getCarouselImageList({
              pageNo: params.current,
              pageSize: params.pageSize,
            });
            return {
              data: response.data || [],  
              success: true,
              total: response.total || response.data?.length || 0,
            };
          } catch (error) {
            message.error('获取图片列表失败');
            return {
              data: [],   
              success: false,
              total: 0,
            };
          }
        }}
      />

      <CarouselModal
        visible={modalVisible}
        mode={modalMode}
        initialValues={currentRecord}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
};

export default PCImages; 