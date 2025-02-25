import React, { useState, useEffect } from "react";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, Space, Tag, message,Modal } from "antd";
import { PlusOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import AddModal from "./component/AddModal";
import { tenantLangList,updateEndpointInfo } from "@/services/ant-design-pro/WebConfig";
import UploadModal from './component/UploadModal';
// **主组件**
const Language: React.FC = () => {
  const [dataSource, setDataSource] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<{ id: number; langEncode: string } | null>(null);

  // **获取语言列表数据**
  const fetchLanguages = async () => {
    try {
     
      let data={
        pageNo:1,
        pageSize:10000
      }
      const response = await tenantLangList(data);
      if (response.code === "0") {
        setDataSource(response.data);
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

  const updateInfo=async ()=>{
    try {
      let data={
        id:'',
        fileUrl:'',
        langEncode:''
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
  const toggleStatus = (record: any) => {
    const updatedData = dataSource.map((item) =>
      item.id === record.id
        ? { ...item, status: item.status === "enabled" ? "disabled" : "enabled" }
        : item
    );
    setDataSource(updatedData);
    message.success(`已${record.status === "enabled" ? "禁用" : "启用"} ${record.language}`);
  };

  // **展开/折叠详情**
  const toggleExpand = (id: number) => {
    setExpandedRowKeys((prev) =>
      prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id]
    );
  };

  const handleUploadClick = (record: { id: number; langEncode: string }) => {
    setSelectedRecord(record);
    setIsUploadModalVisible(true);
  };
  // **主表格列**
  const columns = [
    {
      title: "语言",
      dataIndex: "language",
      render: (text: string, record: any) => (
        <span>
          <Button
            type="link"
            icon={expandedRowKeys.includes(record.id) ? <UpOutlined /> : <DownOutlined />}
            onClick={() => toggleExpand(record.id)}
          />
          {text}
        </span>
      ),
    },
    { title: "语言代码", dataIndex: "langEncode" },
    {
      title: "状态",
      dataIndex: "status",
      render: (text: string) =>
        text === 1 ? <Tag color="green">启用</Tag> : <Tag color="red">禁用</Tag>,
    },
    {
      title: "操作",
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => message.info(`更新 ${record.language}`)}>
            更新
          </Button>
          <Button type="link" onClick={() => toggleStatus(record)}>
            {record.status === "enabled" ? "禁用" : "启用"}
          </Button>
          <Button type="link" danger onClick={() => message.warning(`移除 ${record.language}`)}>
            移除
          </Button>
          <Button type="link" onClick={() => message.info(`查看 ${record.language}`)}>
            查看
          </Button>
          <Button type="link" onClick={() => handleUploadClick(record)}>
            上传
          </Button>
        </Space>
      ),
    },
  ];

  // **子表格（翻译文件）**
  const expandedRowRender = (record: any) => {
    return (
      <ProTable
        columns={[
          { title: "端", dataIndex: "platform" },
          { title: "文件名称", dataIndex: "file" },
          { title: "完整度", dataIndex: "completeness" },
          {
            title: "操作",
            render: () => (
              <Space>
                <Button type="link">编辑</Button>
                <Button type="link">下载</Button>
                <Button type="link">上传</Button>
              </Space>
            ),
          },
        ]}
        rowKey="file"
        search={false}
        options={false}
        pagination={false}
        dataSource={record.translations}
      />
    );
  };

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        expandable={{
          expandedRowKeys,
          expandedRowRender,
          onExpand: (expanded, record) => toggleExpand(record.id),
        }}
        search={false}
        toolBarRender={() => [
          <AddModal key="add" />,
        ]}
      />

      {selectedRecord && (
        <UploadModal
          visible={isUploadModalVisible}
          onCancel={() => setIsUploadModalVisible(false)}
          record={selectedRecord}
          onSuccess={() => {
            fetchLanguages(); // 上传成功后刷新列表
          }}
        />
      )}
    </PageContainer>
    
  );
};

export default Language;