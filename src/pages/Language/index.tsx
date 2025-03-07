import React, { useState, useEffect } from "react";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, Space, Tag, message, Modal } from "antd";
import { PlusOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import AddModal from "./component/AddModal";
import { tenantLangList, updateEndpointInfo, deleteTenantLangPackage, checkUpdate, enablePackage, disablePackage, readJsonFromAliyun,deleteTenantLangEndpoint } from "@/services/ant-design-pro/WebConfig";
import UploadModal from './component/UploadModal';
// **主组件**
const Language: React.FC = () => {
  const [dataSource, setDataSource] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<{ id: number; langEncode: string } | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [viewData, setViewData] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);


  // **获取语言列表数据**
  const fetchLanguages = async (pageNo = 1, pageSize = 10) => {
    try {
      const data = { pageNo, pageSize };
      const response = await tenantLangList(data);
      if (response.code === "0") {
        setDataSource(response.data.list);
        setPagination({ current: pageNo, pageSize, total: response.data.count });
      } else {
        message.error(`获取语言列表失败`);
      }
    } catch (error) {
      message.error("请求失败，请检查网络连接");
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
        langEncode: ''
      }
      const response = await updateEndpointInfo(data);
      if (response.code === "0") {
        message.success(`更新成功`);
      } else {
        message.error(`更新失败`);
      }
    } catch (error) {
      message.error("请求失败，请检查网络连接");
    }
  }

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
        message.success(`已${record.status === 1 ? '禁用' : '启用'} ${record.lang}`);
        fetchLanguages(); // 刷新列表
      } else {
        message.error(`操作失败: ${response.message}`);
      }
    } catch (error) {
      message.error('操作失败，请重试');
    }
  };

  // **修改展开/折叠详情函数，增加状态检查**
  const toggleExpand = (id: number, status: number) => {
    // 只有启用状态(status === 1)才允许展开
    if (status !== 1) {
      message.info('禁用状态的语言无法查看详情');
      return;
    }
    
    setExpandedRowKeys((prev) =>
      prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id]
    );
  };

  const handleUploadClick = (record: { id: number; langEncode: string }) => {
    console.log(record)
    setSelectedRecord(record);
    setIsUploadModalVisible(true);
  };

  const handleDownload = (fileUrl: string | null, endpointName: string) => {
    if (!fileUrl) {
      message.warning('暂无可下载的文件');
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
      title: '移除语言包',
      content: `移除后，列表将不显示该语言，如有需要可以重新添加至列表！`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await deleteTenantLangPackage({ tenantLangId: id });
          if (response.code === '0') {
            message.success('移除成功');
            fetchLanguages(); // 刷新列表
          } else {
            message.error(`移除失败: ${response.message}`);
          }
        } catch (error) {
          message.error('操作失败，请重试');
        }
      }
    });
  };


  const handleTenantDelete = async (id: number, fileName: string) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除"${fileName}"的语言端吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await deleteTenantLangEndpoint({ tenantLangEndPointId: id });
          if (response.code === '0') {
            message.success('删除成功');
            fetchLanguages(); // 刷新列表
          } else {
            message.error(`删除失败: ${response.message}`);
          }
        } catch (error) {
          message.error('操作失败，请重试');
        }
      }
    })
  }

  const handleUpdate = async (record: any) => {
    try {
      const response = await checkUpdate({ tenantLangId: record.id });
      if (response.code === '0') {
        message.success('更新成功');
        fetchLanguages(); // 刷新列表
      } else {
        message.error(`更新失败: ${response.message}`);
      }
    } catch (error) {
      message.error('操作失败，请重试');
    }
  };

  const handleView = async (fileUrl: string) => {
    try {
      const response = await readJsonFromAliyun({ fileUrl });
      if (response.code === '0') {
        setViewData(response.data);
        setIsViewModalVisible(true);
      } else {
        message.error(`查看失败: ${response.message}`);
      }
    } catch (error) {
      message.error('操作失败，请重试');
    }
  };


  // **修改主表格列定义**
  const columns = [
    {
      title: "语言",
      dataIndex: "lang",
      render: (text: string, record: any) => (
        <span>
          <Button
            type="link"
            icon={expandedRowKeys.includes(record.id) ? <UpOutlined /> : <DownOutlined />}
            onClick={() => toggleExpand(record.id, record.status)}
            disabled={record.status !== 1} // 禁用状态下按钮不可点击
          />
          {text}
        </span>
      ),
    },
    { title: "语言代码", dataIndex: "langEncode" },
    {
      title: "状态",
      dataIndex: "status",
      render: (text: number) =>
        text === 1 ? <Tag color="green">启用</Tag> : <Tag color="red">禁用</Tag>,
    },
    {
      title: "操作",
      render: (_, record: any) => (
        <Space>
          <Button type="link" onClick={() => handleUpdate(record)}>
            更新
          </Button>
          <Button type="link" onClick={() => toggleStatus(record)}>
            {record.status === 1 ? "禁用" : "启用"}
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id, record.lang)}>
            移除
          </Button>
        </Space>
      ),
    },
  ];

  // **子表格（翻译文件）**
  const expandedRowRender = (record: any) => {
    const endpointColumns = [
      { title: "端", dataIndex: "endpointName" },
      { title: "文件名称", dataIndex: "fileName" },
      {
        title: "完整度",
        dataIndex: "cmpPercentage",
        render: (text: string) => `${text}%`
      },
      {
        title: "操作",
        render: (_, endpoint) => (
          // 检查文件名称是否为空
          <Space>
            {endpoint.fileName ? (<Button
              type="link"
              onClick={() => handleDownload(endpoint.fileUrl, endpoint.endpointName)}
            >
              下载
            </Button>
            ) : ''}
            <Button
              type="link"
              onClick={() => handleUploadClick({
                id: endpoint.id,
                langEncode: record.langEncode
              })}
            >
              上传
            </Button>
            {endpoint.fileName ? (<Button
              type="link"
              danger
              onClick={() => handleTenantDelete(endpoint.id, endpoint.fileName)}
            >
              删除
            </Button>
            ) : ''}

            {endpoint.fileName ? (

              <Button
                type="link"
                onClick={() => handleView(endpoint.fileUrl)}
              >
                查看
              </Button>) : ''}
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
            existingLanguages={dataSource.map(item => item.langEncode)}
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
        visible={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={null}
        title="查看数据"
      >
        <pre>{JSON.stringify(viewData, null, 2)}</pre>
      </Modal>
    </PageContainer>

  );
};

export default Language;