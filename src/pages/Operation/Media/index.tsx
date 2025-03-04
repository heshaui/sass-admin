import React, { useState, useEffect } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Space, message, Modal, Form, Input,Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { 
  getMediaList, 
  addMedia, 
  updateMedia, 
  deleteMedia, 
  MediaItem 
} from '@/services/ant-design-pro/operation';
import AvatarUpload from '@/components/AvatarUpload';


const MediaPage: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<MediaItem | null>(null);
  const [form] = Form.useForm();
  const actionRef = React.useRef<ActionType>();

  // 处理新增按钮点击
  const handleAdd = () => {
    // 先关闭模态框，确保之前的状态被清除
    setVisible(false);
    
    // 使用setTimeout确保在下一个事件循环中执行，让模态框有时间完全关闭
    setTimeout(() => {
      form.resetFields(); // 重置表单
      setCurrentItem(undefined); // 清除当前项
      setVisible(true); // 重新打开模态框
    }, 100);
  };

  // 处理编辑按钮点击
  const handleEdit = (record: MediaItem) => {
    // 先关闭模态框，确保之前的状态被清除
    setVisible(false);
    
    // 使用setTimeout确保在下一个事件循环中执行
    setTimeout(() => {
      form.resetFields(); // 重置表单
      setCurrentItem(record); // 设置当前项
      setVisible(true); // 打开模态框
      
      // 再次使用setTimeout确保表单已经渲染
      setTimeout(() => {
        form.setFieldsValue({
          ...record,
        });
        console.log('设置表单值:', record); // 添加日志
      }, 100);
    }, 100);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (currentItem) {
        // 更新媒体
        const res = await updateMedia({
          ...values,
          status:1,
          id: currentItem.id,
        });
        
        if (res.code==='0') {
          message.success('更新成功');
          setVisible(false);
          actionRef.current?.reload();
        } else {
          message.error('更新失败');
        }
      } else {
        // 添加媒体
        const data = {
          ...values,
          status:1,
        };
        const res = await addMedia(data);
        
        if (res.code==='0') {
          message.success('添加成功');
          setVisible(false);
          actionRef.current?.reload();
        } else {
          message.error('添加失败');
        }
      }
    } catch (error) {
      console.error('表单提交出错:', error);
    }
  };

  // 删除媒体
  const handleDelete = (record: MediaItem) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除 ${record.name} 吗？`,
      onOk: async () => {
        try {
          const res = await deleteMedia(record.id);
          
          if (res.success) {
            message.success(`已删除: ${record.name}`);
            actionRef.current?.reload();
          } else {
            message.error('删除失败');
          }
        } catch (error) {
          console.error('删除出错:', error);
          message.error('删除出错');
        }
      }
    });
  };

  const columns: ProColumns<MediaItem>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '名称',
      dataIndex: 'nameText',
      key: 'nameText',
    },
    {
      title: '图标',
      dataIndex: 'imgUrl',
      key: 'imgUrl',
      render: (text: string) => <Image src={text} alt="图标" width={32} height={32} />
    },
    {
      title: '跳转链接',
      dataIndex: 'linkUrl',
      key: 'linkUrl',
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleDelete(record)}>删除</a>
        </Space>
      ),
    },
  ];

  // 在模态框打开时设置表单值
  useEffect(() => {
    if (visible && currentItem) {
      form.setFieldsValue({
        ...currentItem,
      });
      console.log('设置表单值:', currentItem); // 添加日志检查
    }
  }, [visible, currentItem, form]);

  return (
    <PageContainer>
      <ProTable<MediaItem>
        headerTitle="媒体列表"
        actionRef={actionRef}
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Button
            key="add"
            type="primary"
            onClick={handleAdd}
            icon={<PlusOutlined />}
          >
            添加
          </Button>,
        ]}
        request={async (params) => {
          const res = await getMediaList({
            pageNo: params.current,
            pageSize: params.pageSize,
          });
          return {
            data: res.data.list,
            success: res.success,
            total: res.count,
          };
        }}
        columns={columns}
      />
      
      {/* 添加/编辑表单模态框 */}
      <Modal
        title={currentItem ? '编辑社交媒体' : '新增社交媒体'}
        visible={visible}
        onOk={handleSubmit}
        onCancel={() => {
          form.resetFields();
          setVisible(false);
        }}
        destroyOnClose={true}
        maskClosable={false} // 防止点击蒙层关闭
      >
        <Form
          form={form}
          layout="vertical"
          preserve={false} // 不保留表单数据
        >
          <Form.Item
            name="nameText"
            label="名称"
            rules={[{ required: true, message: '请输入媒体名称' }]}
          >
            <Input placeholder="请输入媒体名称" />
          </Form.Item>
          <Form.Item
            name="imgUrl"
            label="图标"
            rules={[{ required: true, message: '请上传图标' }]}
          >
            <AvatarUpload onChange={(url) => form.setFieldsValue({ imgUrl: url })} />
          </Form.Item>
          <Form.Item
            name="linkUrl"
            label="跳转链接"
            rules={[{ required: true, message: '请输入跳转链接' }]}
          >
            <Input placeholder="请输入跳转链接" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default MediaPage;
