import React, { useEffect, useState } from "react";
import { PageContainer, ProTable, ProColumns } from "@ant-design/pro-components";
import { Button, Space, message, Modal } from "antd";
import RootModal from "./component/RootModal";
import { tenantRootList,updatePasswordById, updateGoogleById,updateTenantRootById,updateRoleById} from "@/services/ant-design-pro/merchant";




const Root: React.FC = () => {
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null); // 选中的用户信息


  const getList = async (params: any = {}) => {
    const { current, pageSize, ...restParams } = params;
    let data = {
      pageNo: current || 1,
      pageSize: pageSize || 10,
      ...restParams
    }
    const res = await tenantRootList(data);
    if (res.code === '0') {
      setDataSource(res.data.list);
      return {
        data: res.data.list,
        success: true,
        total: res.data.count,
      };
    } else {
      message.error("获取商户列表失败");
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  }

  const resetPassword=async(id:string)=>{
    Modal.confirm({
      title: '确认重置密码',
      content: '确定要重置该用户的密码吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res=await updatePasswordById(id);
        if(res.code==='0'){
          message.success("重置密码成功")
        }else{
          message.error("重置密码失败")
        }
      }
    });
  }

  const resetGoogle=async(id:string)=>{
    Modal.confirm({
      title: '确认重置谷歌',
      content: '确定要重置该用户的谷歌验证吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res=await updateGoogleById(id);
        if(res.code==='0'){
          message.success("重置谷歌成功")
        }else{
          message.error("重置谷歌失败")
        }
      }
    });
  }

  const changeStatus=async(id:string,status:number)=>{
    Modal.confirm({
      title: status === 1 ? '确认允许登录' : '确认禁止登录',
      content: status === 1 ? '确定要允许该用户登录吗？' : '确定要禁止该用户登录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        let data={
          id:id,
          status:status
        }
        const res=await updateTenantRootById(data);
        if(res.code==='0'){
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
    });
  }
    // **角色分配**
    const handleRoleAssign = (record: any) => {
      setCurrentRecord(record);
      setModalVisible(true);
    };
  
    // **提交角色分配**
    const handleRoleSubmit = async (roleId: string) => {

      try {
        const data = { id: currentRecord.id, roleIds:roleId };
        const res = await updateRoleById(data);
        console.log(res)
        if (res.code === "0") {
          message.success("角色分配成功");
          getList();
        } else {
          message.error("角色分配失败");
        }
      } catch (error) {
        console.error( error);
        message.error("角色分配异常");
      } finally {
        setModalVisible(false);
      }
    };

 

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
      title: "交易所名称",
      dataIndex: "nickname",
      search:false, 
    },
    {
      title: "状态",
      dataIndex: "status",
      search:false, 
      render:(_,record)=>{
        return record.status===1?'正常':'冻结'
      }

    },
    {
      title: "联系人",
      dataIndex: "tenantContact",
      search:false, 
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
      dataIndex: "status",
      valueType: "select",
      render: (_,record)=>{
        return record.status===1?'正常':'禁止'
      },
      valueEnum: {
        正常: { text: "正常", status: "1" },
        冻结: { text: "禁止", status: "0" },
      },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      valueType: "dateTime",
      search:false, 
    },
    {
      title: "操作",
      dataIndex: "action",
      search:false, 
      render: (_, record) => (
        <Space>

           {record.status === 1 ? (
              <a style={{ color: "red" }} onClick={()=>changeStatus(record.id,0)}>禁止登录</a>
          ) : (
             <a style={{ color: "green" }} onClick={()=>changeStatus(record.id,1)}>允许登录</a>
          )} 
          <a onClick={()=>resetPassword(record.id)}>重置密码</a>
          <a onClick={()=>resetGoogle(record.id)}>重置谷歌</a>
          <a onClick={() => handleRoleAssign(record)}>角色分配</a>
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
        request={getList}
        toolBarRender={() => [
          
        ]}
      />


      <RootModal visible={modalVisible} onCancel={() => setModalVisible(false)} onSubmit={handleRoleSubmit} />

    </PageContainer>
  );
};

export default Root;