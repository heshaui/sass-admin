import React, { useState, useEffect } from "react";
import { PageContainer, ProTable, ProColumns } from "@ant-design/pro-components";
import { Button, Space, Modal, message } from "antd";
import MerchantEdit from "./component/MerchantEdit";
import ServerAdmin from "./component/ServerAdmin";
import ConvertToPaid from "./component/ConvertToPaid"; 
import RootModal from "./component/RootModal";
import { saveTenant, tenantList,updateTenantById,saveTenantRoot } from "@/services/ant-design-pro/merchant";
import dayjs from "dayjs";

const Free: React.FC = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [serverModalVisible, setServerModalVisible] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [convertModalVisible, setConvertModalVisible] = useState(false);
  const [merchantData, setMerchantData] = useState<any[]>([]);

  // **获取商户列表**
  const fetchMerchantList = async () => {
    setLoading(true);
    try {
      const res = await tenantList({ pageNo: 1, pageSize: 10});
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

  // **打开服务器管理弹窗**
  const handleServerConfig = (record: any) => {
    setCurrentRecord(record);
    setServerModalVisible(true);
  };

  // **提交商户表单**
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const res = await saveTenant(values);
      if (res.code === "0") {
        message.success(isCreating ? "新增商户成功" : "更新商户成功");
        setEditModalVisible(false);
        fetchMerchantList();
      } else {
        message.error(res.message || "操作失败");
      }
    } catch (error) {
      message.error("请求出错，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // **提交服务器配置**
  const handleServerSubmit = async (values: any) => {
    let data={
      tenantId:currentRecord.tenantId,
      tenantHost:values.tenantHost
    }
   let res=await updateTenantById(data);
   if(res.code==='0'){
    message.success("服务器配置已更新");
    setServerModalVisible(false);
   }
    
  };

  const handleConvertToPaid = (record: any) => {
    setCurrentRecord(record);
    setConvertModalVisible(true);
  };

  // **提交 "转为正式商户" 操作**
  const handleConvertSubmit =async (values: any) => {
    // console.log("转为正式商户:", values);
    // 
    let data={
      tenantId:currentRecord.tenantId,
      paymentStatus:1,
      tenantEndTime:dayjs(values.tenantEndTime).valueOf()
      

    } 
   let res=await updateTenantById(data);
   if(res.code==='0'){
    message.success("商户已转为正式商户！");
    setConvertModalVisible(false);
    fetchMerchantList();
   }
    
   
  };


  const handleSave=async (values:any)=>{
    let data={
      tenantId:currentRecord.tenantId,
      ...values
    }
    const res=await saveTenantRoot(data);
    if(res.code==='0'){
      message.success("root账户创建成功");
    }
    setModalVisible(false);
  }


  const handleOpenModal = (record?: any) => {
    setCurrentRecord(record || null);
    setModalVisible(true);
  }

  // **表格列配置**
  const columns: ProColumns<any>[] = [
    { title: "商户ID", dataIndex: "tenantId", width: 100 },
    { title: "交易所名称", dataIndex: "tenantName", width: 150 },
    { title: "联系人", dataIndex: "tenantContact", width: 100 },
    {
      title: "服务时间",
      dataIndex: "serviceTime",
      render: (_, record) => (
        <div>
          <div>注册时间：{record.createTime ? dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss") : "--"}</div>
          <div>开通时间：{record.tenantStartTime ? dayjs(record.tenantStartTime).format("YYYY-MM-DD HH:mm:ss") : "--"}</div>
          <div>到期时间：{record.tenantEndTime ? dayjs(record.tenantEndTime).format("YYYY-MM-DD HH:mm:ss") : "--"}</div>
        </div>
      ),
    },
    {
      title: "服务状态",
      dataIndex: "tenantStatus",
      render: (_, record) => <div>{record.tenantStatus === 1 ? "正常" : "禁用"}</div>,
    },
    // {
    //   title: "付费状态",
    //   dataIndex: "paymentStatus",
    //   render: (_, record) => <div>{record.paymentStatus === 1 ? "付费" : "免费"}</div>,
    // },
    {
      title: "操作",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>修改</a>
          {record.paymentStatus !== 1 ? <a onClick={() => handleConvertToPaid(record)}>转为正式商户</a> : ""}
          <a onClick={() => handleServerConfig(record)}>服务器配置</a>
          <a onClick={() => handleOpenModal(record)}>创建Root账号</a>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      {/* 表格 */}
      <ProTable
        rowKey="tenantId"
        columns={columns}
        dataSource={merchantData.filter(item => item.paymentStatus === 0)}
        loading={loading}
        pagination={{ pageSize: 10 }}
        search={{ labelWidth: "auto" }}
        toolBarRender={() => [
          <Button type="primary" key="new" onClick={handleCreate}>
            + 新建
          </Button>,
        ]}
      />

      {/* 商户编辑弹窗 */}
      <Modal
        title={isCreating ? "新增商户" : "编辑商户"}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
      >
        <MerchantEdit record={currentRecord} isCreating={isCreating} onSubmit={handleSubmit} onCancel={() => setEditModalVisible(false)} />
      </Modal>

      {/* 服务器管理弹窗 */}
      <ServerAdmin visible={serverModalVisible} onCancel={() => setServerModalVisible(false)} onSubmit={handleServerSubmit} initialValues={currentRecord} />
      <ConvertToPaid
        visible={convertModalVisible}
        onCancel={() => setConvertModalVisible(false)}
        onSubmit={handleConvertSubmit}
        initialValues={currentRecord}
      />
       <RootModal
              visible={modalVisible}
              onCancel={() => setModalVisible(false)}
              onSave={handleSave}
              initialValues={currentRecord}
            />
    </PageContainer>
  );
};

export default Free;