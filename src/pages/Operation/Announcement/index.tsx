import React, { useState, useRef } from 'react';
import { PageContainer,ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, message, Tabs, Select, DatePicker } from 'antd';
import {  PlusOutlined } from '@ant-design/icons';
import { 
  getAnnouncementList, 
} from '@/services/ant-design-pro/operation';
import AnnouncementForm from './components/AnnouncementForm';
import CategoryForm from './components/CategoryForm';

const { TabPane } = Tabs;


type AnnouncementItem = {
  id: string;
  description: string;
  title: string;
  category: string;
  sendTime: string;
  createTime: string;
  sendStatus: string;
  isTop?: boolean;
};

type CategoryItem = {
  id: string;
  name: string;
  description: string;
  sort: number;
  createTime: string;
};

const AnnouncementList: React.FC = () => {
  const [announcementFormVisible, setAnnouncementFormVisible] = useState<boolean>(false);
  const [categoryFormVisible, setCategoryFormVisible] = useState<boolean>(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<AnnouncementItem>();
  const [currentCategory, setCurrentCategory] = useState<CategoryItem>();
  const [formType, setFormType] = useState<'create' | 'update'>('create');
  const [activeTab, setActiveTab] = useState<string>('announcement');
  const [description, setDescription] = useState<string>('');
  const [sendStatus, setSendStatus] = useState<string>('all');
  const [sendTimeRange, setSendTimeRange] = useState<[string, string]>(['', '']);
  
  const announcementActionRef = useRef<ActionType>();
  const categoryActionRef = useRef<ActionType>();

  // 获取公告列表
  const fetchAnnouncementList = async (params: any) => {
    try {
      const { current, pageSize, description, sendStatus, sendTime } = params;
      
      // 处理时间范围
      let startTime, endTime;
      if (sendTime && sendTime.length === 2) {
        startTime = sendTime[0];
        endTime = sendTime[1];
      }
      
      const response = await getAnnouncementList({
        current,
        pageSize,
        description,
        sendStatus: sendStatus === 'all' ? undefined : sendStatus,
        startTime,
        endTime,
      });
      
      return {
        data: response.data || [],
        success: response.success,
        total: response.total || 0,
      };
    } catch (error) {
      message.error('获取公告列表失败');
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  // 获取分类列表
  const fetchCategoryList = async () => {
    try {
      // const response = await getCategoryList();
      // return {
      //   data: response.data || [],
      //   success: response.success,
      //   total: response.total || 0,
      // };
    } catch (error) {
      message.error('获取分类列表失败');
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  // 删除公告
  const handleRemoveAnnouncement = async (id: string) => {
    try {
      // const response = await deleteAnnouncement(id);
      // if (response.success) {
      //   message.success('删除成功');
      //   announcementActionRef.current?.reload();
      //   return true;
      // }
      // message.error('删除失败');
      // return false;
    } catch (error) {
      message.error('删除失败');
      return false;
    }
  };

  // 删除分类
  const handleRemoveCategory = async (id: string) => {
    try {
      // const response = await deleteCategory(id);
      // if (response.success) {
      //   message.success('删除成功');
      //   categoryActionRef.current?.reload();
      //   return true;
      // }
      // message.error('删除失败');
      // return false;
    } catch (error) {
      message.error('删除失败');
      return false;
    }
  };

  // 置顶公告
  const handleTop = async (id: string) => {
    try {
      // const response = await topAnnouncement(id);
      // if (response.success) {
      //   message.success('置顶成功');
      //   announcementActionRef.current?.reload();
      //   return true;
      // }
      // message.error('置顶失败');
      // return false;
    } catch (error) {
      message.error('置顶失败');
      return false;
    }
  };

  // 取消置顶
  const handleCancelTop = async (id: string) => {
    try {
      // const response = await cancelTopAnnouncement(id);
      // if (response.success) {
      //   message.success('取消置顶成功');
      //   announcementActionRef.current?.reload();
      //   return true;
      // }
      // message.error('取消置顶失败');
      // return false;
    } catch (error) {
      message.error('取消置顶失败');
      return false;
    }
  };

  // 公告表格列定义
  const announcementColumns: ProColumns<AnnouncementItem>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      search: false,
      width: 80,
    },
    {
      title: '描述',
      dataIndex: 'description',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入描述关键词',
          },
        ],
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      search: false,
    },
    {
      title: '分类',
      dataIndex: 'category',
      search: false,
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      valueType: 'dateTimeRange',
      search: {
        transform: (value) => {
          return {
            sendTime: value,
          };
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
      valueType: 'dateTime',
    },
    {
      title: '发送状态',
      dataIndex: 'sendStatus',
      valueEnum: {
        all: { text: '全部' },
        published: { text: '已发送', status: 'Success' },
        pending: { text: '待发布', status: 'Default' },
      },
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
            setCurrentAnnouncement(record);
            setFormType('update');
            setAnnouncementFormVisible(true);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            handleRemoveAnnouncement(record.id);
          }}
        >
          删除
        </a>,
        record.isTop ? (
          <a key="untop" onClick={() => handleCancelTop(record.id)}>
            置顶取消
          </a>
        ) : (
          <a key="top" onClick={() => handleTop(record.id)}>
            置顶
          </a>
        ),
      ],
    },
  ];

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
            handleRemoveCategory(record.id);
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  // 切换标签页
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <PageContainer>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="分类管理" key="category" />
        <TabPane tab="公告管理" key="announcement" />
      </Tabs>
      
      {activeTab === 'category' && (
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
        </>
      )}

      {activeTab === 'announcement' && (
        <>

          <ProTable<AnnouncementItem>
            headerTitle={false}
            actionRef={announcementActionRef}
            rowKey="id"
            search={{
              labelWidth: 'auto',
              defaultCollapsed: false,
            }}
            options={false}
            toolBarRender={() => [
              <Button key="menu">菜单管理</Button>,
              <Button
                type="primary"
                key="publish"
                onClick={() => {
                  setFormType('create');
                  setCurrentAnnouncement(undefined);
                  setAnnouncementFormVisible(true);
                }}
              >
                <PlusOutlined /> 发布公告
              </Button>,
            ]}
            request={fetchAnnouncementList}
            columns={announcementColumns}
            pagination={{
              pageSize: 10,
            }}
          />
        </>
      )}
      
      {/* 公告表单 */}
      <AnnouncementForm
        visible={announcementFormVisible}
        type={formType}
        values={currentAnnouncement}
        onCancel={() => setAnnouncementFormVisible(false)}
        onSuccess={() => {
          setAnnouncementFormVisible(false);
          announcementActionRef.current?.reload();
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
    </PageContainer>
  );
};

export default AnnouncementList; 