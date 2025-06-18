import React, { useEffect, useState } from "react";
import { PageContainer, ProTable, ProColumns } from "@ant-design/pro-components";
import { Tabs, Button } from "antd";
import { useIntl } from '@umijs/max';
import { tenantList } from "@/services/ant-design-pro/merchant";
import MerchantDetail from "./component/MerchantDetail";
import { getUserOperationLogs } from "@/services/ant-design-pro/UserManagement";

type PackageType = 1 | 2 | 3;

const Charge: React.FC = () => {
    const intl = useIntl();
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
                const listData = res.data.list.filter((item: any) => item.paymentStatus === 1);
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
            title: intl.formatMessage({ id: 'charge.table.merchantId' }),
            dataIndex: "tenantId",
        },
        {
            title: intl.formatMessage({ id: 'charge.table.exchangeName' }),
            dataIndex: "tenantName",
        },
        {
            title: intl.formatMessage({ id: 'charge.table.email' }),
            dataIndex: "tenantEmail",
            search: false,
        },
        {
            title: intl.formatMessage({ id: 'charge.table.contact' }),
            dataIndex: "tenantContact",
            search: false,
        },
        {
            title: intl.formatMessage({ id: 'charge.table.expiryTime' }),
            dataIndex: "tenantEndTime",
            valueType: "dateTime",
            search: false,
        },
        {
            title: intl.formatMessage({ id: 'charge.table.activationTime' }),
            dataIndex: "tenantStartTime",
            valueType: "dateTime",
            search: false,
        },
        {
            title: intl.formatMessage({ id: 'charge.table.languagePackage' }),
            dataIndex: "packageId",
            valueEnum: {
                1: { text: intl.formatMessage({ id: 'charge.table.package.basic' }) },
                2: { text: intl.formatMessage({ id: 'charge.table.package.standard' }) },
                3: { text: intl.formatMessage({ id: 'charge.table.package.premium' }) }
            },
            render: (_, record) => {
              const packageMap: Record<PackageType, string> = {
                1: intl.formatMessage({ id: 'charge.table.package.basic' }),
                2: intl.formatMessage({ id: 'charge.table.package.standard' }),
                3: intl.formatMessage({ id: 'charge.table.package.premium' })
            };
            return packageMap[record.packageId as PackageType] || record.packageId;
            },
        },
        {
            title: intl.formatMessage({ id: 'charge.table.accountStatus' }),
            dataIndex: "tenantStatus",
            search: false,
            render: (_, record) => (
                <div>
                    {record.tenantStatus === 1
                        ? intl.formatMessage({ id: 'charge.table.status.active' })
                        : intl.formatMessage({ id: 'charge.table.status.overdue' })}
                </div>
            ),
        },
        {
            title: intl.formatMessage({ id: 'charge.table.action' }),
            search: false,
            dataIndex: "action",
            render: (_, record) => (
                <Button type="link" onClick={() => handleViewDetails(record.tenantId)}>
                    {intl.formatMessage({ id: 'charge.table.action.view' })}
                </Button>
            ),
        },
    ];

    // **操作日志表格的列**
    const logColumns: ProColumns<any>[] = [
        {
            title: intl.formatMessage({ id: 'charge.log.operationTime' }),
            dataIndex: "createTime",
            valueType: "dateTime",
            search: false,
        },
        {
            title: intl.formatMessage({ id: 'charge.log.operator' }),
            dataIndex: "userId",
            search: false,
        },
        {
            title: intl.formatMessage({ id: 'charge.log.operationType' }),
            dataIndex: "operationType",
            search: false,
        },
        {
            title: intl.formatMessage({ id: 'charge.log.before' }),
            dataIndex: "beforeValue",
            search: false,
        },
        {
            title: intl.formatMessage({ id: 'charge.log.after' }),
            dataIndex: "afterValue",
            search: false,
        },
        {
            title: intl.formatMessage({ id: 'charge.log.remarks' }),
            dataIndex: "remarkMsg",
            search: false,
        },
    ];



    return (
        <PageContainer>
            {/* Tab 切换 */}
            <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginBottom: 16 }}>
                <Tabs.TabPane
                    tab={intl.formatMessage({ id: 'charge.tab.basic' })}
                    key="basic"
                />
                <Tabs.TabPane
                    tab={intl.formatMessage({ id: 'charge.tab.logs' })}
                    key="logs"
                />
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
                        showTotal: (total) =>total
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
                        showTotal: (total) =>total
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
