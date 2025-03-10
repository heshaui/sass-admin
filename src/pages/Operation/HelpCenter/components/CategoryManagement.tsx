import React, { useRef } from 'react';
import { Button } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';

// 分类管理数据接口
interface CategoryItem {
  id: number;
  description: string;
  parentCategory: string;
  path: string;
  createTime: string;
  order: number;
}

const CategoryManagement: React.FC = () => {
  const categoryActionRef = useRef<ActionType>();

  // 分类管理表格列定义
  const categoryColumns: ProColumns<CategoryItem>[] = [
    { title: 'ID', dataIndex: 'id', key: 'id', search: false },
    { 
      title: '描述', 
      dataIndex: 'description', 
      key: 'description',
      formItemProps: {
        label: '描述',
      },
    },
    { title: '上级分类', dataIndex: 'parentCategory', key: 'parentCategory', search: false },
    { title: '路径', dataIndex: 'path', key: 'path', search: false },
    { 
      title: '创建时间', 
      dataIndex: 'createTime', 
      key: 'createTime',
      valueType: 'dateTimeRange',
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    { title: '排序', dataIndex: 'order', key: 'order', search: false },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record) => [
        <Button type="link" key="edit">编辑</Button>,
      ],
    },
  ];

  // 模拟请求分类数据
  const fetchCategoryData = async (params: any) => {
    console.log('查询参数:', params);
    // 模拟异步请求
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: [
            { id: 333, description: '交易', parentCategory: '帮助中心', path: '帮助中心》交易', createTime: '2021-12-13 12:12:12', order: 1 },
            { id: 222, description: '场外交易', parentCategory: '交易', path: '帮助中心》交易》场外交易', createTime: '2021-12-13 12:12:12', order: 2 },
            { id: 111, description: '现货跟单', parentCategory: '现货交易', path: '帮助中心》交易》现货交易》现货跟单', createTime: '2021-12-13 12:12:12', order: 1 },
          ],
          total: 3,
          success: true,
        });
      }, 300);
    });
  };

  return (
    <ProTable<CategoryItem>
      headerTitle="分类列表"
      actionRef={categoryActionRef}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      toolBarRender={() => [
        <Button key="add" type="primary">
          添加分类
        </Button>,
      ]}
      request={fetchCategoryData}
      columns={categoryColumns}
      pagination={{
        showQuickJumper: true,
      }}
    />
  );
};

export default CategoryManagement; 