import React from "react";
import { PageContainer, ProTable, ProColumns } from "@ant-design/pro-components";
import { Button, Space } from "antd";

// 商户数据
const merchantData = [
  {
    id: "002",
    exchange: "马克的公司",
    contact: "马克",
    registerTime: "2024-12-19 14:00:00",
    activationTime: "2024-12-20 14:00:00",
    expiryTime: "2025-12-19 14:00:00",
    status: "服务中",
  },
  {
    id: "001",
    exchange: "费可贸易",
    contact: "马克",
    registerTime: "2024-12-19 14:00:00",
    activationTime: "--",
    expiryTime: "--",
    status: "未开始",
  },
  {
    id: "001",
    exchange: "费可贸易",
    contact: "马克",
    registerTime: "2023-12-19 14:00:00",
    activationTime: "2023-12-20 14:00:00",
    expiryTime: "2024-12-19 14:00:00",
    status: "已欠费",
  },
  {
    id: "001",
    exchange: "费可贸易",
    contact: "马克",
    registerTime: "2024-12-19 14:00:00",
    activationTime: "--",
    expiryTime: "--",
    status: "未开始",
  },
];

// **单独的 columns 配置**
const columns: ProColumns<any>[] = [
  {
    title: "商户ID",
    dataIndex: "id",
    width: 100,
  },
  {
    title: "交易所名称",
    dataIndex: "exchange",
    width: 150,
  },
  {
    title: "联系人",
    dataIndex: "contact",
    width: 100,
  },
  {
    title: "服务时间",
    dataIndex: "serviceTime",
    width: 300,
    render: (_, record) => (
      <div>
        <div>注册时间: {record.registerTime}</div>
        <div>开通时间: {record.activationTime}</div>
        <div>到期时间: {record.expiryTime}</div>
      </div>
    ),
  },
  {
    title: "服务状态",
    dataIndex: "status",
    width: 100,
    valueType: "select",
    valueEnum: {
      all: { text: "全部", status: "Default" },
      服务中: { text: "服务中", status: "Success" },
      未开始: { text: "未开始", status: "Warning" },
      已欠费: { text: "已欠费", status: "Error" },
    },
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 250,
    render: (_, record) => (
      <Space>
        <a>修改</a>
        {record.status === "未开始" && <a>转为正式商户</a>}
        <a>服务器配置</a>
        {record.status === "服务中" && <a>创建Root账号</a>}
      </Space>
    ),
  },
];

const Free: React.FC = () => {
  return (
    <PageContainer>
      {/* 表格 */}
      <ProTable
        rowKey="id"
        columns={columns} // **使用外部 columns**
        dataSource={merchantData}
        pagination={{ pageSize: 10 }}
        search={{
          labelWidth: "auto",
        }}
        toolBarRender={() => [
          <Button type="primary" key="new">
            + 新建
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default Free;