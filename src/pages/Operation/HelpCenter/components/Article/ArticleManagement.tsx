import React, { useRef, useState } from 'react';
import { Button, message } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { getHelpCenterArticleList,addHelpCenterArticle} from '@/services/ant-design-pro/operation';
import ArticlePublishModal from './ArticlePublishModal';


// 文章管理数据接口
interface ArticleItem {
  id: number;
  description: string;
  title: string;
  category: string;
  publishTime: string;
  status: number;
}

const ArticleManagement: React.FC = () => {
  const articleActionRef = useRef<ActionType>();
  const [publishModalVisible, setPublishModalVisible] = useState(false);

  // 显示发布文章模态框
  const showPublishModal = () => {
    setPublishModalVisible(true);
  };

  // 关闭发布文章模态框
  const closePublishModal = () => {
    setPublishModalVisible(false);
  };

  // 处理文章发布
  const handlePublishArticle = async (values: any) => {
    try {
      let data={
          "homeHelpCenterArticle": {
              "articleDescription": "前斗机该听王认采铁。现子今导要与级省效。",
              "sort": 1,
              "showType": 0,

          },
          "homeHelpCenterArticleContents": [
              {
                  "languageCode": "en_US",
                  "articleTitle": "托一道关于全大方而背焚那",
                  "articleContent": "nisi laboris exercitation aliqua",
              },
           
          ]
      
      }
      const res = await addHelpCenterArticle(data);
      if (res.code === '0') {
        message.success('文章发布成功');
        closePublishModal();
      } else {
        message.error('文章发布失败');
      }
    } catch (error) {
      message.error('文章发布失败');
    }
  };

  // 切换文章状态
  const handleToggleStatus = async (id: number, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      // 这里应该调用切换状态的接口，暂时用message演示
      message.success(`文章ID: ${id} 状态已更新为 ${newStatus ? '启用' : '禁用'}`);
      articleActionRef.current?.reload();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 封装获取文章数据的函数
  const fetchArticleData = async (params: any) => {
    const { current, pageSize, description, startTime, endTime } = params;
    try {
      // 使用getHelpCenterArticleList接口获取数据
      const response = await getHelpCenterArticleList({
        current,
        pageSize,
        description,
        startTime,
        endTime,
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
      dataIndex: 'status', 
      key: 'status',
      search: false,
      render: (_, record) => (
        <span>{record.status === 1 ? '启用' : '禁用'}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record) => [
        <Button type="link" key="edit">编辑</Button>,
        <Button 
          type="link" 
          key="toggle"
          danger={record.status === 1}
          onClick={() => handleToggleStatus(record.id, record.status)}
        >
          {record.status === 1 ? '禁用' : '启用'}
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
      
      {/* 发布文章模态框 */}
      <ArticlePublishModal
        visible={publishModalVisible}
        onCancel={closePublishModal}
        onSubmit={handlePublishArticle}
      />
    </>
  );
};

export default ArticleManagement; 