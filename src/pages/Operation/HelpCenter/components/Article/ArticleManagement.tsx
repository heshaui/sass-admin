import React, { useRef, useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { getHelpCenterArticleList, addHelpCenterArticle, updateHelpCenterArticle } from '@/services/ant-design-pro/operation';
import ArticlePublishModal from './ArticlePublishModal';


// 文章管理数据接口
interface ArticleItem {
  id: number;
  articleDescription: string;
  title: string;
  classId: string;
  publishTime: string;
  showType: number;
}

const ArticleManagement: React.FC = () => {
  const articleActionRef = useRef<ActionType>();
  const [publishModalVisible, setPublishModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<ArticleItem | null>(null);

  // 显示发布文章模态框
  const showPublishModal = () => {
    setIsEditing(false);
    setCurrentArticle(null);
    setPublishModalVisible(true);
  };

  // 显示编辑文章模态框
  const showEditModal = async (record: ArticleItem) => {
    try {
      // 获取文章详情数据
      // 假设有一个获取文章详情的API，如果没有，需要添加
      // const detailResponse = await getHelpCenterArticleDetail(record.id);
      // const detailData = detailResponse.data;
      
      // 临时使用现有数据，实际应该从API获取完整数据
      const articleDetail = {
        ...record,
        description: record.articleDescription,
        categoryId: record.classId,
        order: record.sort || 0,
        articles: [] // 这里应该从API获取文章内容详情
      };
      
      setIsEditing(true);
      setCurrentArticle(articleDetail);
      setPublishModalVisible(true);
    } catch (error) {
      message.error('获取文章详情失败');
    }
  };

  // 关闭发布文章模态框
  const closePublishModal = () => {
    setPublishModalVisible(false);
    setCurrentArticle(null);
  };

  // 处理文章发布或编辑
  const handlePublishArticle = async (values: any) => {
    try {
      let data = {
        "homeHelpCenterArticle": {
          "articleDescription": values.description,
          "sort": values.order,
          "classId": values.categoryId,
        },
        "homeHelpCenterArticleContents": values.articles
      }
      
      let res;
      if (isEditing && currentArticle) {
        // 编辑现有文章
        data.homeHelpCenterArticle.id = currentArticle.id;
        res = await updateHelpCenterArticle(data);
        if (res.code === '0' && res.data) {
          message.success('文章更新成功');
        } else {
          message.error('文章更新失败');
        }
      } else {
        // 新增文章
        res = await addHelpCenterArticle(data);
        if (res.code === '0' && res.data) {
          message.success('文章发布成功');
        } else {
          message.error('文章发布失败');
        }
      }
      
      closePublishModal();
      articleActionRef.current?.reload();
    } catch (error) {
      message.error(isEditing ? '文章更新失败' : '文章发布失败');
    }
  };

  // 切换文章状态
  const handleToggleStatus = async (id: number, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      // 这里应该调用切换状态的接口，暂时用message演示
      const res = await updateHelpCenterArticleStatus({id,showType:newStatus});
      if(res.code==='0'){
        message.success(`文章ID: ${id} 状态已更新为 ${newStatus ? '启用' : '禁用'}`);
        articleActionRef.current?.reload();
      }else{
        message.error('操作失败');
      }
      articleActionRef.current?.reload();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 封装获取文章数据的函数
  const fetchArticleData = async (params: any) => {
    const { current, pageSize, articleDescription, startTime, endTime } = params;
    try {
      // 使用getHelpCenterArticleList接口获取数据
      const response = await getHelpCenterArticleList({
        pageNo:current,
        pageSize,
        articleDescription,
        startTime:startTime? new Date(startTime).getTime():null,
        endTime:endTime?new Date(endTime).getTime():null,
      });
      return {
        data: response.data.list,
        success: response.code === '0' ? true : false,
        total: response.data.count,
      };
    } catch (error) {
      message.error('获取文章列表失败');
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  // 文章管理表格列定义
  const articleColumns: ProColumns<ArticleItem>[] = [
    { title: 'ID', dataIndex: 'id', key: 'id', search: false },
    { 
      title: '描述', 
      dataIndex: 'articleDescription', 
      key: 'articleDescription',
      formItemProps: {
        label: '描述',
      },
    },
    { title: '标题', dataIndex: 'title', key: 'title', search: false },
    { title: '分类', dataIndex: 'classId', key: 'classId', search: false },
    { 
      title: '发布时间', 
      dataIndex: 'publishTime', 
      key: 'publishTime',
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
    { 
      title: '状态', 
      dataIndex: 'showType', 
      key: 'showType',
      search: false,
      render: (_, record) => (
        <span>{record.showType === 1 ? '启用' : '禁用'}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record) => [
        <Button 
          type="link" 
          key="edit" 
          onClick={() => showEditModal(record)}
        >
          编辑
        </Button>,            
        <Button 
          type="link" 
          key="toggle"
          danger={record.showType === 1}
          onClick={() => handleToggleStatus(record.id, record.showType)}
        >
          {record.showType === 1 ? '启用' : '禁用'}
        </Button>,
      ],
    },
  ];

  return (
    <>
      <ProTable<ArticleItem>
        headerTitle="文章列表"
        actionRef={articleActionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        toolBarRender={() => [
          <Button key="publish" type="primary" onClick={showPublishModal}>
            发布文章
          </Button>,
        ]}
        request={fetchArticleData}
        columns={articleColumns}
        pagination={{
          showQuickJumper: true,
        }}
      />
      
      {/* 发布/编辑文章模态框 */}
      <ArticlePublishModal
        visible={publishModalVisible}
        onCancel={closePublishModal}
        onSubmit={handlePublishArticle}
        isEditing={isEditing}
        article={currentArticle}
      />
    </>
  );
};

export default ArticleManagement; 