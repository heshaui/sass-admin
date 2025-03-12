import React, { useRef, useState } from 'react';
import { Button, message, Popconfirm, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { getHelpCenterClassList,addHelpCenterClass} from '@/services/ant-design-pro/operation';
import type { HelpCenterClassItem } from '@/services/ant-design-pro/operation';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import CategoryFormModal from './CategoryFormModal';

// 定义API响应类型
interface ApiResponse {
  code: string;
  data: {
    list: HelpCenterClassItem[];
    count: number;
  };
}

const CategoryManagement: React.FC = () => {
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
      // message.success('删除成功');
      
      // // 删除成功后刷新表格
      // if (actionRef.current) {
      //   actionRef.current.reload();
      // }
    } catch (error) {
      message.error('删除失败');
      console.error('删除失败:', error);
    }
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {  
      // 判断是新增还是编辑
      if (!currentCategory) {
        // 确保languages存在且是数组
        const languageContents = Array.isArray(values.languages) ? values.languages : [];
        console.log('父组件接收到的多语言数据:', languageContents); // 调试用
        
        if (languageContents.length === 0) {
          message.error('请至少添加一种语言');
          return;
        }
        
        // 新增分类
        const submitData = {
          homeHelpCenterClass: {
            helpDescription: values.helpDescription || "",
            helpSort: values.helpSort || 1,
            blackIcon: values.blackIcon || "",
            whiteIcon: values.whiteIcon || "",
            parentId: 0,
            showType: values.showType || 1,
          },
          homeHelpCenterClassContents: languageContents.map((item: any) => ({
            languageCode: item.languageCode,
            articleTitle: item.articleTitle,
          }))
        };

        console.log('提交到接口的数据:', submitData); // 调试用
        
        const res = await addHelpCenterClass(submitData);
        if (res.code === '0') {
          message.success('添加成功');
          setVisible(false);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        } else {
          message.error(`添加失败: ${res.message || '未知错误'}`);
        }
      } else {
        // 编辑分类逻辑
        // TODO: 实现编辑功能
        message.success('编辑成功');
        setVisible(false);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    } catch (error) {
      message.error('操作失败');
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
      title: '描述',
      dataIndex: 'helpDescription',
      key: 'helpDescription',
    },
    {
      title: '上级分类',
      dataIndex: 'parentId',
      key: 'parentId',
    },
    {
      title: '路径',
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      valueType:'dateTime'
    },
    {
      title: '排序',
      dataIndex: 'helpSort',
      key: 'helpSort',
    },
    
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record) => [
        <a key="edit" onClick={() => handleEdit(record)}>编辑</a>,
        <Popconfirm
          key="delete"
          title="确定要删除此分类吗？"
          onConfirm={() => handleDelete(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <Card>
      <ProTable<HelpCenterClassItem>
        headerTitle="帮助中心分类管理"
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
            添加分类
          </Button>,
        ]}
        request={async (params) => {
          const { current, pageSize } = params;
          try {
            const response = await getHelpCenterClassList({
              pageNo: current,
              pageSize: pageSize,
            }) as unknown as ApiResponse;
            
            if (response.code === '0') {
              return {
                data: response.data.list,
                success: true,
                total: response.data.count,
              };
            }
            return {
              data: [],
              success: false,
              total: 0,
            };
          } catch (error) {
            message.error('获取分类列表失败');
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
          showTotal: (total) => `共 ${total} 条记录`,
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