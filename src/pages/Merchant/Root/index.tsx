import React, { useState } from "react";
import { PageContainer, ProTable, ProColumns } from "@ant-design/pro-components";
import { Button, Space, message } from "antd";
import RootModal from "./component/RootModal";
import { saveTenantRoot } from "@/services/ant-design-pro/merchant";


// **模拟商户数据**
const initialData = [
  {
    id: "1122",
    exchange: "IM",
    status: "服务中",
    contact: "小李",
    email: "12@qq.com",
    phone: "12221",
    accountStatus: "正常",
    createdAt: "2022-12-25 12:12:12",
  },
  {
    id: "11223",
    exchange: "IMBIT",
    status: "已欠费",
    contact: "小王",
    email: "445@qq.com",
    phone: "--",
    accountStatus: "冻结",
    createdAt: "2022-12-25 12:12:12",
  },
];

const Root: React.FC = () => {
  const [dataSource, setDataSource] = useState(initialData);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);

  // **打开 "新建 / 编辑" 弹窗**
  const handleOpenModal = (record?: any) => {
    setCurrentRecord(record || null);
    setModalVisible(true);
  };

  // **处理表单提交**
  const handleSave = (values: any) => {
    if (currentRecord) {
      // **编辑模式**
    //   setDataSource((prev) =>
    //     prev.map((item) => (item.id === currentRecord.id ? { ...item, ...values } : item))
    //   );

      let res=saveTenantRoot(values);{
        if(res.code === "0"){
            message.success("商户信息更新成功！");
        }else{
            message.error(res.message || "操作失败");
        }
      }
      
    } else {
      // **新建模式**
      let res=saveTenantRoot(values);{
        if(res.code === "0"){
            message.success("商户信息更新成功！");
        }else{
            message.error(res.message || "操作失败");
        }
      }

    }
    setModalVisible(false);
  };

  // **表格列配置**
  const columns: ProColumns<any>[] = [
    {
      title: "商户ID",
      dataIndex: "id",
    },
    {
      title: "交易所名称",
      dataIndex: "exchange",
    },
    {
      title: "交易所状态",
      dataIndex: "status",
      valueType: "select",
      valueEnum: {
        服务中: { text: "服务中", status: "Success" },
        已欠费: { text: "已欠费", status: "Error" },
      },
    },
    {
      title: "联系人",
      dataIndex: "contact",
    },
    {
      title: "邮箱",
      dataIndex: "email",
    },
    {
      title: "手机号",
      dataIndex: "phone",
    },
    {
      title: "状态",
      dataIndex: "accountStatus",
      valueType: "select",
      valueEnum: {
        正常: { text: "正常", status: "Success" },
        冻结: { text: "冻结", status: "Error" },
      },
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      valueType: "dateTime",
    },
    {
      title: "操作",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
          <a onClick={() => handleOpenModal(record)}>编辑</a>
          {record.accountStatus === "正常" ? (
            <a style={{ color: "red" }}>禁止登录</a>
          ) : (
            <a style={{ color: "green" }}>允许登录</a>
          )}
          <a>重置密码</a>
          <a>重置谷歌</a>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      {/* 表格 */}
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 10 }}
        search={{ labelWidth: "auto" }}
        toolBarRender={() => [
          <Button type="primary" key="new" onClick={() => handleOpenModal()}>
            + 新建
          </Button>,
        ]}
      />

      {/* 新建 / 编辑商户弹窗组件 */}
     
    </PageContainer>
  );
};

export default Root;