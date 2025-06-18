import React, { useState, useEffect } from 'react';
import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import type { ReactNode } from 'react';
import { Button, Space, Tag, message, Modal } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import AddModal from './component/AddModal';
import {
  tenantLangList,
  updateEndpointInfo,
  deleteTenantLangPackage,
  checkUpdate,
  enablePackage,
  disablePackage,
  deleteTenantLangEndpoint,
} from '@/services/ant-design-pro/WebConfig';
import UploadModal from './component/UploadModal';
import { useModel, useIntl } from '@umijs/max';
// **主组件**
const Language: React.FC = () => {
  const intl = useIntl();
  const [dataSource, setDataSource] = useState<any>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<{ id: number; langEncode: string } | null>(
    null,
  );
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [viewData, setViewData] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  console.log(currentUser, 'currentUser');
  const themeColor = initialState?.settings?.colorPrimary;
  // **获取语言列表数据**
  const fetchLanguages = async (pageNo = 1, pageSize = 10) => {
    try {
      const data = { pageNo, pageSize };
      const response = await tenantLangList(data);
      if (response.code === '0') {
        setDataSource(response?.data?.list || []);
        setPagination({ current: pageNo, pageSize, total: response?.data?.count || 0 });
      } else {
        message.error(intl.formatMessage({ id: 'language.message.fetch.failed' }));
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'language.message.request.failed' }));
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const updateInfo = async () => {
    try {
      let data = {
        id: '',
        fileUrl: '',
        langEncode: '',
      };
      const response = await updateEndpointInfo(data);
      if (response.code === '0') {
        message.success(intl.formatMessage({ id: 'language.message.update.success' }));
      } else {
        message.error(intl.formatMessage({ id: 'language.message.update.failed' }));
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'language.message.request.failed' }));
    }
  };

  // **切换语言状态**
  const toggleStatus = async (record: any) => {
    try {
      let response;
      if (record.status === 1) {
        // 当前是启用状态，点击后禁用
        response = await disablePackage({ tenantLangId: record.id });
      } else {
        // 当前是禁用状态，点击后启用
        response = await enablePackage({ tenantLangId: record.id });
      }

      if (response.code === '0') {
        message.success(
          `${
            record.status === 1
              ? intl.formatMessage({ id: 'language.status.disabled' })
              : intl.formatMessage({ id: 'language.status.enabled' })
          } ${record.lang}`,
        );
        fetchLanguages(); // 刷新列表
      } else {
        message.error(
          `${intl.formatMessage({ id: 'language.message.operation.failed' })}: ${response.message}`,
        );
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'language.message.operation.failed' }));
    }
  };

  // **修改展开/折叠详情函数，增加状态检查**
  const toggleExpand = (id: number, status: number) => {
    // 只有启用状态(status === 1)才允许展开
    if (status !== 1) {
      message.info(intl.formatMessage({ id: 'language.message.disabled.info' }));
      return;
    }

    setExpandedRowKeys((prev) =>
      prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id],
    );
  };

  const handleUploadClick = (record: { id: number; langEncode: string }) => {
    console.log(record);
    setSelectedRecord(record);
    setIsUploadModalVisible(true);
  };

  const handleDownload = (fileUrl: string | null, endpointName: string) => {
    if (!fileUrl) {
      message.warning(intl.formatMessage({ id: 'language.message.no.download' }));
      return;
    }

    // 创建一个隐藏的 a 标签来下载文件
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `${endpointName}_language.xlsx`; // 设置下载文件名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: number, fileName: string) => {
    Modal.confirm({
      title: intl.formatMessage({ id: 'language.modal.remove.title' }),
      content: intl.formatMessage({ id: 'language.modal.remove.content' }),
      okText: intl.formatMessage({ id: 'language.button.confirm' }),
      cancelText: intl.formatMessage({ id: 'language.button.cancel' }),
      okButtonProps: {
        style: {
          background: themeColor, // 紫色主题色
          borderColor: themeColor
        }
      },
      onOk: async () => {
        try {
          const response = await deleteTenantLangPackage({ tenantLangId: id });
          if (response.code === '0') {
            message.success(intl.formatMessage({ id: 'language.message.remove.success' }));
            fetchLanguages(); // 刷新列表
          } else {
            message.error(
              `${intl.formatMessage({ id: 'language.message.remove.failed' })}: ${
                response.message
              }`,
            );
          }
        } catch (error) {
          message.error(intl.formatMessage({ id: 'language.message.operation.failed' }));
        }
      },
    });
  };

  const handleTenantDelete = async (id: number, fileName: string) => {
    Modal.confirm({
      title: intl.formatMessage({ id: 'language.modal.confirm.delete.title' }),
      content: intl.formatMessage({ id: 'language.modal.confirm.delete.content' }, { fileName }),
      okText: intl.formatMessage({ id: 'language.button.confirm' }),
      cancelText: intl.formatMessage({ id: 'language.button.cancel' }),
      okButtonProps: {
        style: {
          background: themeColor, // 紫色主题色
          borderColor: themeColor
        }
      },
      onOk: async () => {
        try {
          const response = await deleteTenantLangEndpoint({ tenantLangEndPointId: id });
          if (response.code === '0') {
            message.success(intl.formatMessage({ id: 'language.message.delete.success' }));
            fetchLanguages(); // 刷新列表
          } else {
            message.error(
              `${intl.formatMessage({ id: 'language.message.delete.failed' })}: ${
                response.message
              }`,
            );
          }
        } catch (error) {
          message.error(intl.formatMessage({ id: 'language.message.operation.failed' }));
        }
      },
    });
  };

  const handleUpdate = async (record: any) => {
    try {
      const response = await checkUpdate({ tenantLangId: record.id });
      if (response.code === '0') {
        message.success(intl.formatMessage({ id: 'language.message.update.success' }));
        fetchLanguages(); // 刷新列表
      } else {
        message.error(
          `${intl.formatMessage({ id: 'language.message.update.failed' })}: ${response.message}`,
        );
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'language.message.operation.failed' }));
    }
  };

  const handleView = async () => {
    if (currentUser?.host) {
      const url = currentUser.host.startsWith('http')
        ? currentUser.host
        : `https://${currentUser.host}`;
      window.open(url, '_blank');
    } else {
      message.error(intl.formatMessage({ id: 'language.message.configure.host' }));
    }
  };

  // **修改主表格列定义**
  const columns: ProColumns<any>[] = [
    {
      title: intl.formatMessage({ id: 'language.column.language' }),
      dataIndex: 'lang',
      render: (dom: ReactNode, entity: any) => (
        <span>
          {entity.lang}
          <Button type="link" size="small" onClick={() => toggleExpand(entity.id, entity.status)}>
            {expandedRowKeys.includes(entity.id) ? <UpOutlined /> : <DownOutlined />}
          </Button>
        </span>
      ),
    },
    { title: intl.formatMessage({ id: 'language.column.language.code' }), dataIndex: 'langEncode' },
    {
      title: intl.formatMessage({ id: 'language.column.status' }),
      dataIndex: 'status',
      render: (dom: ReactNode, entity: any) =>
        entity.status === 1 ? (
          <Tag color="green">{intl.formatMessage({ id: 'language.status.enabled' })}</Tag>
        ) : (
          <Tag color="red">{intl.formatMessage({ id: 'language.status.disabled' })}</Tag>
        ),
    },
    {
      title: intl.formatMessage({ id: 'language.column.operations' }),
      render: (dom: ReactNode, entity: any) => (
        <Space>
          <Button type="link" onClick={() => handleUpdate(entity)}>
            {intl.formatMessage({ id: 'language.button.update' })}
          </Button>
          <Button type="link" onClick={() => toggleStatus(entity)}>
            {entity.status === 1
              ? intl.formatMessage({ id: 'language.button.disable' })
              : intl.formatMessage({ id: 'language.button.enable' })}
          </Button>
          {entity.status === 1 ? (
            <Button type="link" onClick={() => handleView()}>
              {intl.formatMessage({ id: 'language.button.view' })}
            </Button>
          ) : (
            ''
          )}
          <Button type="link" danger onClick={() => handleDelete(entity.id, entity.lang)}>
            {intl.formatMessage({ id: 'language.button.remove' })}
          </Button>
        </Space>
      ),
    },
  ];

  // **子表格（翻译文件）**
  const expandedRowRender = (record: any) => {
    const endpointColumns: ProColumns<any>[] = [
      { title: intl.formatMessage({ id: 'language.column.endpoint' }), dataIndex: 'endpointName' },
      { title: intl.formatMessage({ id: 'language.column.filename' }), dataIndex: 'fileName' },
      {
        title: intl.formatMessage({ id: 'language.column.completeness' }),
        dataIndex: 'cmpPercentage',
        render: (dom: ReactNode, entity: any) => `${entity.cmpPercentage}%`,
      },
      {
        title: intl.formatMessage({ id: 'language.column.operations' }),
        render: (dom: ReactNode, endpoint: any) => (
          // 检查文件名称是否为空
          <Space>
            {endpoint.fileName ? (
              <Button
                type="link"
                onClick={() => handleDownload(endpoint.fileUrl, endpoint.endpointName)}
              >
                {intl.formatMessage({ id: 'language.button.download' })}
              </Button>
            ) : (
              ''
            )}
            <Button
              type="link"
              onClick={() =>
                handleUploadClick({
                  id: endpoint.id,
                  langEncode: record.langEncode,
                })
              }
            >
              {intl.formatMessage({ id: 'language.button.upload' })}
            </Button>
            {endpoint.fileName ? (
              <Button
                type="link"
                danger
                onClick={() => handleTenantDelete(endpoint.id, endpoint.fileName)}
              >
                {intl.formatMessage({ id: 'language.button.delete' })}
              </Button>
            ) : (
              ''
            )}
          </Space>
        ),
      },
    ];

    return (
      <ProTable
        columns={endpointColumns}
        dataSource={record.endpoints}
        rowKey="id"
        search={false}
        options={false}
        pagination={false}
      />
    );
  };

  return (
    <PageContainer>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
          {intl.formatMessage({ id: 'language.tips.title' })}
        </div>
        <div style={{ marginBottom: 10 }}>
          {intl.formatMessage({ id: 'language.tips.contact.service' })}
          <br />
        </div>
        <div style={{ marginBottom: 10 }}>
          {intl.formatMessage({ id: 'language.tips.default.english' })}
        </div>
        <div style={{ marginBottom: 10 }}>
          {intl.formatMessage({ id: 'language.tips.default.disabled' })}
        </div>
      </div>
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        expandable={{
          expandedRowKeys,
          expandedRowRender,
          onExpand: (expanded, record) => toggleExpand(record.id, record.status),
          expandRowByClick: false,
          // 只有启用状态才能展开
          rowExpandable: (record) => record.status === 1,
        }}
        search={false}
        toolBarRender={() => [
          <AddModal
            key="add"
            onSuccess={() => fetchLanguages(pagination.current, pagination.pageSize)}
            existingLanguages={dataSource.map((item: any) => item.langEncode)}
          />,
        ]}
        onChange={(newPagination) => {
          fetchLanguages(newPagination.current, newPagination.pageSize);
        }}
      />

      {selectedRecord && (
        <UploadModal
          visible={isUploadModalVisible}
          onCancel={() => setIsUploadModalVisible(false)}
          record={selectedRecord}
          onSuccess={() => {
            fetchLanguages(pagination.current, pagination.pageSize);
          }}
        />
      )}

      <Modal
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={null}
        title={intl.formatMessage({ id: 'language.modal.view.data.title' })}
      >
        <pre>{JSON.stringify(viewData, null, 2)}</pre>
      </Modal>
    </PageContainer>
  );
};

export default Language;
