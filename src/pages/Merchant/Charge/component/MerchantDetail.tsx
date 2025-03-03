import React, { useEffect, useState } from "react";
import { ProDescriptions, ProTable } from "@ant-design/pro-components";
import { Card, Spin, message, Button,Modal,Form,DatePicker} from "antd";
import { tenantParams,updateTenantById } from "@/services/ant-design-pro/merchant";
import MerchantEdit from "./MerchantEdit";
import ConvertToPaid from "./ConvertToPaid"
import dayjs from "dayjs";
  

interface MerchantDetailProps {
  tenantId: string | null;
  onBack: () => void; // 增加返回按钮
}




const MerchantDetail: React.FC<MerchantDetailProps> = ({ tenantId, onBack }) => {
  const [merchant, setMerchant] = useState<any>({});
  const [accountData, setAccountData] = useState<any[]>([]);
  const [showEdit, setShowEdit] = useState(false); // 控制详情显示
  const [loading, setLoading] = useState(false);
    const [convertModalVisible, setConvertModalVisible] = useState(false);
  

  // 账户表格列配置
  const columns = [
    { title: "币种", dataIndex: "currency", key: "currency" },
    { title: "余额", dataIndex: "balance", key: "balance" },
    { title: "可用", dataIndex: "available", key: "available" },
    { title: "冻结", dataIndex: "frozen", key: "frozen" },
    { title: "提币中", dataIndex: "withdrawing", key: "withdrawing" },
    { title: "锁仓", dataIndex: "locked", key: "locked" },
  ];
  const fetchMerchant = async () => {
    if (!tenantId) return;
    setLoading(true);
    try {
      const res = await tenantParams(tenantId);
      if (res.code === "0") {
        setMerchant(res.data || {});
      } else {
        message.error("获取商户详情失败");
      }
    } catch (error) {
      message.error("请求出错，请稍后重试");
    }
    setLoading(false);
  };
  const handleConvertSubmit =async (values: any) => {
    // console.log("转为正式商户:", values);
    // 
    let data={
      tenantId:tenantId,
      tenantEndTime:dayjs(values.tenantEndTime).valueOf()
      

    } 
   let res=await updateTenantById(data);
   if(res.code==='0'){
    setConvertModalVisible(false);  
   await fetchMerchant();
   }
    
   
  };

  const handleConvertToPaid =async  (record: any) => {

    setConvertModalVisible(true);
    
  };



  useEffect(() => {
    

    fetchMerchant();
  }, [tenantId]);

  return (
    <div>
{
  showEdit?  <MerchantEdit tenantId={tenantId} onBack={onBack} /> : (

    <Card
    title="商户详情"
    extra={
      <Button type="primary" onClick={onBack}>
        返回列表
      </Button>
    }
  >
    {/* 基本信息 */}
    <ProDescriptions column={3} title="基本信息">
      <ProDescriptions.Item label="商户ID">{merchant.tenantId}</ProDescriptions.Item>
      <ProDescriptions.Item label="交易所名称">{merchant.tenantName}</ProDescriptions.Item>
      <ProDescriptions.Item label="联系人">{merchant.tenantContact}</ProDescriptions.Item>
      <ProDescriptions.Item label="手机号">{merchant.tenantPhone || "无"}</ProDescriptions.Item>
      <ProDescriptions.Item label="邮箱">{merchant.tenantEmail || "无"}</ProDescriptions.Item>
      <ProDescriptions.Item label="商户域名">{merchant.tenantHost || "无"}</ProDescriptions.Item>
      <ProDescriptions.Item label="注册时间">
        {merchant.createTime ? dayjs(merchant.createTime).format("YYYY-MM-DD HH:mm:ss") : "-"}
      </ProDescriptions.Item>
      <ProDescriptions.Item label="开通时间">
        {merchant.tenantStartTime ? dayjs(merchant.tenantStartTime).format("YYYY-MM-DD HH:mm:ss") : "-"}
      </ProDescriptions.Item>
      <ProDescriptions.Item label="到期时间">
        {merchant.tenantEndTime ? dayjs(merchant.tenantEndTime).format("YYYY-MM-DD HH:mm:ss") : "-"}
      </ProDescriptions.Item>
    </ProDescriptions>
    <div>
      <Button type="primary" onClick={() => setShowEdit(true)} style={{ marginRight: 10 }}>
        修改
      </Button>
      <Button type="primary" onClick={() => handleConvertToPaid(true)}>
        延期
      </Button>
    </div>
    {/* 账户信息 */}
    <ProTable
      columns={columns}
      dataSource={accountData} // 绑定数据
      rowKey="currency"
      search={false}
      pagination={false}
      headerTitle="账户信息"
    />
    <ConvertToPaid
        visible={convertModalVisible}
        onCancel={() => setConvertModalVisible(false)}
        onSubmit={handleConvertSubmit}
        initialValues={merchant}
      />
  </Card>
 
  )
}
   
      </div>

  );
};

export default MerchantDetail;