import React, { useState, useEffect } from "react";
import { PageContainer, ProTable, ProColumns } from "@ant-design/pro-components";
import { Button, Space, Modal, message } from "antd";
import MerchantEdit from "./component/MerchantEdit";
import { saveTenant, tenantList } from "@/services/ant-design-pro/merchant";
import dayjs from "dayjs";
const Free: React.FC = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [merchantData, setMerchantData] = useState<any[]>([]);
  
  // **获取商户列表**
  const fetchMerchantList = async () => {
    setLoading(true);
    try {
      const res = await tenantList({ pageNo: 1, pageSize: 10 });
      if (res.code === "0") {
        setMerchantData(res.data.list || []);
      } else {
        message.error("获取商户数据失败");
      }
    } catch (error) {
      message.error("请求错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchantList();
  }, []);

  // **打开编辑弹窗**
  const handleEdit = (record: any) => {
    setIsCreating(false);
    setCurrentRecord(record);
    setEditModalVisible(true);
  };

  // **打开新建弹窗**
  const handleCreate = () => {
    setIsCreating(true);
    setCurrentRecord(null);
    setEditModalVisible(true);
  };

  // **提交表单 (新建 / 编辑)**
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const res = await saveTenant(values);
      if (res.code === "0") {
        message.success(isCreating ? "新增商户成功" : "更新商户成功");
        setEditModalVisible(false);
        fetchMerchantList(); // 刷新表格数据
      } else {
        message.error(res.message || "操作失败");
      }
    } catch (error) {
      message.error("请求出错，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // **表格列配置**
  const columns: ProColumns<any>[] = [
    { title: "商户ID", dataIndex: "tenantId", width: 100 },
    { title: "交易所名称", dataIndex: "tenantName", width: 150 },
    { title: "联系人", dataIndex: "tenantContact", width: 100 },
    {
      title: "服务时间",
      dataIndex: "serviceTime",
      width: 300,
      render: (_, record) => (
        <div>
          <div>注册时间：{record.createTime?dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss"):'--'}</div>
          <div>开通时间：{record.tenantStartTime?dayjs(record.tenantStartTime).format("YYYY-MM-DD HH:mm:ss"):'--'}</div>
          <div>到期时间：{record.tenantEndTime?dayjs(record.tenantEndTime).format("YYYY-MM-DD HH:mm:ss"):'--'}</div>
        </div>
      ),
    },
    {
      title: "服务状态",
      dataIndex: "tenantStatus",
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
          <a onClick={() => handleEdit(record)}>修改</a>
          {record.status === "未开始" && <a>转为正式商户</a>}
          <a>服务器配置</a>
          {record.status === "服务中" && <a>创建Root账号</a>}
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
        dataSource={merchantData}
        loading={loading}
        pagination={{ pageSize: 10 }}
        search={{ labelWidth: "auto" }}
        toolBarRender={() => [
          <Button type="primary" key="new" onClick={handleCreate}>
            + 新建
          </Button>,
        ]}
      />

      {/* 商户编辑/新建弹窗 */}
      <Modal
        title={isCreating ? "新增商户" : "编辑商户"}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
      >
        <MerchantEdit
          record={currentRecord}
          isCreating={isCreating}
          onSubmit={handleSubmit}
          onCancel={() => setEditModalVisible(false)}
        />
      </Modal>
    </PageContainer>
  );
};

export default Free;