import React, { useEffect, useState } from "react";
import { PageContainer, ProTable, ProColumns } from "@ant-design/pro-components";
import { Tabs, Button, Modal } from "antd";
import { tenantList } from "@/services/ant-design-pro/merchant";
import MerchantEdit from "./component/MerchantEdit";

const Charge: React.FC = () => {
    const [activeTab, setActiveTab] = useState("basic");
    const [merchantData, setMerchantData] = useState<any[]>([]);
    const [logData, setLogData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editRecord, setEditRecord] = useState<any>(null);

    // 获取商户列表数据
    const getList = async () => {
        setLoading(true);
        const requestData = {
            pageNo: 1, 
            pageSize: 10,
            paymentStatus:1
            // tenantId: "",
            // tenantName: "",
            // tenantContact: "",
            // tenantPhone: "",
            // tenantEmail: "",

        };
        const res = await tenantList(requestData);
        if (res.code === "0") {
            const listData= res.data.list.filter(item => item.paymentStatus === 1);
            setMerchantData(listData || []);
        }
        setLoading(false);
    };

    useEffect(() => {

    }, []);

    // **基本信息表格的列**
    const basicColumns: ProColumns<any>[] = [
        {
            title: "商户ID",
            dataIndex: "tenantId",
        },
        {
            title: "交易所名称",
            dataIndex: "tenantName",
        },
        {
            title: "邮箱",
            dataIndex: "tenantEmail",
            search: false,
        },
        {
            title: "联系人",
            dataIndex: "tenantContact",
            search: false,
        },
        {
            title: "到期时间",
            dataIndex: "tenantEndTime",
            valueType: "dateTime",
            search: false,
        },
        {
            title: "开通时间",
            dataIndex: "tenantStartTime",
            valueType: "dateTime",
            search: false,
        },
        {
            title: "状态",
            dataIndex: "tenantStatus",
            valueType: "select",
            search: false,
            valueEnum: {
                all: { text: "全部", status: "Default" },
                服务中: { text: "服务中", status: "Success" },
                已欠费: { text: "已欠费", status: "Error" },
            },
        },
        {
            title: "操作",
            search: false,
            dataIndex: "action",
            render: (_, record) => (
                <>
                    <a onClick={() => handleEdit(record)}>编辑</a> | <a>查看</a>
                </>
            ),
        },
    ];

    // **操作日志表格的列**
    const logColumns: ProColumns<any>[] = [
        {
            title: "操作时间",
            dataIndex: "time",
            valueType: "dateTime",
            search: false,
        },
        {
            title: "操作管理员",
            dataIndex: "admin",
            search: false,
        },
        {
            title: "操作行为",
            dataIndex: "action",
            search: false,
        },
        {
            title: "操作前",
            dataIndex: "before",
            search: false,
        },
        {
            title: "操作后",
            dataIndex: "after",
            search: false,
        },
        {
            title: "备注信息",
            dataIndex: "remark",
            search: false,
        },
    ];

    // 处理编辑按钮点击
    const handleEdit = (record: any) => {
        setEditRecord(record);
        setEditModalVisible(true);
    };

    return (
        <PageContainer>
            {/* Tab 切换 */}
            <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginBottom: 16 }}>
                <Tabs.TabPane tab="基本信息" key="basic" />
                <Tabs.TabPane tab="操作日志" key="logs" />
            </Tabs>

            {/* ProTable 组件 */}
            <ProTable
                rowKey="id"
                columns={activeTab === "basic" ? basicColumns : logColumns}
                dataSource={activeTab === "basic" ? merchantData : logData}
                loading={loading}
                pagination={{ pageSize: 10 }}
                search={{ labelWidth: "auto" }} // **ProTable 自带的搜索**
                request={async (params) => {
                    if (activeTab === "logs") return { data: logData, success: true };
                    await getList();
                    return { data: merchantData, success: true };
                }}
                toolBarRender={() => [
                    <Button type="primary" key="new">
                        + 新建
                    </Button>,
                ]}
                options={{ density: false, fullScreen: false, reload: false, setting: false }} // 关闭 ProTable 右上角的操作按钮
            />

            {/* 商户编辑弹窗 */}
            <Modal
                title="编辑商户"
                open={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                footer={null}
                width={600}
            >
                <MerchantEdit record={editRecord} onCancel={() => setEditModalVisible(false)} />
            </Modal>
        </PageContainer>
    );
};

export default Charge;