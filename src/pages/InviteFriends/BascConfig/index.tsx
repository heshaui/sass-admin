import React, { useEffect,useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useIntl } from 'umi';
import { 
  Card, 
  Form, 
  Button, 
  InputNumber, 
  Switch, 
  message, 
  Alert, 
  Select, 
  Radio, 
  Image
} from 'antd';
import { getRewardConfigurationDetail,getCurrencyCoinList,getUserInviteDetailList,getImageConfigurationDetail,saveOrUpdateRewardConfiguration,saveOrUpdateImageConfiguration,getFundAccountsList} from '@/services/ant-design-pro/inviteFriends';
import LanguageSelector from '@/components/LanguageSelector';
import type { ProColumns } from '@ant-design/pro-components';
import AvatarUpload from "@/components/AvatarUpload/index";
import { getTenantKeyParams,updateValue,updateAccountConfiguration} from '@/services/ant-design-pro/kv';
import ImageConfigModal from './components/ImageConfigModal';
import ImagePlaceholder from '@/components/ImagePlaceholder';
const { Option } = Select;


const BasicConfig: React.FC = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [language, setLanguage] = useState('en_US');
  const [isEditing, setIsEditing] = useState(false);
  const [coinList,setCoinList]=useState([]);
  const [config,setConfig]=useState('');
  const [configId,setConfigId]=useState('');
  const [imagesConfig, setImagesConfig] = useState<Record<string, {backgroundImage: string, posterImage: string}>>();
  const [imageModalVisible, setImageModalVisible] = useState(false);


  const getCoin=async()=>{
    let data={
      pageNo:1,
      pageSize:10000
    }
    const res=await getCurrencyCoinList(data);
    if(res.code==='0'){
      setCoinList(res.data.list);
    }

  }

  const getConfig=async()=>{
    const res=await getTenantKeyParams({key:'account_configuration'});
    if(res.code==='0'){
      console.log(res.data)
      setConfig(res.data.keyValue);
    }
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  }

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  }



  //获取图片配置详情
  const getImageDetail = async () => {
    const res = await getImageConfigurationDetail();
    if (res.code === '0') {
      const imageConfigObj: Record<string, {backgroundImage: string, posterImage: string}> = {};
      res.data.forEach((item: any) => {
        imageConfigObj[item.languageCode] = {
          backgroundImage: item.backgroundImageUrl,
          posterImage: item.posterBackgroundUrl
        };
      });
      setImagesConfig(imageConfigObj);
    }
  };

 const saveImage=async(backgroundImage:string,posterImage:string)=>{
  let data={
    images:[
      {
        languageCode:language,
        backgroundImageUrl:backgroundImage,
        posterBackgroundUrl:posterImage
      }
    ]
  }
  const res=await saveOrUpdateImageConfiguration(data);
  if(res.code==='0'){
    message.success(intl.formatMessage({ id: 'inviteFriends.message.imageConfigSaveSuccess' }));
  }else{
    message.error(res.message);
  }
  await getImageDetail();
 }
 

  const saveConfiguration = async (values: any) => {
    let data={
      ...values,
      id:configId
    }
    const res = await saveOrUpdateRewardConfiguration(data);
    if (res.code === '0') {
      message.success(intl.formatMessage({ id: 'inviteFriends.message.configSaveSuccess' }));
      setIsEditing(false); // 保存成功后关闭编辑状态
    } else {
      message.error(res.message);
    }
  }

  //获取奖励配置详情
  const getConfigurationDetail = async () => {
    const res = await getRewardConfigurationDetail();
    if(res.code==='0'){
      setConfigId(res.data.id);
      form.setFieldsValue(res.data);
    }
  };


  //获取用户邀请详情列表
  const getUserList = async () => {
    let data={
      pageNo:1,
      pageSize:10000
    }
    const res = await getUserInviteDetailList(data);
    console.log(res);
  };

  const getFundAccounts=async()=>{
    let data={
      pageNo:1,
      pageSize:10000
    }
    const res = await getFundAccountsList(data);
    if(res.code==='0'){
      return {
        data: res.data.list,
        success: true,
        total: res.data.total,
      }
    }
  }

  const onFinish = (values: any) => {
    console.log(intl.formatMessage({ id: 'inviteFriends.message.formSubmitValues' }), values);
    message.success(intl.formatMessage({ id: 'inviteFriends.message.configSaveSuccess' }));
  };

  useEffect(() => {
    getCoin();
    getConfig();
    getConfigurationDetail();
    getUserList();
    getImageDetail();
  }, []);

  // 定义资金账户列表的列配置
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({ id: 'inviteFriends.fundAccount.column.coin' }),
      dataIndex: 'coinName',
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.fundAccount.column.balance' }),
      dataIndex: 'balance',
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.fundAccount.column.status' }),
      dataIndex: 'isLock',
      render: (text:number) => {
        return text===0 ? 
          intl.formatMessage({ id: 'inviteFriends.fundAccount.status.unlocked' }) : 
          intl.formatMessage({ id: 'inviteFriends.fundAccount.status.locked' })
      }
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.fundAccount.column.createTime' }),
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: intl.formatMessage({ id: 'inviteFriends.fundAccount.column.action' }),
      valueType: 'option',
      render: (_, record) => [
        <a key="records" href="/invite-friends/reward-records">{intl.formatMessage({ id: 'inviteFriends.fundAccount.action.records' })}</a>,
      ],
    },
  ];


  const handleCancel = () => {
    setImageModalVisible(false);
  };

  const handleSave = (backgroundImage:string,posterImage:string) => {
    setImageModalVisible(false);
    saveImage(backgroundImage,posterImage);
  };
  return (
    <PageContainer title={intl.formatMessage({ id: 'inviteFriends.basicConfig.title' })}>
      {/* 账户余额警告 */}
      {/* <Alert
        message={intl.formatMessage({ id: 'inviteFriends.alert.lowBalance.title' })}
        description={intl.formatMessage({ id: 'inviteFriends.alert.lowBalance.description' })}
        type="warning"
        showIcon
        style={{ marginBottom: 24 }}
        action={
          <Button size="small" type="primary">
            {intl.formatMessage({ id: 'inviteFriends.alert.lowBalance.action' })}
          </Button>
        }
      /> */}

      {/* 账户配置 */}
      <Card title={intl.formatMessage({ id: 'inviteFriends.accountConfig.title' })} style={{ marginBottom: 24 }}>
        <Form.Item
          name="enabled"
          label={intl.formatMessage({ id: 'inviteFriends.accountConfig.enabled' })}
          valuePropName="checked"
        >
          <Switch value={config==='1'} onChange={ async (checked)=>{
           const res= await updateAccountConfiguration({keyProperty:'account_configuration',keyValue:checked?'1':'0'});
           if(res.code==='0'){
            message.success(intl.formatMessage({ id: 'inviteFriends.message.configSaveSuccess' }));
           }else{
            message.error(res.message);
           }
           getConfig();
          }} />
        </Form.Item>
        <div className="tips">
          <p>{intl.formatMessage({ id: 'inviteFriends.accountConfig.tips' })}</p>
          <p>{intl.formatMessage({ id: 'inviteFriends.accountConfig.tips.content' })}</p>
        </div>
      </Card>

      {/* 奖励配置 */}
      <Card 
        title={intl.formatMessage({ id: 'inviteFriends.rewardConfig.title' })} 
        style={{ marginBottom: 24 }}
        extra={<Button type="primary" onClick={toggleEdit}>{isEditing ? intl.formatMessage({ id: 'inviteFriends.rewardConfig.cancel' }) : intl.formatMessage({ id: 'inviteFriends.rewardConfig.edit' })}</Button>}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={saveConfiguration}
          disabled={!isEditing}
        >
          <Form.Item
            name="coinId"
            label={intl.formatMessage({ id: 'inviteFriends.rewardConfig.coinType' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'inviteFriends.rewardConfig.coinType.placeholder' }) }]}
          >
            <Select style={{ width: 200 }}>
              {coinList.map((item:any)=>(
                <Option value={item.coinId} key={item.coinId}>{item.coinName}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="rebateRatio"
            label={intl.formatMessage({ id: 'inviteFriends.rewardConfig.rebateRatio' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'inviteFriends.rewardConfig.rebateRatio.placeholder' }) }]}
          >
            <InputNumber min={0} max={100} addonAfter="%" style={{ width: 200 }} />
          </Form.Item>
          
          <Form.Item
            name="validTime"
            label={intl.formatMessage({ id: 'inviteFriends.rewardConfig.validTime' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'inviteFriends.rewardConfig.validTime.placeholder' }) }]}
          >
            <InputNumber min={1} addonAfter={intl.formatMessage({ id: 'inviteFriends.rewardConfig.validTime.unit' })} style={{ width: 200 }} />
          </Form.Item>
          
          <Form.Item
            name="rechargeLimit"
            label={intl.formatMessage({ id: 'inviteFriends.rewardConfig.rechargeLimit' })}
            rules={[{ required: true, message: intl.formatMessage({ id: 'inviteFriends.rewardConfig.rechargeLimit.placeholder' }) }]}
          >
            <InputNumber min={0} addonAfter={intl.formatMessage({ id: 'inviteFriends.rewardConfig.rechargeLimit.unit' })} style={{ width: 200 }} />
          </Form.Item>
          
          <Form.Item
            name="isRealname"
            label={intl.formatMessage({ id: 'inviteFriends.rewardConfig.isRealname' })}
          >
            <Radio.Group>
              <Radio value="1">{intl.formatMessage({ id: 'inviteFriends.rewardConfig.isRealname.required' })}</Radio>
              <Radio value="0">{intl.formatMessage({ id: 'inviteFriends.rewardConfig.isRealname.notRequired' })}</Radio>
            </Radio.Group>
          </Form.Item>

          {isEditing && (
            <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
              <Button type="primary" htmlType="submit">
                {intl.formatMessage({ id: 'inviteFriends.rewardConfig.save' })}
              </Button>
            </Form.Item>
          )}
        </Form>
      </Card>

      {/* 邀请页面配置 */}
      <Card title={intl.formatMessage({ id: 'inviteFriends.pageConfig.title' })} style={{ marginBottom: 24 }}>
       
      <LanguageSelector value={language} text={intl.formatMessage({ id: 'inviteFriends.pageConfig.languageInfo' })} onChange={handleLanguageChange} />
      <Button type="primary" onClick={()=>{
        setImageModalVisible(true);
      }}>{intl.formatMessage({ id: 'inviteFriends.pageConfig.configImage' })}</Button>
      <div style={{display:'flex',flexDirection:'row'}}>
        <div style={{ marginTop: 20, marginRight: 20 }}>
          <h4>{intl.formatMessage({ id: 'inviteFriends.pageConfig.backgroundTitle' })}</h4>
          {imagesConfig && imagesConfig[language] ? (
            <Image 
              src={imagesConfig[language].backgroundImage} 
              width={200} 
              height={150} 
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        
        <div style={{ marginTop: 20 }}>
          <h4>{intl.formatMessage({ id: 'inviteFriends.pageConfig.posterTitle' })}</h4>
          {imagesConfig && imagesConfig[language] ? (
            <Image 
              src={imagesConfig[language].posterImage} 
              width={200} 
              height={150} 
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
      </div>
      <ImageConfigModal
        visible={imageModalVisible}
        onCancel={handleCancel}
        onSave={handleSave}
        language={language}
        imagesConfig={imagesConfig}
      />
      </Card>

      {/* 资金账户列表 */}
      <Card title={intl.formatMessage({ id: 'inviteFriends.fundAccount.title' })}>
        <ProTable
          columns={columns}
          rowKey="id"
          search={false}
          request={getFundAccounts}
          pagination={{
            showQuickJumper: true,
            pageSize: 10,
          }}
          dateFormatter="string"
          toolbar={{
            title: intl.formatMessage({ id: 'inviteFriends.fundAccount.title' }),
          }}
        />
      </Card>

    </PageContainer>
  );
};

export default BasicConfig; 