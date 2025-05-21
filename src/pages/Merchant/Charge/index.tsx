import React, { useEffect, useState } from "react";
import { PageContainer, ProTable, ProColumns } from "@ant-design/pro-components";
import { Tabs, Button } from "antd";
import { tenantList } from "@/services/ant-design-pro/merchant";
import MerchantDetail from "./component/MerchantDetail";
import { getUserOperationLogs } from "@/services/ant-design-pro/UserManagement";
const Charge: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("basic");
    const [merchantData, setMerchantData] = useState<any[]>([]);
    const [logData, setLogData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
    const [showDetail, setShowDetail] = useState(false); // 控制详情显示
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // 获取商户列表数据
    const getList = async (params: any = {}): Promise<any> => {
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


    // 获取操作日志
    const getLogList = async (params: any = {}): Promise<void> => {
    let data={
        pageNo: params.current || 1,
        pageSize: params.pageSize || 10,
    }
        const res = await getUserOperationLogs(data);
        if (res.code === "0") {
            setLogData(res.data.list);
        }
    };
    const handleViewDetails = (tenantId: string): void => {
        setSelectedTenantId(tenantId);
        setShowDetail(true); // 隐藏表格，显示详情
    };

    // 返回列表
    const handleBackToList = (): void => {
        setShowDetail(false);
        setSelectedTenantId(null);
    };
    

    useEffect(() => {
        getLogList();
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
            title: "账户状态",
            dataIndex: "tenantStatus",
            search: false,
            render: (_, record) => <div>{record.tenantStatus === 1 ? "服务中" : "已欠费"}</div>,
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
            dataIndex: "createTime",
            valueType: "dateTime",
            search: false,
        },
        {
            title: "操作管理员",
            dataIndex: "userId",
            search: false,
        },
        {
            title: "操作行为",
            dataIndex: "operationType",
            search: false,
        },
        {
            title: "操作前",
            dataIndex: "beforeValue",
            search: false,
        },
        {
            title: "操作后",
            dataIndex: "afterValue",
            search: false,
        },
        {
            title: "备注信息",
            dataIndex: "remarkMsg",
            search: false,
        },
    ];



    return (
        <PageContainer>
            {/* Tab 切换 */}
            <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginBottom: 16 }}>
                <Tabs.TabPane tab="基本信息" key="basic" />
                <Tabs.TabPane tab="操作日志" key="logs" />
            </Tabs>

            {showDetail ? (
                <MerchantDetail tenantId={selectedTenantId} onBack={handleBackToList} />
            ) : activeTab === 'basic' ? (
                <ProTable
                    rowKey="tenantId"
                    columns={basicColumns}
                    dataSource={merchantData}
                    request={getList}
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条记录`
                    }}
                    toolBarRender={() => []}
                    options={{ density: false, fullScreen: false, reload: false, setting: false }}
                />
            ) : (
                <ProTable
                    rowKey="id"
                    columns={logColumns}
                    dataSource={logData}
                    request={getList}
                    loading={loading}
                    search={false}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条记录`
                    }}
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