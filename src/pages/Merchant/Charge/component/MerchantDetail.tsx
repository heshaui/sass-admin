import React, { useEffect, useState } from "react";
import { ProDescriptions, ProTable } from "@ant-design/pro-components";
import { Card, message, Button, Modal, Form, Radio, Space } from "antd";
import { useIntl } from 'umi';
import { tenantParams,updateTenantById,updateDelayById } from "@/services/ant-design-pro/merchant";
import MerchantEdit from "./MerchantEdit";
import ConvertToPaid from "./ConvertToPaid"
import dayjs from "dayjs";
  

interface MerchantDetailProps {
  tenantId: string | null;
  onBack: () => void; // 增加返回按钮
}




const MerchantDetail: React.FC<MerchantDetailProps> = ({ tenantId, onBack }) => {
  const intl = useIntl();
  const [merchant, setMerchant] = useState<any>({});
  const [accountData, setAccountData] = useState<any[]>([]);
  const [showEdit, setShowEdit] = useState(false); // 控制详情显示
  const [loading, setLoading] = useState(false);
  const [convertModalVisible, setConvertModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [languagePackage, setLanguagePackage] = useState('');
  

  // 账户表格列配置
  const columns = [
    { 
      title: intl.formatMessage({ id: 'merchantDetail.account.currency' }), 
      dataIndex: "currency", 
      key: "currency" 
    },
    { 
      title: intl.formatMessage({ id: 'merchantDetail.account.balance' }), 
      dataIndex: "balance", 
      key: "balance" 
    },
    { 
      title: intl.formatMessage({ id: 'merchantDetail.account.available' }), 
      dataIndex: "available", 
      key: "available" 
    },
    { 
      title: intl.formatMessage({ id: 'merchantDetail.account.frozen' }), 
      dataIndex: "frozen", 
      key: "frozen" 
    },
    { 
      title: intl.formatMessage({ id: 'merchantDetail.account.withdrawing' }), 
      dataIndex: "withdrawing", 
      key: "withdrawing" 
    },
    { 
      title: intl.formatMessage({ id: 'merchantDetail.account.locked' }), 
      dataIndex: "locked", 
      key: "locked" 
    },
  ];
  const fetchMerchant = async () => {
    if (!tenantId) return;
    setLoading(true);
    try {
      const res = await tenantParams(tenantId);
      if (res.code === "0") {
        setMerchant(res.data || {});
      } else {
        message.error(intl.formatMessage({ id: 'merchantDetail.message.fetchFailed' }));
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'merchantDetail.message.requestError' }));
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
   let res=await updateDelayById(data);
   if(res.code==='0'){
    setConvertModalVisible(false);  
   await fetchMerchant();
   }
    
   
  };

  const handleConvertToPaid =async  (record: any) => {

    setConvertModalVisible(true);
    
  };

  const handleLanguageModalOpen = () => {
    setLanguagePackage(merchant.packageId || 'basic');
    setLanguageModalVisible(true);
  };
  
  const handleLanguageModalClose = () => {
    setLanguageModalVisible(false);
  };
  
  const handleLanguageSubmit = async () => {
    // 处理多语言套餐提交逻辑
    try {
      const data = {
        tenantId: tenantId,
        packageId: languagePackage
      };
      const res = await updateTenantById(data);
      if (res.code === '0') {
        message.success(intl.formatMessage({ id: 'merchantDetail.message.languageUpdateSuccess' }));
        setLanguageModalVisible(false);
        await fetchMerchant(); // 刷新商户信息
      } else {
        message.error(
          intl.formatMessage({ id: 'merchantDetail.message.languageUpdateFailed' }) + 
          (res.message || intl.formatMessage({ id: 'merchantDetail.message.unknownError' }))
        );
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'merchantDetail.message.requestError' }));
    }
  };

  useEffect(() => {
    

    fetchMerchant();
  }, [tenantId]);

  return (
    <div>
      {showEdit ? (
        <MerchantEdit tenantId={tenantId} onBack={onBack} />
      ) : (
        <Card
          title={intl.formatMessage({ id: 'merchantDetail.title' })}
          extra={
            <Button type="primary" onClick={onBack}>
              {intl.formatMessage({ id: 'merchantDetail.button.back' })}
            </Button>
          }
        >
          {/* 基本信息 */}
          <ProDescriptions 
            column={3} 
            title={intl.formatMessage({ id: 'merchantDetail.section.basicInfo' })}
          >
            <ProDescriptions.Item 
              label={intl.formatMessage({ id: 'merchantDetail.label.merchantId' })}
            >
              {merchant.tenantId}
            </ProDescriptions.Item>
            <ProDescriptions.Item 
              label={intl.formatMessage({ id: 'merchantDetail.label.exchangeName' })}
            >
              {merchant.tenantName}
            </ProDescriptions.Item>
            <ProDescriptions.Item 
              label={intl.formatMessage({ id: 'merchantDetail.label.contact' })}
            >
              {merchant.tenantContact}
            </ProDescriptions.Item>
            <ProDescriptions.Item 
              label={intl.formatMessage({ id: 'merchantDetail.label.phone' })}
            >
              {merchant.tenantPhone || intl.formatMessage({ id: 'merchantDetail.label.none' })}
            </ProDescriptions.Item>
            <ProDescriptions.Item 
              label={intl.formatMessage({ id: 'merchantDetail.label.email' })}
            >
              {merchant.tenantEmail || intl.formatMessage({ id: 'merchantDetail.label.none' })}
            </ProDescriptions.Item>
            <ProDescriptions.Item 
              label={intl.formatMessage({ id: 'merchantDetail.label.domain' })}
            >
              {merchant.tenantHost || intl.formatMessage({ id: 'merchantDetail.label.none' })}
            </ProDescriptions.Item>
            <ProDescriptions.Item 
              label={intl.formatMessage({ id: 'merchantDetail.label.registrationTime' })}
            >
              {merchant.createTime ? dayjs(merchant.createTime).format("YYYY-MM-DD HH:mm:ss") : "-"}
            </ProDescriptions.Item>
            <ProDescriptions.Item 
              label={intl.formatMessage({ id: 'merchantDetail.label.activationTime' })}
            >
              {merchant.tenantStartTime ? dayjs(merchant.tenantStartTime).format("YYYY-MM-DD HH:mm:ss") : "-"}
            </ProDescriptions.Item>
            <ProDescriptions.Item 
              label={intl.formatMessage({ id: 'merchantDetail.label.expiryTime' })}
            >
              {merchant.tenantEndTime ? dayjs(merchant.tenantEndTime).format("YYYY-MM-DD HH:mm:ss") : "-"}
            </ProDescriptions.Item>
          </ProDescriptions>
          <div>
            <Button 
              type="primary" 
              onClick={() => setShowEdit(true)} 
              style={{ marginRight: 10 }}
            >
              {intl.formatMessage({ id: 'merchantDetail.button.edit' })}
            </Button>
            <Button 
              type="primary" 
              onClick={() => handleConvertToPaid(true)} 
              style={{ marginRight: 10 }}
            >
              {intl.formatMessage({ id: 'merchantDetail.button.extend' })}
            </Button>
            <Button 
              type="primary" 
              onClick={handleLanguageModalOpen}
            >
              {intl.formatMessage({ id: 'merchantDetail.button.languagePackage' })}
            </Button>
          </div>
    {/* 账户信息 */}
    <ProTable
      columns={columns}
      dataSource={accountData}
      rowKey="currency"
      search={false}
      pagination={false}
      headerTitle={intl.formatMessage({ id: 'merchantDetail.section.accountInfo' })}
    />
    <ConvertToPaid
        visible={convertModalVisible}
        onCancel={() => setConvertModalVisible(false)}
        onSubmit={handleConvertSubmit}
        initialValues={merchant}
      />
    {/* 多语言套餐Modal */}
    <Modal
      title={intl.formatMessage({ id: 'merchantDetail.languageModal.title' })}
      open={languageModalVisible}
      onCancel={handleLanguageModalClose}
      footer={[
        <Button key="cancel" onClick={handleLanguageModalClose}>
          {intl.formatMessage({ id: 'merchantDetail.languageModal.cancel' })}
        </Button>,
        <Button key="submit" type="primary" onClick={handleLanguageSubmit}>
          {intl.formatMessage({ id: 'merchantDetail.languageModal.submit' })}
        </Button>,
      ]}
    >
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h3>{intl.formatMessage({ id: 'merchantDetail.languageModal.header' })}</h3>
      </div>
      
      <Form layout="vertical">
        <Form.Item>
          <Radio.Group value={languagePackage} onChange={e => setLanguagePackage(e.target.value)}>
            <Space direction="horizontal">
              <Radio value={1}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 40, border: '1px solid #d9d9d9', borderRadius: 2 }}>
                  {intl.formatMessage({ id: 'merchantDetail.languagePackage.basic' })}
                </div>
              </Radio>
              <Radio value={2}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 40, border: '1px solid #d9d9d9', borderRadius: 2 }}>
                  {intl.formatMessage({ id: 'merchantDetail.languagePackage.standard' })}
                </div>
              </Radio>
              <Radio value={3}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 40, border: '1px solid #d9d9d9', borderRadius: 2 }}>
                  {intl.formatMessage({ id: 'merchantDetail.languagePackage.premium' })}
                </div>
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        
        <div style={{ marginTop: 20 }}>
          <p>{intl.formatMessage({ id: 'merchantDetail.languagePackage.basicDesc' })}</p>
          <p>{intl.formatMessage({ id: 'merchantDetail.languagePackage.standardDesc' })}</p>
          <p>{intl.formatMessage({ id: 'merchantDetail.languagePackage.premiumDesc' })}</p>
        </div>
      </Form>
    </Modal>
  </Card>
 
  )
}
   
      </div>

  );
};

export default MerchantDetail;