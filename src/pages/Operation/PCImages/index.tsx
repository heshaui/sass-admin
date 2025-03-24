import React, { useState, useEffect, useRef } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Space, Modal, Image } from 'antd';
import { getCarouselImageList, deleteCarouselImage, addCarouselImage, updateCarouselImage } from '@/services/ant-design-pro/operation';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import CarouselModal from './components/CarouselModal';
import LanguageSelector from '@/components/LanguageSelector';

const PCImages: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [language, setLanguage] = useState('en_US');

  const actionRef = useRef<ActionType>();
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    actionRef.current?.reload();
  }
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
        let data = {
          "isShow": 1,
          "sort": values.sort,
          "title": values.title,
          "carouselImageContents": values.languageEntries,
        }
        const res = await addCarouselImage(data);
        if(res.code === '0'){
          message.success('添加成功');
        }else{
          message.error(res.message);
        }
      } else {
        // 确保提交的编辑数据包含正确的结构
        const updateData = {
          id: currentRecord.id,
          isShow: values.isShow,
          sort: values.sort,
          carouselImageContents: values.languageEntries,
        };
        
        const res = await updateCarouselImage(updateData);
        if(res.code === '0'){
          message.success('更新成功');
        }else{
          message.error(res.message);
        }
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
          const res = await deleteCarouselImage(record.id);
          if(res.code === '0'){
            message.success('删除成功');
            actionRef.current?.reload();
          }else{
            message.error(res.message);
          }
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const columns: ProColumns<any>[] = [
    {
      title: '图片',
      dataIndex: ['carouselImageContents', 0, 'imageUrl'],
      key: 'imageUrl',
      search: false,
      render: (_, record: any) => (
        <Image 
          src={record.carouselImageContents?.[0]?.imageUrl || ''} 
          width={100} 
          height={100} 
        />
      ),
    },
    {
      title: '标题',
      dataIndex: ['carouselImageContents', 0, 'title'],
      key: 'title',
      search: false,
      render: (_, record) => record.carouselImageContents?.[0]?.title || '',
    },
    {
      title: '链接',
      dataIndex: ['carouselImageContents', 0, 'accessUrl'],
      key: 'accessUrl',
      search: false,
      render: (_, record) => record.carouselImageContents?.[0]?.accessUrl || '',
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
                <LanguageSelector value={language} onChange={handleLanguageChange} />

      <ProTable
        rowKey="id"
        actionRef={actionRef}
        headerTitle="个人中心广告图"
        search={false}
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
              languageCode: language,
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