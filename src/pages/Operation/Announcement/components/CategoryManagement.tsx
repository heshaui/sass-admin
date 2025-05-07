import React, { useState, useRef } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, message, Modal, Card } from 'antd';
import { updateAnnouncement,getClassMenuList,addClassMenu,updateClassMenu,deleteClassMenu,getClassMenuParams,getAnnouncementContentList} from '@/services/ant-design-pro/operation';
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
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  
  const categoryActionRef = useRef<ActionType>();

  const handleCategoryFormSuccess = async (formValues: Record<string, any>) => {
    setConfirmLoading(true);
    console.log(formValues,'formValues');
    try {
      let response;
      if (formType === 'create') {
      let data={
        serialNum:formValues.serialNum,
        describe:formValues.describe,
        languageCodes:formValues.contentList,
      }
        response = await addClassMenu(data);
      } else {
        let data={
          id:formValues.id,
          serialNum:formValues.serialNum,
          describe:formValues.describe,
          languageCodes:formValues.languageCodes
        }
        response = await updateClassMenu(data);
      }
      
      if (response.code==='0'&& response.data) {
        message.success(formType === 'create' ? '创建成功' : '更新成功');
        setCategoryFormVisible(false);
        // 刷新列表数据
        categoryActionRef.current?.reload();
      } else {
        message.error(formType === 'create' ? '创建失败' : '更新失败');
      }
    } catch (error) {
      message.error('操作失败');
    } finally {
      setConfirmLoading(false);
    }
  };
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
  const  getEditInfo=async(id:string)=>{
    const response=await getClassMenuParams(id);
    
    if(response.code==='0'&& response.data){
      setCurrentCategory(
        {
          ...response.data,
          contentList:response.data.languageCodes
        }
      );
      setFormType('update');
      setCategoryFormVisible(true);

      // if(contentList.code==='0'&& contentList.data){
      //   setCurrentCategory({
      //     ...response.data,
      //     contentList:contentList.data
      //   });
      //   setFormType('update');
      // setCategoryFormVisible(true);

      
    }else{
      message.error('获取分类信息失败');
    }
  }

  // 删除分类
  const handleRemoveCategory = async (id: string) => {
    try {
      
      const response = await deleteClassMenu(id);
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
      dataIndex: 'describe',
    },
    {
      title: '排序',
      dataIndex: 'serialNum',
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
            getEditInfo(record.id);
           
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
    <div>
        <ProTable<CategoryItem>
          headerTitle={false}
          actionRef={categoryActionRef}
          rowKey="id"
          request={fetchCategoryList}
          columns={categoryColumns}
          toolBarRender={() => [
            <Button key="add" type="primary" onClick={() => {
              setCategoryFormVisible(true);
              setCurrentCategory(undefined);
              setFormType('create');
            }}>
              添加分类
            </Button>
          ]}
          pagination={{
            pageSize: 10,
          }}
        />
      {/* </Card> */}

      {/* 分类表单 */}
      <CategoryForm
        visible={categoryFormVisible}
        type={formType}
        values={currentCategory}
        onCancel={() => setCategoryFormVisible(false)}
        onSuccess={handleCategoryFormSuccess}
        confirmLoading={confirmLoading}
      />
   </div>
  );
};

export default CategoryManagement; 