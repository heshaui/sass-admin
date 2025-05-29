import {
  deletePcAccessPathById,
  getPcAccessPathList,
  savePcAccessPath,
  updatePcAccessPathById,
} from '@/services/ant-design-pro/PC';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, Form, Input, message, Modal, Space, Switch } from 'antd';
import React, { useEffect, useState } from 'react';

interface PcAccessPathItem {
  id: string | number;
  functionName: string;
  accessPath: string;
  languageKey?: string;
  status: number;
  [key: string]: any;
}

interface PcAccessPathListResponse {
  code: string;
  message?: string;
  data?: {
    list: PcAccessPathItem[];
    total: number;
    pageSize: number;
  };
}

const PC: React.FC = () => {
  const intl = useIntl();

  const [loading, setLoading] = useState(false);
  const [pcList, setPcList] = useState<PcAccessPathItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PcAccessPathItem | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchPCList = async (
    params = { current: pagination.current, pageSize: pagination.pageSize },
  ) => {
    setLoading(true);
    try {
      const response = (await getPcAccessPathList({
        pageNum: params.current,
        pageSize: params.pageSize,
      })) as PcAccessPathListResponse;

      if (response.code === '0') {
        setPcList(
          response.data.list.map((item: any) => ({
            id: item.id,
            functionName: item.functionName || '',
            accessPath: item.accessPath || '',
            status: item.status || 0,
            ...item,
          })) || [],
        );
        setPagination({
          ...pagination,
          current: params.current,
          total: response.data.total || 0,
        });
      } else {
        message.error(response.message || 'Failed to fetch data');
      }
    } catch (error) {
      message.error('Failed to fetch data');
      console.error('Error fetching PC list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPCList();
  }, []);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setVisible(true);
  };

  const handleEdit = (record: PcAccessPathItem) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      status: record.status,
    });
    setVisible(true);
  };

  const handleDelete = async (id: string | number) => {
    try {
      setLoading(true);
      const response = (await deletePcAccessPathById(id)) as {
        success: boolean;
        errorMessage?: string;
      };
      if (response.code === '0') {
        message.success(intl.formatMessage({ id: 'pc.message.delete.success' }));
        fetchPCList();
      } else {
        message.error(response.message || intl.formatMessage({ id: 'pc.message.delete.error' }));
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'pc.message.delete.failed' }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // Ensure status is a number
      const formData = {
        ...values,
        status: Number(values.status)
      };

      if (editingRecord) {
        // 更新
        const response = await updatePcAccessPathById({
          ...formData,
          id: editingRecord.id,
        });
        if (response.code === '0') {
          message.success(intl.formatMessage({ id: 'pc.message.update.success' }));
          setVisible(false);
          fetchPCList();
        } else {
          message.error(response.message || intl.formatMessage({ id: 'pc.message.update.error' }));
        }
      } else {
        // 新增
        let data = {
          ...formData,
          parentId: 0,
        };
        const response = await savePcAccessPath(data);
        if (response.code === '0') {
          message.success(intl.formatMessage({ id: 'pc.message.create.success' }));
          setVisible(false);
          fetchPCList();
        } else {
          message.error(response.message || intl.formatMessage({ id: 'pc.message.create.error' }));
        }
      }
    } catch (error) {
      console.error('提交表单错误:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: ProColumns<any>[] = [
    {
      title: intl.formatMessage({ id: 'pc.name' }),
      dataIndex: 'functionName',
    },
    {
      title: intl.formatMessage({ id: 'pc.path' }),
      dataIndex: 'accessPath',
    },
    {
      title: intl.formatMessage({ id: 'pc.languageKey' }),
      dataIndex: 'languageKey',
    },
    {
      title: intl.formatMessage({ id: 'pc.status' }),
      dataIndex: 'status',
      render: (_, record) =>
        record.status === 1
          ? intl.formatMessage({ id: 'pc.status.show' })
          : intl.formatMessage({ id: 'pc.status.hide' }),
    },
    {
      title: intl.formatMessage({ id: 'pc.action' }),
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            {intl.formatMessage({ id: 'pc.edit' })}
          </Button>
          <Button
            danger
            onClick={() =>
              Modal.confirm({
                title: intl.formatMessage({ id: 'pc.delete.confirm' }),
                content: intl.formatMessage({ id: 'pc.delete.confirmMessage' }),
                onOk: () => handleDelete(record.id as string),
              })
            }
          >
            {intl.formatMessage({ id: 'pc.delete' })}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<PcAccessPathItem>
        rowKey="id"
        search={false}
        loading={loading}
        dataSource={pcList}
        columns={columns}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        onChange={(newPagination) =>
          fetchPCList({
            current: newPagination.current || 1,
            pageSize: newPagination.pageSize || 10,
          })
        }
        toolBarRender={() => [
          <Button type="primary" key="add" onClick={handleAdd}>
            {intl.formatMessage({ id: 'pc.create' })}
          </Button>,
          <Button
            key="refresh"
            onClick={() =>
              fetchPCList({
                current: 1,
                pageSize: pagination.pageSize,
              })
            }
          >
            {intl.formatMessage({ id: 'pc.refresh' })}
          </Button>,
        ]}
      />

      <Modal
        title={
          editingRecord
            ? intl.formatMessage({ id: 'pc.edit' })
            : intl.formatMessage({ id: 'pc.create' })
        }
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setVisible(false)}>
            {intl.formatMessage({ id: 'pc.cancel' })}
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
            {intl.formatMessage({ id: 'pc.submit' })}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="functionName"
            label={intl.formatMessage({ id: 'pc.name' })}
            rules={[
              { required: true, message: intl.formatMessage({ id: 'pc.form.name.required' }) },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="accessPath"
            label={intl.formatMessage({ id: 'pc.path' })}
            rules={[
              { required: true, message: intl.formatMessage({ id: 'pc.form.path.required' }) },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="languageKey" label={intl.formatMessage({ id: 'pc.languageKey' })} rules={[
            { required: true, message: intl.formatMessage({ id: 'pc.form.languageKey.required' }) },
          ]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label={intl.formatMessage({ id: 'pc.status' })}
            valuePropName="checked"
            getValueProps={(value) => ({ checked: Number(value) === 1 })}
            getValueFromEvent={(checked) => (checked ? 1 : 0)}
            normalize={(value) => Number(value)}
          >
            <Switch
              checkedChildren={intl.formatMessage({ id: 'pc.status.enable' })}
              unCheckedChildren={intl.formatMessage({ id: 'pc.status.disable' })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default PC;
