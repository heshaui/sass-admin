import React, { useRef, useState } from 'react';
import { useIntl } from 'umi';
import { Button, message, Popconfirm, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { getHelpCenterClassList,addHelpCenterClass,updateHelpCenterClass,updateHelpCenterClassContent} from '@/services/ant-design-pro/operation';
import type { HelpCenterClassItem } from '@/services/ant-design-pro/operation';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import CategoryFormModal from './CategoryFormModal';

// 定义API响应类型
interface ApiResponse {
  code: string;
  message?: string;
  success: boolean;
  data: HelpCenterClassItem[] | HelpCenterClassItem;
}

// 定义分类提交数据类型
interface CategorySubmitData {
  homeHelpCenterClass: {
    type: any;
    helpDescription: any;
    helpSort: any;
    blackIcon: any;
    whiteIcon: any;
    parentId: any;
    showType: any;
    id?: number;
    name?: string;
    status?: number;
  };
  homeHelpCenterClassContents: any;
}

const CategoryManagement: React.FC = () => {
  const intl = useIntl();
  const [visible, setVisible] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<HelpCenterClassItem | undefined>(undefined);
  const actionRef = useRef<ActionType>();
  
  // 编辑分类
  const handleEdit = (record: HelpCenterClassItem) => {
    setCurrentCategory(record);
    setVisible(true);
  };

  // 添加分类
  const handleAdd = () => {
    setCurrentCategory(undefined);
    setVisible(true);
  };

  // 删除分类
  const handleDelete = async (id: string) => {
    try {
      // 实现删除逻辑
      // await deleteHelpCenterClass(id);
      // message.success(intl.formatMessage({ id: 'helpCenter.category.message.deleteSuccess' }));
      
      // // 删除成功后刷新表格
      // if (actionRef.current) {
      //   actionRef.current.reload();
      // }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'helpCenter.category.message.deleteError' }));
      console.error('删除失败:', error);
    }
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {  
      const { languages, ...restValues } = values;
      console.log('父组件接收到的多语言数据:', languages); // 调试用
      
      if (languages.length === 0) {
        message.error(intl.formatMessage({ id: 'helpCenter.category.message.languageRequired' }));
        return;
      }
      
      // 构建提交数据
      const languageContents = languages.map((item: any) => ({
        languageCode: item.languageCode,
        articleTitle: item.articleTitle
      }));
      
      if (!values.id) {
        // 新增分类
        const submitData: CategorySubmitData = {
          "homeHelpCenterClass": {
            "type": restValues.type,
            "helpDescription": restValues.helpDescription,
            "helpSort": restValues.helpSort,
            "blackIcon": restValues.blackIcon,
            "whiteIcon": restValues.whiteIcon,
            "parentId": restValues.parentId,
            "showType": 1,
            "name": languageContents[0]?.articleTitle || '',
            "status": 1
          },
          "homeHelpCenterClassContents": languageContents
        };
        
        const res = await addHelpCenterClass(submitData) as ApiResponse;
        if (res.code === '0') {
          message.success(intl.formatMessage({ id: 'helpCenter.category.message.addSuccess' }));
          setVisible(false);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        } else {
          message.error(intl.formatMessage({ id: 'helpCenter.category.message.addError' }, { message: res.message || '' }));
        }
      } else {
        // 编辑分类
        const updateData = {
          id: values.id,
          type: restValues.type,
          helpDescription: restValues.helpDescription,
          helpSort: restValues.helpSort,
          blackIcon: restValues.blackIcon,
          whiteIcon: restValues.whiteIcon,
          parentId: restValues.parentId,
          showType: 1,
          name: languageContents[0]?.articleTitle || '',
          status: 1
        };

        const res = await updateHelpCenterClass(updateData) as ApiResponse;
        
        // 更新多语言内容
        const contentData = {
          classId: values.id,
          contents: languageContents
        };
        
        const resContent = await updateHelpCenterClassContent(contentData) as ApiResponse;
        
        if (res.code === '0' && resContent.code === '0') {
          message.success(intl.formatMessage({ id: 'helpCenter.category.message.editSuccess' }));
          setVisible(false);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        } else {
          message.error(intl.formatMessage({ id: 'helpCenter.category.message.editError' }, { message: res.message || '' }));
        }
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'helpCenter.category.message.operationError' }));
      console.error('提交表单失败:', error);
    }
  };

  // ProTable 的列定义
  const columns: ProColumns<HelpCenterClassItem>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'helpCenter.category.column.type' }),
      dataIndex: 'type',
      key: 'type',
      valueType: 'select',
      fieldProps: {
        options: [
          { value: 1, label: intl.formatMessage({ id: 'helpCenter.category.type.menu' }) },
          { value: 2, label: intl.formatMessage({ id: 'helpCenter.category.type.category' }) },
        ],
      },
    },
    {
      title: intl.formatMessage({ id: 'helpCenter.category.column.description' }),
      dataIndex: 'helpDescription',
      key: 'helpDescription',
    },
    {
      title: intl.formatMessage({ id: 'helpCenter.category.column.parentCategory' }),
      dataIndex: 'parentId',
      key: 'parentId',
    },
    {
      title: intl.formatMessage({ id: 'helpCenter.category.column.path' }),
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: intl.formatMessage({ id: 'helpCenter.category.column.createTime' }),
      dataIndex: 'createTime',
      key: 'createTime',
      valueType:'dateTime'
    },
    {
      title: intl.formatMessage({ id: 'helpCenter.category.column.sort' }),
      dataIndex: 'helpSort',
      key: 'helpSort',
    },
    
    {
      title: intl.formatMessage({ id: 'helpCenter.category.column.action' }),
      key: 'action',
      valueType: 'option',
      render: (_, record) => [
        <a key="edit" onClick={() => handleEdit(record)}>{intl.formatMessage({ id: 'helpCenter.category.action.edit' })}</a>,
        // <Popconfirm
        //   key="delete"
        //   title="确定要删除此分类吗？"
        //   onConfirm={() => handleDelete(record.id)}
        //   okText="确定"
        //   cancelText="取消"
        // >
        //   <a>删除</a>
        // </Popconfirm>,
      ],
    },
  ];

  return (
    <Card>
      <ProTable<HelpCenterClassItem>
        headerTitle={intl.formatMessage({ id: 'helpCenter.category.title' })}
        actionRef={actionRef}
        rowKey="id"
        search={false}
        options={{
          reload: true,
          density: true,
          setting: true,
        }}
        toolBarRender={() => [
          <Button type="primary" key="add" onClick={handleAdd} icon={<PlusOutlined />}>
            {intl.formatMessage({ id: 'helpCenter.category.button.add' })}
          </Button>,
        ]}
        request={async (params) => {
          try {
            // 调用获取分类列表的API
            const response = await getHelpCenterClassList({
              pageNo: params.current,
              pageSize: params.pageSize,
              helpDescription: params.helpDescription,
            }) as ApiResponse;
            
            // 处理响应数据
            if (response.code === '0' && response.success) {
              const data = Array.isArray(response.data) ? response.data : [];
              return {
                data,
                success: true,
                total: data.length,
              };
            } else {
              return {
                data: [],
                success: false,
                total: 0,
              };
            }
          } catch (error) {
            message.error(intl.formatMessage({ id: 'helpCenter.category.message.getCategoryListError' }));
            console.error('获取分类列表失败:', error);
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        pagination={{
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => intl.formatMessage({ id: 'helpCenter.category.pagination.total' }, { total }),
        }}
      />

      {/* 使用独立的分类表单模态框组件 */}
      <CategoryFormModal
        visible={visible}
        currentCategory={currentCategory}
        onSubmit={handleSubmit}
        onCancel={() => setVisible(false)}
      />
    </Card>
  );
};

export default CategoryManagement; 