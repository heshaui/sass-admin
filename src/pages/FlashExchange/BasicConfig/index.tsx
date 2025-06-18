import React, { useState, useEffect, useRef } from 'react';
import { PageContainer, ProForm, ProFormText, ProFormDigit, ProFormSelect, ProFormSwitch, ProFormRadio, ProFormUploadButton } from '@ant-design/pro-components';
import { useIntl } from 'umi';
import { Card, Button, message, Radio, Space, Input, Row, Col, Typography } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-components';
import LanguageSelector from '@/components/LanguageSelector';
import AvatarUpload from '@/components/AvatarUpload'
import { flashExchangeConfig, saveOrUpdateConfig } from '@/services/ant-design-pro/flash';
import { tenantCurrencyCoinList } from '@/services/ant-design-pro/spot';
import { getTenantKeyParams,updateValue } from '@/services/ant-design-pro/kv';


const BasicConfig: React.FC = () => {
  const intl = useIntl();
  const [activeLanguage, setActiveLanguage] = useState('en_US');
  const basicFormRef = useRef<ProFormInstance>();
  const backgroundFormRef = useRef<ProFormInstance>();
  const [coin, SetCoin] = useState([]);
  const getImg = async () => {
    const result = await getTenantKeyParams({ key: 'flash_img' });
    if (result.code === '0' && result.data?.keyValue) {
      try {
        const parsedData = JSON.parse(result.data.keyValue);
        console.log('parsedData', parsedData);
        
        // Set initial values for the background form based on active language
        if (parsedData[activeLanguage]) {
          backgroundFormRef.current?.setFieldsValue({
            title: parsedData[activeLanguage].title,
            subTitle: parsedData[activeLanguage].subTitle,
            // Note: For image handling, you might need additional logic
          });
        }
      } catch (error) {
        console.error('Error parsing flash image data:', error);
      }
    }
  }

  const saveImg = async () => {
    try {
      // 1. Get current data to preserve other languages
      const currentData = await getTenantKeyParams({ key: 'flash_img' });
      let parsedData: Record<string, { title?: string; subTitle?: string; img?: string }> = {};
      
      // 2. Parse existing data if it exists
      if (currentData.code === '0' && currentData.data?.keyValue) {
        try {
          parsedData = JSON.parse(currentData.data.keyValue);
        } catch (error) {
          console.error('Error parsing existing data:', error);
        }
      }

      // 3. Get form values
      const formValues = await backgroundFormRef.current?.validateFields();
      
      // 4. Update the current language's data
      parsedData = {
        ...parsedData,
        [activeLanguage]: {
          ...parsedData[activeLanguage], // Preserve existing fields
          title: formValues.title || '',
          subTitle: formValues.subTitle || '',
          // Preserve image if it exists, otherwise set empty string
          img: parsedData[activeLanguage]?.img || '' 
        }
      };

      // 5. Save all languages data
      const res = await updateValue({
        keyProperty: 'flash_img',
        keyValue: JSON.stringify(parsedData)
      });

      if (res.code === '0') {
        message.success('保存成功');
        return true;
      } else {
        message.error(res.msg || '保存失败');
        return false;
      }
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
      return false;
    }
  }

  // tenantCurrencyCoinList
  const getCoinList=async()=>{
    let data={
      pageNo:1,
      pageSize:10000
    }
    const result = await tenantCurrencyCoinList(data);
    if (result.code === '0' && result.data) {

      SetCoin(result.data.list)
    }
    return [];
  }
  
  const getConfig = async () => {
    try {
      const result = await flashExchangeConfig({});
      if (result.code === '0' && result.data) {
        // 设置基础配置表单数据
        basicFormRef.current?.setFieldsValue({
          flashConvertSwitch: result.data.flashConvertSwitch,
          realNameRequired: result.data.realNameRequired,
          baseCoin: result.data.baseCoin,
          quoteCoin: result.data.quoteCoin,
          feeRate: result.data.feeRate,
          minTradeU: result.data.minTradeU,
          maxTradeU: result.data.maxTradeU
        });
        
        // 设置背景图配置表单数据
        backgroundFormRef.current?.setFieldsValue({
          mainTitle: result.data.mainTitle,
          subTitle: result.data.subTitle
          // 背景图需要单独处理
        });
        
        console.log('配置数据加载成功', result.data);
      } else {
        message.error(result.msg || '获取配置数据失败');
      }
    } catch (error) {
      console.error('获取闪兑配置失败:', error);
      message.error('获取配置数据失败');
    }
  }

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      // 实际应用中应该调用后端API
      const result = await saveOrUpdateConfig(values);
      if (result.code === '0') {
        message.success(intl.formatMessage({ id: 'flashExchange.basicConfig.success', defaultMessage: '配置保存成功！' }));
      } else {
        message.error(result.msg || intl.formatMessage({ id: 'flashExchange.basicConfig.failed', defaultMessage: '配置保存失败！' }));
      }
      console.log('提交的配置:', values);
    } catch (error) {
      console.error('更新闪兑配置失败:', error);
      message.error(intl.formatMessage({ id: 'flashExchange.basicConfig.failed', defaultMessage: '配置保存失败！' }));
    }
  };
  
  // 提交基础配置表单
  const submitBasicForm = async () => {
    try {
      const values = await basicFormRef.current?.validateFields();
      if (values) {
        await handleSubmit(values);
      }
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };
  
  // 提交背景图配置表单
  const submitBackgroundForm = async () => {
    try {
      await backgroundFormRef.current?.validateFields();
      const success = await saveImg();
      if (success) {
        message.success('保存成功');
      }
    } catch (error) {
      console.error('表单验证失败:', error);
      message.error('保存失败');
    }
  };


    // Load data on component mount
    useEffect(() => {
      getCoinList();
      getImg();
      getConfig();
    }, []);

  const updateFormForLanguage = async (language: string) => {
    try {
      const result = await getTenantKeyParams({ key: 'flash_img' });
      if (result.code === '0' && result.data?.keyValue) {
        const parsedData: Record<string, { title?: string; subTitle?: string }> = JSON.parse(result.data.keyValue);
        // Reset form fields to avoid showing previous language's data while loading
        backgroundFormRef.current?.setFieldsValue({
          title: '',
          subTitle: '',
        });
        
        // Set values for the selected language if they exist
        if (parsedData[language]) {
          backgroundFormRef.current?.setFieldsValue({
            title: parsedData[language]?.title || '',
            subTitle: parsedData[language]?.subTitle || '',
            img: parsedData[language]?.img || ''
          });
        } else {
          // Initialize with empty values if language doesn't exist yet
          backgroundFormRef.current?.setFieldsValue({
            title: '',
            subTitle: '',
          });
        }
      }
    } catch (error) {
      console.error('Error updating form values for language change:', error);
      // Reset form on error
      backgroundFormRef.current?.setFieldsValue({
        title: '',
        subTitle: '',
      });
    }
  };

  // Handle language change
  const handleLanguageChange = (language: string) => {
    setActiveLanguage(language);
    updateFormForLanguage(language);
  };

  // Initial load
  useEffect(() => {
    updateFormForLanguage(activeLanguage);
  }, []);

  return (
    <PageContainer 
      title={intl.formatMessage({ id: 'flashExchange.basicConfig.title', defaultMessage: '闪兑基础配置' })}
    >
      {/* 基础配置 - 合并功能配置、默认币种配置和交易配置 */}
      <Card title="基础配置" style={{ marginBottom: 16 }}>
        <ProForm
          formRef={basicFormRef}
          onFinish={handleSubmit}
          submitter={false}
        >
          {/* 功能配置部分 */}
          <Row gutter={16} align="middle">
            <Col span={2}>闪兑开关</Col>
            <Col span={6}>
              <ProFormSwitch name="flashConvertSwitch" />
            </Col>
            <Col span={16} style={{ textAlign: 'right' }}>
              <Button 
                type="primary"
                onClick={submitBasicForm}
              >
                保存
              </Button>
            </Col>
          </Row>
          
          <Row style={{ marginTop: 16, marginBottom: 24 }} align="middle">
            <Col span={3}>是否需要实名</Col>
            <Col span={21}>
              <ProFormRadio.Group
                name="realNameRequired"
                options={[
                  { label: '需要实名', value: true },
                  { label: '无需实名', value: false },
                ]}
              />
            </Col>
          </Row>

          {/* 默认币种配置部分 */}
          <div style={{ marginBottom: 8, fontWeight: 500 }}>默认币种配置</div>
          <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
            <Col span={2}>发送币种</Col>
            <Col span={6}>
              <div>
                <ProFormSelect
                  name="baseCoin"
                  options={coin.filter(item => item.isTradeConvert !== 0).map(item=>({
                    label: item.coinName,
                    value: item.coinName
                  }))}
                />
                <div style={{ marginTop: 4, color: 'rgba(0, 0, 0, 0.45)', fontSize: 12 }}>
                  进入闪兑页面，默认显示的发送币种
                </div>
              </div>
            </Col>
          </Row>
          
          <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
            <Col span={2}>获得币种</Col>
            <Col span={6}>
              <div>
                <ProFormSelect
                  name="quoteCoin"
                  options={coin.filter(item => item.isTradeConvert !== 0).map(item=>({
                    label: item.coinName,
                    value: item.coinName
                  }))}
                />
                <div style={{ marginTop: 4, color: 'rgba(0, 0, 0, 0.45)', fontSize: 12 }}>
                  进入闪兑页面，默认显示的接收币种
                </div>
              </div>
            </Col>
          </Row>
          

          {/* 交易配置部分 */}
          <div style={{ marginBottom: 8, fontWeight: 500 }}>交易配置</div>
          <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
            <Col span={1}>点差</Col>
            <Col span={6}>
              <Input.Group compact>
                <ProFormDigit
                  name="feeRate"
                  min={0}
                  max={100}
                  fieldProps={{
                    step: 0.1,
                    precision: 1,
                    style: { width: 120 },
                    addonAfter: '%'
                  }}
                  noStyle
                />
              </Input.Group>
            </Col>
            <Col span={17}>
              <div style={{ color: '#999' }}>
                闪兑页面显示价格公式: 实单 = 1 / 买价 * (1 + 点差) ; 实单 = 卖价 * (1 - 点差)
              </div>
            </Col>
          </Row>
          
          <Row gutter={16} align="middle">
            <Col span={2}>交易限制</Col>
            <Col span={22}>
              <Space align="baseline">
                最小值：
                <ProFormDigit
                  name="minTradeU"
                  min={0}
                  fieldProps={{
                    precision: 0,
                    style: { width: 120 }
                  }}
                  noStyle
                />
                <span>USDT</span>
                
                <span style={{ marginLeft: 16 }}>最大值：</span>
                <ProFormDigit
                  name="maxTradeU"
                  min={0}
                  fieldProps={{
                    precision: 0,
                    style: { width: 120 }
                  }}
                  noStyle
                />
                <span>USDT</span>
              </Space>
            </Col>
          </Row>
        </ProForm>
      </Card>

      {/* 背景图配置 */}
      <Card title="背景图配置" style={{ marginBottom: 16 }} extra={<Button type="primary" onClick={submitBackgroundForm}>保存</Button>}>
        <ProForm
          formRef={backgroundFormRef}
          onFinish={handleSubmit}
          submitter={false}
        >
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={24}>
            <LanguageSelector value={activeLanguage} onChange={handleLanguageChange} text={''} />
            </Col>
          </Row>

          <Row gutter={16} style={{ marginBottom: 16,width:'500px' }}>
            <Col span={3} style={{ textAlign: 'right' }}>主标题</Col>
            <Col span={21}>
              <ProFormText
                name="title"
                placeholder="请输入"
              />
            </Col>
          </Row>

          <Row gutter={16} style={{ marginBottom: 16,width:'500px' }}>
            <Col span={3} style={{ textAlign: 'right' }}>副标题</Col>
            <Col span={21}>
              <ProFormText
                name="subTitle"
                placeholder="请输入"
              />
              
            </Col>
          </Row>

          <Row gutter={16} style={{ marginBottom: 16,width:'500px' }}>
            <Col span={3} style={{ textAlign: 'right' }}>背景图</Col>
            <Col span={21}>
              <AvatarUpload/>
            </Col>
          </Row>
          <Typography.Text type="secondary">
                背景图宽400*1231，本上传框默认使用系统配置，上传后以原始图片为主
              </Typography.Text>

        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default BasicConfig;
