import React, { useState } from "react";
import { PageContainer, ProTable, ProColumns } from "@ant-design/pro-components";
import { Tabs, Button } from "antd";

// 模拟数据 - 基本信息
const basicData = [
    {
        id: 232,
        exchange: "马克的公司",
        email: "--",
        contact: "小马",
        expiryTime: "2021-02-28 10:30",
        activationTime: "2021-02-28 10:30",
        status: "服务中",
    },
    {
        id: 254,
        exchange: "费可的公司",
        email: "123@qq.com",
        contact: "小费",
        expiryTime: "2021-02-28 10:30",
        activationTime: "2021-02-28 10:30",
        status: "已欠费",
    },
];

// 模拟数据 - 操作日志
const logData = [
    {
        time: "2021-02-28 10:30",
        admin: "马克",
        action: "重置密码",
        before: "重置密码",
        after: "重置密码",
        remark: "--",
    },
];

// **基本信息表格的列定义**
const basicColumns: ProColumns<any>[] = [
    {
        title: "商户ID",
        dataIndex: "id",
    },
    {
        title: "交易所名称",
        dataIndex: "exchange",
    },
    {
        title: "邮箱",
        dataIndex: "email",
    },
    {
        title: "联系人",
        dataIndex: "contact",
    },
    {
        title: "到期时间",
        dataIndex: "expiryTime",
        valueType: "dateTime",
    },
    {
        title: "开通时间",
        dataIndex: "activationTime",
        valueType: "dateTime",
    },
    {
        title: "状态",
        dataIndex: "status",
        valueType: "select",
        valueEnum: {
            all: { text: "全部", status: "Default" },
            服务中: { text: "服务中", status: "Success" },
            已欠费: { text: "已欠费", status: "Error" },
        },
    },
    {
        title: "操作",
        dataIndex: "action",
        render: () => <a href="#">查看</a>,
    },
];

// **操作日志表格的列定义**
const logColumns: ProColumns<any>[] = [
    {
        title: "操作时间",
        dataIndex: "time",
        valueType: "dateTime",
    },
    {
        title: "操作管理员",
        dataIndex: "admin",
    },
    {
        title: "操作行为",
        dataIndex: "action",
    },
    {
        title: "操作前",
        dataIndex: "before",
    },
    {
        title: "操作后",
        dataIndex: "after",
    },
    {
        title: "备注信息",
        dataIndex: "remark",
    },
];

const Charge: React.FC = () => {
    const [activeTab, setActiveTab] = useState("basic");

    return (
        <PageContainer>
            {/* Tab 切换 */}
            <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginBottom: 16 }}>
                <Tabs.TabPane tab="基本信息" key="basic" />
                <Tabs.TabPane tab="操作日志" key="logs" />
            </Tabs>

            {/* 表格 */}
            <ProTable
                rowKey={activeTab === "basic" ? "id" : "time"}
                columns={activeTab === "basic" ? basicColumns : logColumns}
                dataSource={activeTab === "basic" ? basicData : logData}
                pagination={{ pageSize: 10 }}
                search={{ labelWidth: "auto" }} // **使用 ProTable 自带的搜索条件**
                toolBarRender={() =>
                    activeTab === "basic"
                        ? [
                              <Button type="primary" key="new" style={{ background: "#52c41a" }}>
                                  + 新建
                              </Button>,
                          ]
                        : []
                }
                options={false} // 关闭 ProTable 右上角的操作按钮
            />
        </PageContainer>
    );
};

export default Charge;