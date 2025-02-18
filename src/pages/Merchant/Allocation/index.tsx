import React, { useState, useEffect } from "react";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, Space, message } from "antd";
import AddCategoryModal from "./component/AddCategoryModal"; // 引入封装好的模态框组件
import { tenantRoleList, saveTenantRole, updateTenantRoleById } from "@/services/ant-design-pro/merchant"; // API 接口

const getColumns = (handleEdit: (record: any) => void) => [
  { title: "id", dataIndex: "roleId", key: "roleId" },
  { title: "分类名称", dataIndex: "roleName", key: "roleName" },
  { title: "分类描述", dataIndex: "describe", key: "describe" },
  {
    title: "操作",
    key: "action",
    render: (_, record) => (
      <Space>
        <Button type="link" onClick={() => handleEdit(record)}>
          修改
        </Button>
      </Space>
    ),
  },
];

const Allocation: React.FC = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null); // 当前编辑的记录

  // 获取列表数据
  const fetchRoleList = async () => {
    try {
      setLoading(true);
      let data = { pageNo: 1, pageSize: 10 };
      const response = await tenantRoleList(data);
      if (response?.data) {
        setDataSource(response.data.list);
      }
    } catch (error) {
      console.error("获取列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时调用
  useEffect(() => {
    fetchRoleList();
  }, []);

  // 添加
  const handleAdd = () => {
    setEditingRecord(null); // 进入新增模式
    setModalVisible(true);
  };

  // 修改
  const handleEdit = (record: any) => {
    setEditingRecord(record); // 进入编辑模式
    setModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setModalVisible(false);
  };

  // 提交新增/修改
  const handleSubmit = async (formData: any) => {
    try {
      if (editingRecord) {
        // 调用更新 API
      let resp=  await updateTenantRoleById({ roleId: editingRecord.roleId, ...formData });
      if(resp.code==='0'){
        message.success("修改成功");
      }
        
      } else {
        // 调用新增 API
       let res= await saveTenantRole(formData);
        if(res.code==='0'){
          message.success("新增成功");
        }
       
      }

      fetchRoleList(); // 重新加载数据
      handleCancel();
    } catch (error) {
      message.error("操作失败");
    }
  };

  return (
    <PageContainer>
      <ProTable
        rowKey="roleId"
        search={false}
        loading={loading} // 显示加载状态
        toolBarRender={() => [
          <Button type="primary" key="add" onClick={handleAdd}>
            添加
          </Button>,
        ]}
        columns={getColumns(handleEdit)}
        dataSource={dataSource}
        pagination={false}
      />

      {/* 引入封装的模态框 */}
      <AddCategoryModal
        visible={modalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        editingRecord={editingRecord} // 传递当前编辑的记录
      />
    </PageContainer>
  );
};

export default Allocation;