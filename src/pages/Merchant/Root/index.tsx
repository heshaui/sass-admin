import React, { useEffect, useState } from "react";
import { PageContainer, ProTable, ProColumns } from "@ant-design/pro-components";
import { Button, Space, message } from "antd";
import RootModal from "./component/RootModal";
import { tenantRootList,updatePasswordById, updateGoogleById,updateTenantRootById} from "@/services/ant-design-pro/merchant";
import { get } from "lodash";



const Root: React.FC = () => {
  const [dataSource, setDataSource] = useState([]);


  const getList=async()=>{
    let data={
      pageNo:1,
      pageSize:10
    }
    const res=await tenantRootList(data);
    if(res.code==='0'){
      setDataSource(res.data.list)
    }else{
      message.error("获取商户列表失败")
    }
  }

  const resetPassword=async(id:string)=>{
    
    const res=await updatePasswordById(id);
    if(res.code==='0'){
      message.success("重置密码成功")
    }else{
      message.error("重置密码失败")
    }
  }

  const resetGoogle=async(id:string)=>{
    
    const res=await updateGoogleById(id);
    if(res.code==='0'){
      message.success("重置谷歌成功")
    }else{
      message.error("重置谷歌失败")
    }
  }

  const changeStatus=async(id:string,status:number)=>{
    let data={
      id:id,
      status:status
    }
    const res=await updateTenantRootById(data);
    if
    (res.code==='0'){
      if(status===1){
        message.success("允许登录成功")
      }else{
        message.success("禁止登录成功")
      }
     await getList()
    }
    else{
      message.error("修改状态失败")
    }
  }
  

 

  useEffect(() => {
    getList()
  } ,[]);

  // **表格列配置**
  const columns: ProColumns<any>[] = [
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title:'nickname',
      dataIndex:'nickname'
    },
    {
      title: "交易所名称",
      dataIndex: "tenantName",
    },
    {
      title: "状态",
      dataIndex: "status",
      render:(_,record)=>{
        return record.status===1?'正常':'冻结'
      }

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

           {record.status === 1 ? (
              <a style={{ color: "red" }} onClick={()=>changeStatus(record.id,0)}>禁止登录</a>
          ) : (
             <a style={{ color: "green" }} onClick={()=>changeStatus(record.id,1)}>允许登录</a>
          )} 
        
         
          <a onClick={()=>resetPassword(record.id)}>重置密码</a>
          <a onClick={()=>resetGoogle(record.id)}>重置谷歌</a>
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
          
        ]}
      />

      {/* 新建 / 编辑商户弹窗组件 */}
     
    </PageContainer>
  );
};

export default Root;