import React, { useState, useRef } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { 
  getAnnouncementList, getAnnouncementContentList, updateAnnouncement
} from '@/services/ant-design-pro/operation';
import AnnouncementForm from './AnnouncementForm';

type AnnouncementItem = {
  id: string;
  description: string;
  title: string;
  category: string;
  sendTime: string;
  createTime: string;
  sendStatus: string;
  isTop?: boolean;
  languageCode: string;
  onTop: number;
  releaseTime: string;
  describeText: string;
  classMenu: string;
  status: number;
};

const AnnouncementManagement: React.FC = () => {
  const [announcementFormVisible, setAnnouncementFormVisible] = useState<boolean>(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<AnnouncementItem>();
  const [formType, setFormType] = useState<'create' | 'update'>('create');
  
  const announcementActionRef = useRef<ActionType>();

  // 获取公告列表
  const fetchAnnouncementList = async (params: any) => {
    try {
      const { current, pageSize, description, status, sendTime, languageCode } = params;
      
      // 处理时间范围
      let startTime, endTime;
      if (sendTime && sendTime.length === 2) {
        startTime = sendTime[0];
        endTime = sendTime[1];
      }
      
      // 获取内容列表（包含标题）
      const contentResponse = await getAnnouncementContentList({
        current,
        pageSize,
        describeText: description,
        languageCode: languageCode || 'en_US',
        status: status,
        startTime,
        endTime,
      });
      
      // 获取公告基础信息
      const announcementResponse = await getAnnouncementList({
        current,
        pageSize,
        describeText: description,
        languageCode: languageCode || 'en_US',
        status: status,
        startTime,
        endTime,
      });
      
      // 确保基础列表存在
      if (!announcementResponse.data || !announcementResponse.data.list) {
        return {
          data: [],
          success: false,
          total: 0,
        };
      }
      
      // 创建内容ID到标题的映射
      const contentTitleMap = {};
      if (contentResponse.data && contentResponse.data.list) {
        contentResponse.data.list.forEach(item => {
          if (item.announcementId && item.title) {
            contentTitleMap[item.announcementId] = item.title;
          }
        });
      }
      
      // 合并数据，使用内容接口的标题
      const mergedList = announcementResponse.data.list.map(announcement => {
        return {
          ...announcement,
          title: contentTitleMap[announcement.id] || announcement.title || '-',
        };
      });
      
      return {
        data: mergedList || [],
        success: announcementResponse.success,
        total: announcementResponse.count || 0,
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

  // 删除公告
  const handleRemoveAnnouncement = async (id: string) => {
    try {
      let data={
        id:id,
        remove:1
      }
      const response = await updateAnnouncement(data);
      if (response.code==='0'&&response.data) {
        message.success('删除成功');
        announcementActionRef.current?.reload();
        return true;
      }
    } catch (error) {
      message.error('删除失败');
      return false;
    }
  };

  // 置顶公告
  const handleTop = async (id: number, handleTop: number) => {
    try {
      let data={
        id:id,
        onTop:handleTop===1?0:1
      }
      const response = await updateAnnouncement(data);
      if (response.code==='0'&&response.data) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        handleTop===1?message.success('取消置顶成功'):message.success('置顶成功');
        announcementActionRef.current?.reload();
        return true;
      }
    } catch (error) {
      message.error('置顶失败');
      return false;
    }
  };

  // 编辑公告前的处理
  const handleEditAnnouncement = (record: AnnouncementItem) => {
    // 确保日期字段是有效的，防止传递无效日期到表单组件
    const processedRecord = {
      ...record,
      // 如果有日期相关字段，可以在这里预处理
      releaseTime: record.releaseTime || undefined,
      createTime: record.createTime || undefined
    };
    
    setCurrentAnnouncement(processedRecord);
    setFormType('update');
    setAnnouncementFormVisible(true);
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
      dataIndex: 'describeText',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '请输入描述关键词',
          },
        ],
      },
      search: {
        transform: (value) => {
          return {
            description: value,
          };
        },
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      search: false,
    },
    {
      title: '分类',
      dataIndex: 'classMenu',
      search: false,
    },
    {
      title: '发送时间',
      dataIndex: 'releaseTime',
      valueType: 'dateTime',
      search: {
        transform: (value) => {
          // 确保日期值是有效的
          if (Array.isArray(value) && value.length === 2) {
            return {
              sendTime: value.filter(v => v),
            };
          }
          return { sendTime: value };
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
      dataIndex: 'status',
      valueEnum: {
        all: { text: '全部' },
        published: { text: '已发送', status: 'Success' },
        pending: { text: '待发布', status: 'Default' },
      },
      renderText: (text) => {
        return text === 0 ? '待发布' : text === 1 ? '已发送' : '待发布';
      },
      search: {
        transform: (value) => {
          return {
            sendStatus: value === 'all' ? undefined : value,
          };
        },
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
            handleEditAnnouncement(record);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: '确认删除',
              content: '确认删除后，前台将不显示该公告',
              okText: '确认',
              cancelText: '取消',
              onOk: () => handleRemoveAnnouncement(record.id),
            });
          }}
        >
          删除
        </a>,
        record.onTop===1 ? (
          <a key="untop" onClick={() => handleTop(record.id,record.onTop)}>
            置顶取消
          </a>
        ) : (
          <a key="top" onClick={() => handleTop(record.id,record.onTop)}>
            置顶
          </a>
        ),
      ],
    },
  ];

  return (
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
    </>
  );
};

export default AnnouncementManagement; 