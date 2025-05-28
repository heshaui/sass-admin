import React, { useState, useEffect } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useIntl } from 'umi';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Space, message, Modal, Form, Input, Image, Switch } from 'antd';
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
  const intl = useIntl();
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
          id: currentItem.id,
        });
        
        if (res.code==='0') {
          message.success(intl.formatMessage({ id: 'media.message.updateSuccess' }));
          setVisible(false);
          actionRef.current?.reload();
        } else {
          message.error(intl.formatMessage({ id: 'media.message.updateFailed' }));
        }
      } else {
        // 添加媒体
        const res = await addMedia(values);
        
        if (res.code==='0') {
          message.success(intl.formatMessage({ id: 'media.message.addSuccess' }));
          setVisible(false);
          actionRef.current?.reload();
        } else {
          message.error(intl.formatMessage({ id: 'media.message.addFailed' }));
        }
      }
    } catch (error) {
      console.error('表单提交出错:', error);
    }
  };

  // 删除媒体
  const handleDelete = (record: MediaItem) => {
    Modal.confirm({
      title: intl.formatMessage({ id: 'media.message.deleteConfirm' }),
      content: intl.formatMessage(
        { id: 'media.message.deleteConfirmContent' },
        { name: record.name }
      ),
      onOk: async () => {
        try {
          const res = await deleteMedia(record.id);
          
          if (res.success) {
            message.success(
              intl.formatMessage(
                { id: 'media.message.deleteSuccess' },
                { name: record.name }
              )
            );
            actionRef.current?.reload();
          } else {
            message.error(intl.formatMessage({ id: 'media.message.deleteFailed' }));
          }
        } catch (error) {
          console.error(intl.formatMessage({ id: 'media.message.deleteError' }), error);
          message.error(intl.formatMessage({ id: 'media.message.deleteError' }));
        }
      }
    });
  };

  const columns: ProColumns<MediaItem>[] = [
    {
      title: intl.formatMessage({ id: 'media.column.id' }),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: intl.formatMessage({ id: 'media.column.name' }),
      dataIndex: 'nameText',
      key: 'nameText',
    },
    {
      title: intl.formatMessage({ id: 'media.column.icon' }),
      dataIndex: 'imgUrl',
      key: 'imgUrl',
      render: (text: string) => <Image src={text} alt={intl.formatMessage({ id: 'media.column.icon' })} width={32} height={32} />
    },
    {
      title: intl.formatMessage({ id: 'media.column.link' }),
      dataIndex: 'linkUrl',
      key: 'linkUrl',
    },
    {
      title: intl.formatMessage({ id: 'media.column.status' }),
      dataIndex: 'status',
      key: 'status',
      render: (text: number) => (
        text === 1 ? intl.formatMessage({ id: 'media.form.status.show' }) : intl.formatMessage({ id: 'media.form.status.hide' })
      )
    },
    {
      title: intl.formatMessage({ id: 'media.column.action' }),
      key: 'action',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>{intl.formatMessage({ id: 'media.action.edit' })}</a>
          <a onClick={() => handleDelete(record)}>{intl.formatMessage({ id: 'media.action.delete' })}</a>
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
        headerTitle={intl.formatMessage({ id: 'media.title' })}
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
            {intl.formatMessage({ id: 'media.button.add' })}
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
        title={currentItem ? intl.formatMessage({ id: 'media.modal.edit' }) : intl.formatMessage({ id: 'media.modal.add' })}
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
            label={intl.formatMessage({ id: 'media.form.name' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'media.form.name.required' }) }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'media.form.name.placeholder' })} />
          </Form.Item>
          <Form.Item
            name="imgUrl"
            label={intl.formatMessage({ id: 'media.form.icon' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'media.form.icon.required' }) }]}
          >
            <AvatarUpload onChange={(url) => form.setFieldsValue({ imgUrl: url })} />
          </Form.Item>
          <Form.Item
            name="linkUrl"
            label={intl.formatMessage({ id: 'media.form.link' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'media.form.link.required' }) }]}
          >
            <Input placeholder={intl.formatMessage({ id: 'media.form.link.placeholder' })} />
          </Form.Item>
          <Form.Item
            name="status"
            label={intl.formatMessage({ id: 'media.form.status' })}
            valuePropName="checked"
            getValueFromEvent={(checked) => checked ? 1 : 0}
            getValueProps={(value) => ({ checked: value === 1 })}
            initialValue={1}
          >
            <Switch 
              checkedChildren={intl.formatMessage({ id: 'media.form.status.show' })} 
              unCheckedChildren={intl.formatMessage({ id: 'media.form.status.hide' })} 
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default MediaPage;
