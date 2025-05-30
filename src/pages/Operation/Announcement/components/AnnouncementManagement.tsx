import React, { useState, useRef } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import { 
  getAnnouncementList, getAnnouncementContentList, updateAnnouncement, addClassMenu
} from '@/services/ant-design-pro/operation';
import AnnouncementForm from './AnnouncementForm';
import CategoryForm from './CategoryForm';
import dayjs from 'dayjs'

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
  const intl = useIntl();
  const [announcementFormVisible, setAnnouncementFormVisible] = useState<boolean>(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<AnnouncementItem>();
  const [formType, setFormType] = useState<'create' | 'update'>('create');
  const [categoryFormVisible, setCategoryFormVisible] = useState<boolean>(false);
  const announcementActionRef = useRef<ActionType>();
  const [currentCategory, setCurrentCategory] = useState<CategoryItem>();

  const handleCategoryFormSuccess = async (formValues: Record<string, any>) => {
    try {
      

       
       const  response = await addClassMenu(formValues);
       if(response.code==='0'&&response.data){
        message.success(intl.formatMessage({ id: 'announcement.category.create.success', defaultMessage: '创建成功' }));
        setCategoryFormVisible(false);
       }else{
        message.error(intl.formatMessage({ id: 'announcement.category.create.failed', defaultMessage: '创建失败' }));
       }
      
    } catch (error) {
      message.error(intl.formatMessage({ id: 'announcement.category.operation.failed', defaultMessage: '操作失败' }));
    } finally {

    }
  };

  // 获取公告列表
  const fetchAnnouncementList = async (params: any) => {
    try {
      const { current, pageSize, description, status, sendTime, languageCode } = params;
      
      // 处理时间范围
      let startTime, endTime;
      if (sendTime && sendTime.length === 2) {
        startTime = dayjs(sendTime[0]).valueOf();
        endTime = dayjs(sendTime[1]).valueOf();
      }
      
      // 获取内容列表（包含标题）
      const contentResponse = await getAnnouncementContentList({
        pageNo:current,
        pageSize,
        describeText: description,
        languageCode: languageCode || 'en_US',
        status: status,
        startTime,
        endTime,
      });
      
      // 获取公告基础信息
      const announcementResponse = await getAnnouncementList({
        pageNo:current,
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
      message.error(intl.formatMessage({ id: 'announcement.management.list.failed', defaultMessage: '获取公告列表失败' }));
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
        message.success(intl.formatMessage({ id: 'announcement.management.delete.success', defaultMessage: '删除成功' }));
        announcementActionRef.current?.reload();
        return true;
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'announcement.management.delete.failed', defaultMessage: '删除失败' }));
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
        handleTop===1
          ? message.success(intl.formatMessage({ id: 'announcement.management.untop.success', defaultMessage: '取消置顶成功' }))
          : message.success(intl.formatMessage({ id: 'announcement.management.top.success', defaultMessage: '置顶成功' }));
        announcementActionRef.current?.reload();
        return true;
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'announcement.management.top.failed', defaultMessage: '置顶失败' }));
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
      title: intl.formatMessage({ id: 'announcement.management.column.id', defaultMessage: '序号' }),
      dataIndex: 'id',
      search: false,
      width: 80,
    },
    {
      title: intl.formatMessage({ id: 'announcement.management.column.description', defaultMessage: '描述' }),
      dataIndex: 'describeText',
      formItemProps: {
        rules: [
          {
            required: true,
            message: intl.formatMessage({ id: 'announcement.management.description.required', defaultMessage: '请输入描述关键词' }),
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
      title: intl.formatMessage({ id: 'announcement.management.column.title',  }),
      dataIndex: 'title',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'announcement.management.column.category', }),
      dataIndex: 'classMenu',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'announcement.management.column.sendTime',  }),
      dataIndex: 'releaseTime',
      valueType: 'dateTime',
      search:false
    },
    {
      title: intl.formatMessage({ id: 'announcement.management.column.sendTime',  }),
      dataIndex: 'releaseTime',
      valueType: 'dateTimeRange',
      hideInTable: true,
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
      title: intl.formatMessage({ id: 'announcement.management.column.createTime', defaultMessage: '创建时间' }),
      dataIndex: 'createTime',
      search: false,
      valueType: 'dateTime',
    },
    {
      title: intl.formatMessage({ id: 'announcement.management.column.status', defaultMessage: '发送状态' }),
      dataIndex: 'status',
      valueEnum: {
        1: { text: intl.formatMessage({ id: 'announcement.management.status.sent', defaultMessage: '已发送' }), status: 'Success' },
        0: { text: intl.formatMessage({ id: 'announcement.management.status.pending', defaultMessage: '待发布' }), status: 'Default' },
      },
      renderText: (text) => {
        return text === 0 
          ? intl.formatMessage({ id: 'announcement.management.status.pending', defaultMessage: '待发布' }) 
          : text === 1 
            ? intl.formatMessage({ id: 'announcement.management.status.sent', defaultMessage: '已发送' }) 
            : intl.formatMessage({ id: 'announcement.management.status.pending', defaultMessage: '待发布' });
      },
      search: {
        transform: (value) => {
          return {
            sendStatus: value === 0 ? undefined : value,
          };
        },
      },
    },
    {
      title: intl.formatMessage({ id: 'announcement.management.column.action', defaultMessage: '操作' }),
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
          {intl.formatMessage({ id: 'announcement.management.action.edit', defaultMessage: '编辑' })}
        </a>,
        <a
          key="delete"
          onClick={() => {
            Modal.confirm({
              title: intl.formatMessage({ id: 'announcement.management.delete.confirm.title', defaultMessage: '确认删除' }),
              content: intl.formatMessage({ id: 'announcement.management.delete.confirm.content', defaultMessage: '确认删除后，前台将不显示该公告' }),
              okText: intl.formatMessage({ id: 'announcement.management.delete.confirm.ok', defaultMessage: '确认' }),
              cancelText: intl.formatMessage({ id: 'announcement.management.delete.confirm.cancel', defaultMessage: '取消' }),
              onOk: () => handleRemoveAnnouncement(record.id),
            });
          }}
        >
          {intl.formatMessage({ id: 'announcement.management.action.delete', defaultMessage: '删除' })}
        </a>,
        record.onTop===1 ? (
          <a key="untop" onClick={() => handleTop(record.id,record.onTop)}>
            {intl.formatMessage({ id: 'announcement.management.action.untop', defaultMessage: '置顶取消' })}
          </a>
        ) : (
          <a key="top" onClick={() => handleTop(record.id,record.onTop)}>
            {intl.formatMessage({ id: 'announcement.management.action.top', defaultMessage: '置顶' })}
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
          <Button key="menu" onClick={() => {setCategoryFormVisible(true); setFormType('create');}}>
            {intl.formatMessage({ id: 'announcement.management.button.menu', defaultMessage: '菜单管理' })}
          </Button>,
          <Button
            type="primary"
            key="publish"
            onClick={() => {
              setFormType('create');
              setCurrentAnnouncement(undefined);
              setAnnouncementFormVisible(true);
            }}
          >
            <PlusOutlined /> {intl.formatMessage({ id: 'announcement.management.button.publish', defaultMessage: '发布公告' })}
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
       <CategoryForm
        visible={categoryFormVisible}
        type={formType}
        values={currentCategory}
        onCancel={() => setCategoryFormVisible(false)}
        onSuccess={handleCategoryFormSuccess}
      />
    </>
  );
};

export default AnnouncementManagement;