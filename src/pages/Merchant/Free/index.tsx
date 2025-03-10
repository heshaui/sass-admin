import React, { useState, useEffect, useRef } from "react";
import { PageContainer, ProTable, ProColumns } from "@ant-design/pro-components";
import { Button, Space, Modal, message } from "antd";
import MerchantEdit from "./component/MerchantEdit";
import ServerAdmin from "./component/ServerAdmin";
import ConvertToPaid from "./component/ConvertToPaid"; 
import { saveTenant, tenantList,updateTenantById,saveTenantRoot,updatePaymentStatusById } from "@/services/ant-design-pro/merchant";
import dayjs from "dayjs";

const Free: React.FC = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [serverModalVisible, setServerModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [convertModalVisible, setConvertModalVisible] = useState(false);
  const [merchantData, setMerchantData] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const merchantEditRef = useRef(null);
  const [resetFlag, setResetFlag] = useState(false);
  const formRef = useRef(null);

  // **获取商户列表**
  const fetchMerchantList = async (params = {}) => {
    setLoading(true);
    try {
      const res = await tenantList({ 
        pageNo: params.current || 1, 
        pageSize: params.pageSize || 10,
        tenantId: params.tenantId,
        tenantName: params.tenantName,
        tenantStatus: params.tenantStatus,
      });
      if (res.code === "0") {
        setMerchantData(res.data.list || []);
        setPagination({
          ...pagination,
          current: params.current || 1,
          total: res.data.count || 0,
        });
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

  // **关闭模态框时清除表单内容**
  const handleCloseModal = () => {
    setEditModalVisible(false);
    setCurrentRecord(null);
    setResetFlag(true);
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
      if (isCreating) {
        await saveTenant(values);
        message.success('新增商户成功');
      } else {
        await updateTenantById(values);
        message.success('更新商户成功');
      }
      
      // 重新获取列表数据
      fetchMerchantList();
      
      // 关闭弹窗
      handleCloseModal();
      
      // 如果是新建模式，直接重置表单
      if (isCreating && formRef.current) {
        formRef.current.resetFields();
      }
    } catch (error) {
      message.error('操作失败：' + error.message);
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
   }else{
    message.error(res.message);
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
   let res=await updatePaymentStatusById(data);
   if(res.code==='0'){
    message.success("商户已转为正式商户！");
    setConvertModalVisible(false);
    fetchMerchantList();
   }else{
    message.error(res.message);
   }
    
   
  };

  const handleSave = async (record: any) => {
    Modal.confirm({
      title: '创建Root账号',
      content: '确认创建后，系统将根据企业信息自动生成Root管理员信息。您可以前往Root管理查看！',
      onOk: async () => {
        let data = {
          tenantId: record.tenantId,
          email:record.tenantEmail,
          phone:record.tenantPhone,
          nickname:record.tenantContact,
        }
        const res = await saveTenantRoot(data);
        if(res.code === '0'){
          message.success("root账户创建成功");
        }else{
          message.error("root账户创建失败");
        }
      },
      onCancel() {
        // 用户取消操作
      },
    });
  }

  // **表格列配置**
  const columns: ProColumns<any>[] = [
    { title: "商户ID", dataIndex: "tenantId" },
    { title: "交易所名称", dataIndex: "tenantName" },
    { 
      title: "联系人", 
      dataIndex: "tenantContact",
      search: false  // 禁用搜索
    },
    {
      title: "服务时间",
      dataIndex: "serviceTime",
      search: false,  // 禁用搜索
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
      valueType: 'select',
      valueEnum: {
        1: { text: '正常' },
        0: { text: '禁用' }
      },
      render: (_, record) => <div>{record.tenantStatus === 1 ? "正常" : "禁用"}</div>,
    },
    // {
    //   title: "付费状态",
    //   dataIndex: "paymentStatus",
    //   render: (_, record) => <div>{record.paymentStatus === 1 ? "付费" : "免费"}</div>,
    // },
    {
      title: "操作",
      search: false,
      dataIndex: "action",
      render: (_, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>修改</a>
          {record.paymentStatus !== 1 ? <a onClick={() => handleConvertToPaid(record)}>转为正式商户</a> : ""}
          <a onClick={() => handleServerConfig(record)}>服务器配置</a>
          <a onClick={() => handleSave(record)}>创建Root账号</a>
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
        dataSource={merchantData}
        loading={loading}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => {
            fetchMerchantList({ current: page, pageSize });
          },
        }}
        search={{ labelWidth: "auto" }}
        request={async (params) => {
          await fetchMerchantList(params);
          return {
            data: merchantData,
            success: true,
            total: pagination.total
          };
        }}
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
        onCancel={handleCloseModal}
        footer={null}
        width={600}
        destroyOnClose={true}
      >
        <MerchantEdit 
          ref={formRef}
          record={currentRecord} 
          isCreating={isCreating} 
          onSubmit={handleSubmit} 
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* 服务器管理弹窗 */}
      <ServerAdmin visible={serverModalVisible} onCancel={() => setServerModalVisible(false)} onSubmit={handleServerSubmit} initialValues={currentRecord} />
      <ConvertToPaid
        visible={convertModalVisible}
        onCancel={() => setConvertModalVisible(false)}
        onSubmit={handleConvertSubmit}
        initialValues={currentRecord}
      />
    </PageContainer>
  );
};

export default Free;