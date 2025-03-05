import React, { useEffect, useState } from "react";
import { PageContainer, ProTable, ProColumns } from "@ant-design/pro-components";
import { Tabs, Button, Modal } from "antd";
import { tenantList } from "@/services/ant-design-pro/merchant";
import MerchantDetail from "./component/MerchantDetail"; // 引入详情组件

const Charge: React.FC = () => {
    const [activeTab, setActiveTab] = useState("basic");
    const [merchantData, setMerchantData] = useState<any[]>([]);
    const [logData, setLogData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editRecord, setEditRecord] = useState<any>(null);
    const [detailVisible, setDetailVisible] = useState(false);
    const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
    const [showDetail, setShowDetail] = useState(false); // 控制详情显示
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // 获取商户列表数据
    const getList = async (params: any = {}) => {
        setLoading(true);
        try {
            const requestData = {
                pageNo: params.current || 1,
                pageSize: params.pageSize || 10,
                paymentStatus: 1,
                ...(params.tenantId && { tenantId: params.tenantId }),
                ...(params.tenantName && { tenantName: params.tenantName }),
                ...(params.packageId && { packageId: params.packageId })
            };
            
            const res = await tenantList(requestData);
            if (res.code === "0") {
                const listData = res.data.list.filter(item => item.paymentStatus === 1);
                setMerchantData(listData || []);
                setPagination({
                    ...pagination,
                    current: params.current || 1,
                    total: res.data.count || 0
                });
                return {
                    data: listData,
                    success: true,
                    total: res.data.count
                };
            }
            return {
                data: [],
                success: false
            };
        } finally {
            setLoading(false); // 确保无论成功失败都会关闭loading
        }
    };
    // 处理编辑按钮点击
    const handleEdit = (record: any) => {
        setEditRecord(record);
        setEditModalVisible(true);
    };

    const handleViewDetails = (tenantId: string) => {
        setSelectedTenantId(tenantId);
        setShowDetail(true); // 隐藏表格，显示详情
    };

    // 返回列表
    const handleBackToList = () => {
        setShowDetail(false);
        setSelectedTenantId(null);
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
            title: "多语言套餐",
            dataIndex: "packageId",
            valueEnum: {
                1: { text: '基础版' },
                2: { text: '进阶版' },
                3: { text: '高级版' }
            },
            render: (_, record) => {
                const packageMap = {
                    1: "基础版",
                    2: "进阶版",
                    3: "高级版"
                };
                return packageMap[record.packageId] || record.packageId;
            },
        },
        {
            title: "状态",
            dataIndex: "tenantStatus",
            search: false,
            render: (_, record) => <div>{record.tenantStatus === 1 ? "正常" : "禁用"}</div>,
        },
        {
            title: "操作",
            search: false,
            dataIndex: "action",
            render: (_, record) => (
                <>
                     <Button type="link" onClick={() => handleViewDetails(record.tenantId)}>
                    查看
                </Button>
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



    return (
        <PageContainer>
            {/* Tab 切换 */}
            {/* <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginBottom: 16 }}>
                <Tabs.TabPane tab="基本信息" key="basic" />
                <Tabs.TabPane tab="操作日志" key="logs" />
            </Tabs> */}

            {/* ProTable 组件 */}
            {/* <ProTable
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

                ]}
                options={{ density: false, fullScreen: false, reload: false, setting: false }} // 关闭 ProTable 右上角的操作按钮
            /> */}

{showDetail ? (
                <MerchantDetail tenantId={selectedTenantId} onBack={handleBackToList} />
            ) : (
                <ProTable
                    rowKey="tenantId"
                    columns={activeTab === "basic" ? basicColumns : logColumns}
                    dataSource={activeTab === "basic" ? merchantData : logData}
                    request={getList}
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条记录`
                    }}
                    search={{ labelWidth: "auto" }}
                    toolBarRender={() => []}
                    options={{ density: false, fullScreen: false, reload: false, setting: false }}
                />
            )}
            {/* 商户详情弹窗 */}
            {/* <MerchantDetail
                visible={detailVisible}
                tenantId={selectedTenantId}
                onClose={() => setDetailVisible(false)}
            /> */}


        </PageContainer>
    );
};

export default Charge;