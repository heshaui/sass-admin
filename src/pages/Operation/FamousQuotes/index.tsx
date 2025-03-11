import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Table, Space, message, Modal, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { request } from 'umi';

const FamousQuotes: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 替换为实际的API请求
      const response = await request('/api/famous-quotes');
      setDataSource(response.data || []);
    } catch (error) {
      message.error('获取名言警句列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setVisible(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条名言吗？',
      onOk: async () => {
        try {
          // 替换为实际的API请求
          await request(`/api/famous-quotes/${id}`, {
            method: 'DELETE',
          });
          message.success('删除成功');
          fetchData();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      if (editingId) {
        // 更新操作
        await request(`/api/famous-quotes/${editingId}`, {
          method: 'PUT',
          data: values,
        });
        message.success('更新成功');
      } else {
        // 添加操作
        await request('/api/famous-quotes', {
          method: 'POST',
          data: values,
        });
        message.success('添加成功');
      }
      
      setVisible(false);
      fetchData();
    } catch (error) {
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '文本',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record: any) => (
        <Space>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleDelete(record.id)}>删除</a>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加
        </Button>
      </div>

      <Table
        rowKey="id"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId ? '编辑名言' : '添加名言'}
        visible={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="content"
            label="名言内容"
            rules={[{ required: true, message: '请输入名言内容' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入名言内容" />
          </Form.Item>
          <Form.Item name="author" label="作者">
            <Input placeholder="请输入作者(选填)" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default FamousQuotes; 