import React, { useEffect, useState } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useIntl, useModel } from '@umijs/max';
import {
  Card,
  Form,
  Button,
  InputNumber,
  Switch,
  message,
  Select,
  Radio,
  Image,
  Upload,
  Tabs,
  TabsProps,
} from 'antd';
import {
  getRewardConfigurationDetail,
  getCurrencyCoinList,
  getUserInviteDetailList,
  getImageConfigurationDetail,
  saveOrUpdateRewardConfiguration,
  saveOrUpdateImageConfiguration,
  getFundAccountsList,
} from '@/services/ant-design-pro/inviteFriends';
import type { ProColumns } from '@ant-design/pro-components';
import { getTenantKeyParams, updateAccountConfiguration } from '@/services/ant-design-pro/kv';
import { tenantLangList } from '@/services/ant-design-pro/WebConfig';
import AvatarUpload from '@/components/AvatarUpload';
const { Option } = Select;

const BasicConfig: React.FC = () => {
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');
  const themeColor = initialState?.settings?.colorPrimary;
  const [form] = Form.useForm();
  const [language, setLanguage] = useState('en_US');
  const [isEditing, setIsEditing] = useState(false);
  const [coinList, setCoinList] = useState([]);
  const [config, setConfig] = useState('');
  const [configId, setConfigId] = useState('');
  const [languages, setLanguages] = useState<any[]>([]);
  const [imagesConfig, setImagesConfig] =
    useState<Record<string, { backgroundImage: string; posterImage: string }>>();

  const getCoin = async () => {
    let data = {
      pageNo: 1,
      pageSize: 10000,
    };
    const res = await getCurrencyCoinList(data);
    if (res.code === '0') {
      setCoinList(res.data.list);
    }
  };

  const getConfig = async () => {
    const res = await getTenantKeyParams({ key: 'account_configuration' });
    if (res.code === '0') {
      console.log(res.data);
      setConfig(res.data?.keyValue);
    }
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  //获取图片配置详情
  const getImageDetail = async () => {
    const res = await getImageConfigurationDetail();
    if (res.code === '0') {
      const imageConfigObj: Record<string, { backgroundImage: string; posterImage: string }> = {};
      res.data.forEach((item: any) => {
        imageConfigObj[item.languageCode] = {
          backgroundImage: item.backgroundImageUrl,
          posterImage: item.posterBackgroundUrl,
        };
      });
      setImagesConfig(imageConfigObj);
    }
  };

  // 保存图片配置
  const saveImage = async (backgroundImage: string, posterImage: string) => {
    let data = {
      images: [
        {
          languageCode: language,
          backgroundImageUrl: backgroundImage,
          posterBackgroundUrl: posterImage,
        },
      ],
    };
    const res = await saveOrUpdateImageConfiguration(data);
    if (res.code === '0') {
      message.success(intl.formatMessage({ id: 'inviteFriends.message.imageConfigSaveSuccess' }));
    } else {
      message.error(res.message);
    }
    await getImageDetail();
  };

  // 保存配置
  const saveConfiguration = async (values: any) => {
    let data = {
      ...values,
      id: configId,
    };
    const res = await saveOrUpdateRewardConfiguration(data);
    if (res.code === '0') {
      message.success(intl.formatMessage({ id: 'inviteFriends.message.configSaveSuccess' }));
      setIsEditing(false); // 保存成功后关闭编辑状态
    } else {
      message.error(res.message);
    }
  };

  //获取奖励配置详情
  const getConfigurationDetail = async () => {
    const res = await getRewardConfigurationDetail();
    if (res.code === '0') {
      setConfigId(res.data.id);
      form.setFieldsValue(res.data);
    }
  };

  //获取用户邀请详情列表
  const getUserList = async () => {
    let data = {
      pageNo: 1,
      pageSize: 10000,
    };
    const res = await getUserInviteDetailList(data);
    console.log(res);
  };

  // 获取资金账户列表
  const getFundAccounts = async (params: any) => {
    let data = {
      pageNo: params.current,
      pageSize: params.pageSize,
    };
    const res = await getFundAccountsList(data);
    if (res.code === '0') {
      return {
        data: res.data.list,
        success: true,
        total: res.data.count,
      };
    }
    return {
      data: [],
      success: false,
      total: 0,
    };
  };

  // 获取语言列表
  const getLanguageList = async () => {
    let data = {
      pageNo: 1,
      pageSize: 10000,
    };
    const res = await tenantLangList(data);
    if (res.code === '0') {
      setLanguages(res.data?.list || []);
    }
  };

  useEffect(() => {
    getCoin();
    getConfig();
    getConfigurationDetail();
    getUserList();
    getImageDetail();
    getLanguageList();
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
      render: (_, record) => {
        return record.isLock === 0
          ? intl.formatMessage({ id: 'inviteFriends.fundAccount.status.unlocked' })
          : intl.formatMessage({ id: 'inviteFriends.fundAccount.status.locked' });
      },
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
        <a key="records" href="/invite-friends/reward-records">
          {intl.formatMessage({ id: 'inviteFriends.fundAccount.action.records' })}
        </a>,
      ],
    },
  ];

  // 保存图片配置
  const handleSave = (backgroundImage: string, posterImage: string) => {
    saveImage(backgroundImage, posterImage);
  };

  // 处理背景图片变化
  const handleBackgroundImageChange = (url: string) => {
    setImagesConfig((prev) => {
      if (!prev) return { [language]: { backgroundImage: url, posterImage: '' } };
      return {
        ...prev,
        [language]: {
          ...prev[language],
          backgroundImage: url,
        },
      };
    });
  };

  // 处理海报图片变化
  const handlePosterImageChange = (url: string) => {
    setImagesConfig((prev) => {
      if (!prev) return { [language]: { backgroundImage: '', posterImage: url } };
      return {
        ...prev,
        [language]: {
          ...prev[language],
          posterImage: url,
        },
      };
    });
  };

  // 邀请页面配置 items
  const items = languages.map((lang) => {
    return {
      label: lang.langEncode,
      key: lang.langEncode,
      children: (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 20,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
            <div>
              <h4>{intl.formatMessage({ id: 'inviteFriends.pageConfig.backgroundTitle' })}</h4>
              <AvatarUpload onChange={handleBackgroundImageChange} value={imagesConfig?.[language]?.backgroundImage || ''}/>
              <p>{intl.formatMessage({ id: 'inviteFriends.imageConfigModal.backgroundSize' })}</p>
            </div>
            <div>
              <h4>{intl.formatMessage({ id: 'inviteFriends.pageConfig.posterTitle' })}</h4>
              <AvatarUpload onChange={handlePosterImageChange} value={imagesConfig?.[language]?.posterImage || ''}/>
              <p>{intl.formatMessage({ id: 'inviteFriends.imageConfigModal.posterSize' })}</p>
            </div>
          </div>
          <Button type="primary" onClick={() => handleSave(imagesConfig?.[language]?.backgroundImage || '', imagesConfig?.[language]?.posterImage || '')}>
            保存
          </Button>
        </div>
      ),
    };
  });

  // 邀请页面配置 TabBar
  const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 20, marginBottom: 20 }}>
        {languages.map((lang) => (
          <Button
            key={lang.langEncode}
            type={lang.langEncode === language ? 'primary' : 'text'}
            onClick={() => handleLanguageChange(lang.langEncode)}
          >
            {lang.lang}
          </Button>
        ))}
      </div>
      <div style={{ margin: '20px 0' }}>
        {intl.formatMessage({ id: 'inviteFriends.accountConfig.tips' })}
        {intl.formatMessage({ id: 'inviteFriends.pageConfig.languageInfo' })}
      </div>
    </div>
  );

  return (
    <PageContainer title={intl.formatMessage({ id: 'inviteFriends.basicConfig.title' })}>
      {/* 账户配置 */}
      <Card
        title={intl.formatMessage({ id: 'inviteFriends.accountConfig.title' })}
        style={{ marginBottom: 24 }}
      >
        <Form.Item
          name="enabled"
          label={intl.formatMessage({ id: 'inviteFriends.accountConfig.enabled' })}
          valuePropName="checked"
        >
          <Switch
            value={config === '1'}
            onChange={async (checked) => {
              const res = await updateAccountConfiguration({
                keyProperty: 'account_configuration',
                keyValue: checked ? '1' : '0',
              });
              if (res.code === '0') {
                message.success(
                  intl.formatMessage({ id: 'inviteFriends.message.configSaveSuccess' }),
                );
              } else {
                message.error(res.message);
              }
              getConfig();
            }}
          />
        </Form.Item>
        <div className="tips">
          <p style={{ color: themeColor }}>
            {intl.formatMessage({ id: 'inviteFriends.accountConfig.tips' })}
            {intl.formatMessage({ id: 'inviteFriends.accountConfig.tips.content' })}
          </p>
        </div>
      </Card>

      {/* 奖励配置 */}
      <Card
        title={intl.formatMessage({ id: 'inviteFriends.rewardConfig.title' })}
        style={{ marginBottom: 24 }}
        extra={
          <Button type="primary" onClick={toggleEdit}>
            {isEditing
              ? intl.formatMessage({ id: 'inviteFriends.rewardConfig.cancel' })
              : intl.formatMessage({ id: 'inviteFriends.rewardConfig.edit' })}
          </Button>
        }
      >
        <Form form={form} onFinish={saveConfiguration} disabled={!isEditing}>
          <Form.Item
            name="coinId"
            label={intl.formatMessage({ id: 'inviteFriends.rewardConfig.coinType' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'inviteFriends.rewardConfig.coinType.placeholder',
                }),
              },
            ]}
          >
            <Select style={{ width: 200 }}>
              {coinList.map((item: any) => (
                <Option value={item.coinId} key={item.coinId}>
                  {item.coinName}
                </Option>
              ))}
            </Select>
            <span style={{ marginLeft: 10, color: 'rgba(0,0,0,0.45)' }}>
              实际手续费币种与返佣币种不一致时,将根据实时汇率折算为返佣币种
            </span>
          </Form.Item>

          <Form.Item
            name="rebateRatio"
            label={intl.formatMessage({ id: 'inviteFriends.rewardConfig.rebateRatio' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'inviteFriends.rewardConfig.rebateRatio.placeholder',
                }),
              },
            ]}
          >
            <InputNumber min={0} max={100} addonAfter="%" style={{ width: 200 }} />
          </Form.Item>

          <Form.Item
            name="validTime"
            label={intl.formatMessage({ id: 'inviteFriends.rewardConfig.validTime' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'inviteFriends.rewardConfig.validTime.placeholder',
                }),
              },
            ]}
          >
            <InputNumber
              min={1}
              addonAfter={intl.formatMessage({ id: 'inviteFriends.rewardConfig.validTime.unit' })}
              style={{ width: 200 }}
            />
          </Form.Item>

          <Form.Item
            name="rechargeLimit"
            label={intl.formatMessage({ id: 'inviteFriends.rewardConfig.rechargeLimit' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'inviteFriends.rewardConfig.rechargeLimit.placeholder',
                }),
              },
            ]}
          >
            <InputNumber
              min={0}
              addonAfter={intl.formatMessage({
                id: 'inviteFriends.rewardConfig.rechargeLimit.unit',
              })}
              style={{ width: 200 }}
            />
          </Form.Item>

          <Form.Item
            name="isRealname"
            label={intl.formatMessage({ id: 'inviteFriends.rewardConfig.isRealname' })}
          >
            <Radio.Group>
              <Radio value="1">
                {intl.formatMessage({ id: 'inviteFriends.rewardConfig.isRealname.required' })}
              </Radio>
              <Radio value="0">
                {intl.formatMessage({ id: 'inviteFriends.rewardConfig.isRealname.notRequired' })}
              </Radio>
            </Radio.Group>
          </Form.Item>

          {isEditing && (
            <div style={{ textAlign: 'right' }}>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ marginLeft: 'auto' }}>
                  {intl.formatMessage({ id: 'inviteFriends.rewardConfig.save' })}
                </Button>
              </Form.Item>
            </div>
          )}
        </Form>
      </Card>

      {/* 邀请页面配置 */}
      <Card
        title={intl.formatMessage({ id: 'inviteFriends.pageConfig.title' })}
        style={{ marginBottom: 24, height: '100%' }}
      >
        <Tabs activeKey={language} renderTabBar={renderTabBar} items={items} />
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
