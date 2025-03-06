import {
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import React, { useRef, useState, useEffect } from 'react';
import { getPcAccessPathList, savePcAccessPath, updatePcAccessPathById, deletePcAccessPathById } from '@/services/ant-design-pro/PC';
import { Button, Space, message, Modal, Form, Input, Switch } from 'antd';
import type { ProColumns } from '@ant-design/pro-components';

const PC: React.FC = () => {

    const [loading, setLoading] = useState(false);
    const [PCList, setPCList] = useState<API.PcAccessPathParams[]>([]);
    const [visible, setVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState<API.PcAccessPathParams | null>(null);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchPCList = async (params = { current: pagination.current, pageSize: pagination.pageSize }) => {
        setLoading(true);
        const response = await getPcAccessPathList({
            pageNum: params.current,
            pageSize: params.pageSize,
        });
        if (response.code==='0') {
            setPCList(response.data.list || []);
            setPagination({
                ...pagination,
                current: params.current,
                total: response.data.count || 0,
            });
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchPCList();
    }, []);

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setVisible(true);
    };
    
    const handleEdit = (record: API.PcAccessPathParams) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setVisible(true);
    };
    
    const handleDelete = async (id: string) => {
        try {
            setLoading(true);
            const response = await deletePcAccessPathById(id);
            if (response.code === '0') {
                message.success('删除成功');
                fetchPCList();
            } else {
                message.error(response.msg || '删除失败');
            }
        } catch (error) {
            message.error('删除操作发生错误');
        } finally {
            setLoading(false);
        }
    };
    
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            
            if (editingRecord) {
                // 更新
                const response = await updatePcAccessPathById({
                    ...values,
                    id: editingRecord.id,
                });
                if (response.code === '0') {
                    message.success('更新成功');
                    setVisible(false);
                    fetchPCList();
                } else {
                    message.error(response.msg || '更新失败');
                }
            } else {
                // 新增
                let data={
                    ...values,
                    parentId: 0,
                }
                const response = await savePcAccessPath(data);
                if (response.code === '0') {
                    message.success('添加成功');
                    setVisible(false);
                    fetchPCList();
                } else {
                    message.error(response.msg || '添加失败');
                }
            }
        } catch (error) {
            console.error('提交表单错误:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns: ProColumns<API.PcAccessPathParams>[] = [
        {
            title: '名称',
            dataIndex: 'functionName',
        },
        {
            title: '路径',
            dataIndex: 'accessPath',
        },
        {
            title: '多语言翻译Key',
            dataIndex: 'languageKey',
        },
        {
            title: '是否显示',
            dataIndex: 'status',
            render: (_, record) => (
                record.status === 1 ? '显示' : '隐藏'
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="primary" onClick={() => handleEdit(record)}>编辑</Button>
                    <Button danger onClick={() => Modal.confirm({
                        title: '确认删除',
                        content: '确定要删除这条记录吗？',
                        onOk: () => handleDelete(record.id),
                    })}>删除</Button>
                </Space>
            ),
        }
    ];


  return (
    <PageContainer>
        <ProTable<API.PcAccessPathParams>
            rowKey="id"
            search={false}
            loading={loading}
            dataSource={PCList}
            columns={columns}
            pagination={{
                ...pagination,
                showSizeChanger: true,
                showQuickJumper: true,
            }}
            onChange={(newPagination) => fetchPCList({
                current: newPagination.current || 1,
                pageSize: newPagination.pageSize || 10,
            })}
            toolBarRender={() => [
                <Button type="primary" key="add" onClick={handleAdd}>
                    新建
                </Button>,
                <Button key="refresh" onClick={() => fetchPCList({
                    current: 1,
                    pageSize: pagination.pageSize,
                })}>
                    刷新
                </Button>
            ]}
        />
        
        <Modal
            title={editingRecord ? '编辑' : '新建'}
            open={visible}
            onCancel={() => setVisible(false)}
            footer={[
                <Button key="cancel" onClick={() => setVisible(false)}>
                    取消
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
                    确定
                </Button>
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="functionName" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="accessPath" label="路径" rules={[{ required: true, message: '请输入路径' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="languageKey" label="多语言翻译Key">
                    <Input />
                </Form.Item>
                <Form.Item 
                    name="status" 
                    label="是否显示" 
                    valuePropName="checked"
                    getValueProps={(value) => ({ checked: value === 1 })}
                    getValueFromEvent={(checked) => checked ? 1 : 0}
                >
                    <Switch />
                </Form.Item>
            </Form>
        </Modal>
    </PageContainer>
  );
};

export default PC;
