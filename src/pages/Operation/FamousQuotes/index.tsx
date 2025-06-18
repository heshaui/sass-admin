import React, { useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getFamousAphorismsList, deleteFamousAphorisms } from '@/services/ant-design-pro/operation';
import LanguageSelector from '@/components/LanguageSelector';
import FamousQuoteModal from './components/FamousQuoteModal';
import { useIntl } from '@umijs/max';

const FamousQuotes: React.FC = () => {
  const intl = useIntl();
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
  };

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    setEditingRecord(record);
    setVisible(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: intl.formatMessage({ id: 'famousQuotes.message.deleteConfirm' }),
      content: intl.formatMessage({ id: 'famousQuotes.message.deleteConfirmContent' }),
      onOk: async () => {
        try {
          const res = await deleteFamousAphorisms(id);
          if (res.code === '0') {
            message.success(intl.formatMessage({ id: 'famousQuotes.message.deleteSuccess' }));
            actionRef.current?.reload();
          } else {
            message.error(intl.formatMessage({ id: 'famousQuotes.message.deleteFailed' }));
          }
        } catch (error) {
          message.error(intl.formatMessage({ id: 'famousQuotes.message.deleteFailed' }));
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
      title: intl.formatMessage({ id: 'famousQuotes.column.id' }),
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: intl.formatMessage({ id: 'famousQuotes.column.text' }),
      dataIndex: 'languageContent',
      key: 'languageContent',
      render: (_: any, record: any) => {
        const content =
          record.famousAphorismsContents?.find((item: any) => item.languageCode === language)
            ?.languageContent || '';
        return content;
      },
    },
    {
      title: intl.formatMessage({ id: 'famousQuotes.column.action' }),
      key: 'action',
      width: 200,
      render: (_: any, record: any) => (
        <Space>
          <a onClick={() => handleEdit(record)}>
            {intl.formatMessage({ id: 'famousQuotes.action.edit' })}
          </a>
          <a onClick={() => handleDelete(record.id)}>
            {intl.formatMessage({ id: 'famousQuotes.action.delete' })}
          </a>
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
        headerTitle={intl.formatMessage({ id: 'famousQuotes.title' })}
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
            message.error(intl.formatMessage({ id: 'famousQuotes.message.getListFailed' }));
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        toolBarRender={() => [
          <Button type="primary" key="add" icon={<PlusOutlined />} onClick={handleAdd}>
            {intl.formatMessage({ id: 'famousQuotes.button.add' })}
          </Button>,
        ]}
        pagination={{ pageSize: 10 }}
        search={false}
      />

      <FamousQuoteModal
        languageCode={language}
        visible={visible}
        editingId={editingId}
        onSuccess={handleModalSuccess}
        onCancel={() => setVisible(false)}
      />
    </PageContainer>
  );
};

export default FamousQuotes;
