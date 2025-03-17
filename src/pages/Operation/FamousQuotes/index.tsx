import React, { useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { request } from 'umi';
import { getFamousAphorismsList,deleteFamousAphorisms } from '@/services/ant-design-pro/operation';
import LanguageSelector from '@/components/Languages';
import FamousQuoteModal from './components/FamousQuoteModal';

const FamousQuotes: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [language, setLanguage] = useState('en_US');
  const [editingRecord, setEditingRecord] = useState<any>(null);

  const handleAdd = () => {
    setEditingId(null);
    setEditingRecord(null);
    setVisible(true);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    actionRef.current?.reload();
  }
    
  const handleEdit = (record: any) => {
    setEditingId(record.id);
    setEditingRecord(record);
    setVisible(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条名言吗？',
      onOk: async () => {
          try {
            const res = await deleteFamousAphorisms(id);
            if(res.code==='0') {
              message.success('删除成功');
              actionRef.current?.reload();
            } else {
              message.error('删除失败');
            }
       

        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleModalSuccess = () => {
    setVisible(false);
    actionRef.current?.reload();
  };

  const actionRef = React.useRef<any>();

  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '文本',
      dataIndex: 'languageContent',
      key: 'languageContent',
      render: (_, record: any) => {
        const content = record.famousAphorismsContents?.find(
          (item: any) => item.languageCode === language
        )?.languageContent || '';
        return content;
      },
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
      <LanguageSelector value={language} onChange={handleLanguageChange} />

      <ProTable
        rowKey="id"
        actionRef={actionRef}
        headerTitle="名言警句列表"
        columns={columns}
        request={async (params, sort, filter) => {
          try {
            const response = await getFamousAphorismsList({
              languageCode: language,
              pageNo: params.current,
              pageSize: params.pageSize,
            });
            return {
              data: response.data || [],
              success: true,
              total: response.total || response.data?.length || 0,
            };
          } catch (error) {
            message.error('获取名言警句列表失败');
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        toolBarRender={() => [
          <Button type="primary" key="add" icon={<PlusOutlined />} onClick={handleAdd}>
            添加
          </Button>,
        ]}
        pagination={{ pageSize: 10 }}
        search={false}
      />

      <FamousQuoteModal
        visible={visible}
        editingId={editingId}
        editingRecord={editingRecord}
        onSuccess={handleModalSuccess}
        onCancel={() => setVisible(false)}
      />
    </PageContainer>
  );
};

export default FamousQuotes; 