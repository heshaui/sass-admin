import React, { useEffect,useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
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
} from 'antd';

import { getRewardConfigurationDetail,getCurrencyCoinList,getUserInviteDetailList,getImageConfigurationDetail,saveOrUpdateRewardConfiguration,saveOrUpdateImageConfiguration,getFundAccountsList} from '@/services/ant-design-pro/inviteFriends';
import LanguageSelector from '@/components/LanguageSelector';
import type { ProColumns } from '@ant-design/pro-components';
import AvatarUpload from "@/components/AvatarUpload/index";
import { getTenantKeyParams,updateValue } from '@/services/ant-design-pro/kv';

const { Option } = Select;


const BasicConfig: React.FC = () => {
  const [form] = Form.useForm();
  const [language, setLanguage] = useState('en_US');
  const [isEditing, setIsEditing] = useState(false);
  const [coinList,setCoinList]=useState([]);
  const [config,setConfig]=useState('');
  const [configId,setConfigId]=useState('');
  const [imagesConfig, setImagesConfig] = useState<Record<string, {backgroundImage: string, posterImage: string}>>({
    en_US: { backgroundImage: '', posterImage: '' },
    zh_CN: { backgroundImage: '', posterImage: '' },
    // 可以添加更多语言
  });


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
      setConfig(res.data.keyValue);
    }
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  }

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  }

  const handleBackgroundImageChange = (url: string) => {
    setImagesConfig(prev => ({
      ...prev,
      [language]: {
        ...prev[language],
        backgroundImage: url
      }
    }));
  };

  const handlePosterImageChange = (url: string) => {
    setImagesConfig(prev => ({
      ...prev,
      [language]: {
        ...prev[language],
        posterImage: url
      }
    }));
  };

  const saveImage = async () => {
    // 将imagesConfig转换为API所需的格式
    const images = Object.entries(imagesConfig).map(([languageCode, config]) => ({
      languageCode,
      backgroundImageUrl: config.backgroundImage,
      posterBackgroundUrl: config.posterImage
    }));
    
    const data = { images };
    
    const res = await saveOrUpdateImageConfiguration(data);
    if (res.code === '0') {
      message.success('图片配置保存成功');
    } else {
      message.error(res.message || '保存失败');
    }
  };

  const saveConfiguration = async (values: any) => {
    let data={
      ...values,
      id:configId
    }
    const res = await saveOrUpdateRewardConfiguration(data);
    if (res.code === '0') {
      message.success('配置保存成功');
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

  //获取图片配置详情
  const getImageDetail = async () => {
    const res = await getImageConfigurationDetail();
    console.log(res);
    if (res.code === '0' && res.data && res.data.images) {
      // 初始化一个新的图片配置对象
      const newImagesConfig: Record<string, {backgroundImage: string, posterImage: string}> = {};
      
      // 遍历API返回的图片配置数据
      res.data.images.forEach((item: any) => {
        newImagesConfig[item.languageCode] = {
          backgroundImage: item.backgroundImageUrl || '',
          posterImage: item.posterBackgroundUrl || ''
        };
      });
      
      // 更新状态
      setImagesConfig(newImagesConfig);
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
    console.log('表单提交的值：', values);
    message.success('配置保存成功');
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
      title: '币种',
      dataIndex: 'coinName',
    },
    {
      title: '账户可用',
      dataIndex: 'balance',
    },
    {
      title: '状态',
      dataIndex: 'isLock',
      render: (text:number) => {
        return text===0?'未锁定':'锁定'
      }
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <a key="records" href="/invite-friends/reward-records">发放记录</a>,
      ],
    },
  ];


  return (
    <PageContainer title="邀请好友基础配置">
      {/* 账户余额警告 */}
      <Alert
        message="账户余额不足提醒！"
        description="尊敬的客户！检测到您邀请返佣账户余额不足！请及时补充余额！若余额不足，自动停止发放奖励，资金充足后自动补发。"
        type="warning"
        showIcon
        style={{ marginBottom: 24 }}
        action={
          <Button size="small" type="primary">
            前往
          </Button>
        }
      />

      {/* 账户配置 */}
      <Card title="账户配置" style={{ marginBottom: 24 }}>
        <Form.Item
          name="enabled"
          label="是否开启"
          valuePropName="checked"
        >
          <Switch checked={config==='1'} onChange={ async (checked)=>{
           const res= await updateValue({keyProperty:'account_configuration',keyValue:checked?'1':'0'});
           if(res.code==='0'){
            message.success('配置保存成功');
           }else{
            message.error(res.message);
           }
          }} />
        </Form.Item>
        <div className="tips">
          <p>Tips:</p>
          <p>1. 开启后，个人中心将显示入口，及之不显示，查通过URL配置，也需要开启;</p>
        </div>
      </Card>

      {/* 奖励配置 */}
      <Card 
        title="奖励配置" 
        style={{ marginBottom: 24 }}
        extra={<Button type="primary" onClick={toggleEdit}>{isEditing ? '取消' : '编辑'}</Button>}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={saveConfiguration}
          disabled={!isEditing}
        >
          <Form.Item
            name="coinId"
            label="返佣返币币种"
            rules={[{ required: true, message: '请选择返佣币种' }]}
          >
            <Select style={{ width: 200 }}>
              {coinList.map((item:any)=>(
                <Option value={item.coinId} key={item.coinId}>{item.coinName}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="rebateRatio"
            label="返佣比例"
            rules={[{ required: true, message: '请输入返佣比例' }]}
          >
            <InputNumber min={0} max={100} addonAfter="%" style={{ width: 200 }} />
          </Form.Item>
          
          <Form.Item
            name="validTime"
            label="任务有效期限:被邀请用户注册"
            rules={[{ required: true, message: '请输入有效期限' }]}
          >
            <InputNumber min={1} addonAfter="天" style={{ width: 200 }} />
          </Form.Item>
          
          <Form.Item
            name="rechargeLimit"
            label="充值：最小充值不低于"
            rules={[{ required: true, message: '请输入最小充值金额' }]}
          >
            <InputNumber min={0} addonAfter="USDT" style={{ width: 200 }} />
          </Form.Item>
          
          <Form.Item
            name="isRealname"
            label="是否要求实名"
          >
            <Radio.Group>
              <Radio value="1">需要实名</Radio>
              <Radio value="0">无需实名</Radio>
            </Radio.Group>
          </Form.Item>

          {isEditing && (
            <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          )}
        </Form>
      </Card>

      {/* 邀请页面配置 */}
      <Card title="邀请页面配置" style={{ marginBottom: 24 }}>
       
      <LanguageSelector value={language} onChange={handleLanguageChange} />
      <div style={{display:'flex',flexDirection:'row'}}>
      <div style={{ marginTop: 20 }}>
          <h4>邀请页背景配置（PC）- {language}</h4>
          <AvatarUpload 
            value={imagesConfig[language]?.backgroundImage || ''} 
            onChange={handleBackgroundImageChange}
          />
          <p>建议尺寸1236*452</p>
        </div>
        
        <div style={{ marginTop: 20 }}>
          <h4>邀请海报底图（PC）- {language}</h4>
          <AvatarUpload 
            value={imagesConfig[language]?.posterImage || ''} 
            onChange={handlePosterImageChange}
          />
          <p>建议尺寸856*452</p>
        </div>
      </div>
      <Button type="primary" onClick={saveImage}>保存所有语言配置</Button>
        
      </Card>

      {/* 资金账户列表 */}
      <Card title="资金账户列表">
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
            title: '资金账户列表',
          }}
        />
      </Card>

    </PageContainer>
  );
};

export default BasicConfig; 