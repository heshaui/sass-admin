import React, { useState, useRef } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, message, Modal } from 'antd';
import { updateAnnouncement,getClassMenuList } from '@/services/ant-design-pro/operation';
import CategoryForm from './CategoryForm';

type CategoryItem = {
  id: string;
  name: string;
  description: string;
  sort: number;
  createTime: string;
};

const CategoryManagement: React.FC = () => {
  const [categoryFormVisible, setCategoryFormVisible] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<CategoryItem>();
  const [formType, setFormType] = useState<'create' | 'update'>('create');
  
  const categoryActionRef = useRef<ActionType>();

  // 获取分类列表
  const fetchCategoryList = async () => {
    try {
        let data={
            pageNo:1,
            pageSize:10
        }
      const response = await getClassMenuList(data);
      return {
        data: response.data.list|| [],
        success: response.code==='0'?true:false,
        total: response.data.count || 0,
      };
      
    
    } catch (error) {
      message.error('获取分类列表失败');
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  // 删除分类
  const handleRemoveCategory = async (id: string) => {
    try {
      let data={
        id:id,
        remove:1
      }
      const response = await updateAnnouncement(data);
      if (response.code==='0') {
        message.success('删除成功');
        categoryActionRef.current?.reload();
        return true;
      }
    } catch (error) {
      message.error('删除失败');
      return false;
    }
  };

  // 分类表格列定义
  const categoryColumns: ProColumns<CategoryItem>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      search: false,
      width: 80,
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType:'dateTime'
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      search: false,
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setCurrentCategory(record);
            setFormType('update');
            setCategoryFormVisible(true);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: '确认删除',
              content: '您确定要删除这个分类吗？',
              okText: '确认',
              cancelText: '取消',
              onOk: () => handleRemoveCategory(record.id),
            });
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <>
      <ProTable<CategoryItem>
        headerTitle={false}
        actionRef={categoryActionRef}
        rowKey="id"
        request={fetchCategoryList}
        columns={categoryColumns}
        toolbar={[
          <Button key="add" type="primary" onClick={() => {
            setFormType('create');
            setCurrentCategory(undefined);
            setCategoryFormVisible(true);
          }}>
            添加分类
          </Button>
        ]}
        pagination={{
          pageSize: 10,
        }}
      />

      {/* 分类表单 */}
      <CategoryForm
        visible={categoryFormVisible}
        type={formType}
        values={currentCategory}
        onCancel={() => setCategoryFormVisible(false)}
        onSuccess={() => {
          setCategoryFormVisible(false);
          categoryActionRef.current?.reload();
        }}
      />
    </>
  );
};

export default CategoryManagement; 