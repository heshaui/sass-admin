import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Form, Input, Button, Select, InputNumber, message } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { walletTypeList, tenantToWallet } from '@/services/ant-design-pro/fundsTools';
import { sendGoogleKey, bindGoogleKey } from '@/services/ant-design-pro/authAdmin';
import { useModel, useIntl } from '@umijs/max';
import GoogleCode from '@/components/GoogleCode';
import { tenantCurrencyCoinList } from '@/services/ant-design-pro/spot';
import { userWalletParams } from '@/services/ant-design-pro/fundsTools';
//@ts-ignore
import { clearAllCookies } from '@/utils';
import { validateNumber } from '@/utils/regex';
const { Option } = Select;

const TransferTool: React.FC = () => {
  const intl = useIntl();
  const [form] = Form.useForm();

  const [walletList, setWalletList] = useState<any[]>([]);
  const [coinList, setCoinList] = useState<any[]>([]);
  const [fromAccount, setFromAccount] = useState<string>('');
  const [toAccount, setToAccount] = useState<string>('');
  const { initialState, refresh } = useModel('@@initialState');
  const [googleCodeVisible, setGoogleCodeVisible] = useState(false);
  const [googleCodeData, setGoogleCodeData] = useState<any>(null);
  const { currentUser } = initialState || {};
  const [googleCode, setGoogleCode] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);

  const walletData = async () => {
    const res = await walletTypeList();
    if (res.code === '0') {
      setWalletList(res.data.list);
    }
  };

  const getCoin = async () => {
    let data = {
      pageNo: 1,
      pageSize: 10000,
    };
    const res = await tenantCurrencyCoinList(data);
    if (res.code === '0') {
      setCoinList(res.data.list);
    }
  };
  const onFinish = async (values: any) => {
    if (fromAccount === 'user') {
      values.form = values.formUid;
    }
    if (toAccount === 'user') {
      values.to = values.toUid;
    }
    // M2M("M2M", "商户转商户"),
    // M2U("M2U", "商户转用户"),
    // U2M("U2M", "用户转商户"),
    // U2U("U2U", "用户转用户"),
    let sceneTypeEnum = '';
    if (fromAccount === 'user' && toAccount === 'user') {
      sceneTypeEnum = 'U2U';
    } else if (fromAccount === 'user' && toAccount !== 'user') {
      sceneTypeEnum = 'U2M';
    } else if (fromAccount !== 'user' && toAccount !== 'user') {
      sceneTypeEnum = 'M2M';
    } else if (fromAccount !== 'user' && toAccount === 'user') {
      sceneTypeEnum = 'M2U';
    }
    let data = {
      form: values.form,
      to: values.to,
      coinId: values.coinId,
      count: values.count,
      description: values.description,
      sceneTypeEnum: sceneTypeEnum,
      googleCode: values.googleCode,
    };
    const res = await tenantToWallet(data);
    if (res.code === '0' && res.data) {
      message.success(intl.formatMessage({ id: 'transferTool.message.success' }));
      form.resetFields();
    } else {
      message.error(res.message);
    }
  };

  const handleFromAccountChange = (value: string) => {
    setFromAccount(value);
  };

  const handleToAccountChange = (value: string) => {
    setToAccount(value);
  };

  const getGoogleCode = async () => {
    const res = await sendGoogleKey();
    if (res.code === '0') {
      setGoogleCodeData(res.data);
      setGoogleCodeVisible(true);
    } else {
      message.error(res.message);
    }
  };

  const handleGoogleCodeSuccess = async (code: string) => {
    const res = await bindGoogleKey({ googleCode: code });
    if (res.code === '0' && res.data) {
      message.success(intl.formatMessage({ id: 'assetAdjustment.googleCode.bindSuccess' }));
      clearAllCookies();
      window.location.reload();
    } else {
      message.error(res.message);
    }
    setGoogleCodeVisible(false);
  };

  const getUserInfo = async (uid: string) => {
    const res = await userWalletParams({ idString: uid });
    if (res.code === '0') {
      setUserInfo(res.data);
    } else {
      message.error(res.message);
    }
  };

  useEffect(() => {
    walletData();
    getCoin();
  }, []);

  return (
    <PageContainer>
      <Card title={intl.formatMessage({ id: 'transferTool.title' })}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ width: '50%', margin: '0 auto' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Form.Item
              name="form"
              label={intl.formatMessage({ id: 'transferTool.form.label.fromAccount' })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'transferTool.form.validation.fromAccount' }),
                },
              ]}
              style={{ flex: 1 }}
            >
              <Select
                placeholder={intl.formatMessage({
                  id: 'transferTool.form.placeholder.fromAccount',
                })}
                onChange={handleFromAccountChange}
              >
                <Option key="user" value="user">
                  {intl.formatMessage({ id: 'transferTool.account.user' })}
                </Option>
                {walletList.map((item: any) => (
                  <Option key={item.walletType} value={item.walletType}>
                    {item.walletTypeDefeat}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '0 20px',
                marginTop: '20px',
              }}
            >
              <SwapOutlined style={{ fontSize: '20px', color: '#aaa' }} />
            </div>

            <Form.Item
              name="to"
              label={intl.formatMessage({ id: 'transferTool.form.label.toAccount' })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'transferTool.form.validation.toAccount' }),
                },
              ]}
              style={{ flex: 1 }}
            >
              <Select
                placeholder={intl.formatMessage({ id: 'transferTool.form.placeholder.toAccount' })}
                onChange={handleToAccountChange}
              >
                <Option key="user" value="user">
                  {intl.formatMessage({ id: 'transferTool.account.user' })}
                </Option>
                {walletList.map((item: any) => (
                  <Option key={item.walletType} value={item.walletType}>
                    {item.walletTypeDefeat}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {(fromAccount === 'user' || toAccount === 'user') && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {fromAccount === 'user' ? (
                <Form.Item
                  label={intl.formatMessage({ id: 'transferTool.form.label.uid' })}
                  name="formUid"
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'transferTool.form.validation.fromUid' }),
                    },
                    {
                      validator: (_, value) => {
                        if (value && !validateNumber(value)) {
                          return Promise.reject(
                            new Error(
                              intl.formatMessage({
                                id: 'transferTool.form.validation.enterNumber',
                              }),
                            ),
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
                      form.validateFields(['formUid']).then(async () => {
                        if (e.target.value) {
                          await getUserInfo(e.target.value);
                        }
                      });
                    }}
                    autoComplete="off"
                    maxLength={8}
                    placeholder={intl.formatMessage({ id: 'transferTool.form.placeholder.uid' })}
                  />
                </Form.Item>
              ) : (
                <div></div>
              )}

              {toAccount === 'user' && (
                <Form.Item
                  label={intl.formatMessage({ id: 'transferTool.form.label.uid' })}
                  name="toUid"
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'transferTool.form.validation.toUid' }),
                    },
                    {
                      validator: (_, value) => {
                        if (value && !validateNumber(value)) {
                          return Promise.reject(
                            new Error(
                              intl.formatMessage({
                                id: 'transferTool.form.validation.enterNumber',
                              }),
                            ),
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    style={{ width: '100%' }}
                    placeholder={intl.formatMessage({ id: 'transferTool.form.placeholder.uid' })}
                  />
                </Form.Item>
              )}
            </div>
          )}

          <Form.Item
            name="coinId"
            label={intl.formatMessage({ id: 'transferTool.form.label.currency' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'transferTool.form.validation.currency' }),
              },
            ]}
          >
            <Select
              placeholder={intl.formatMessage({ id: 'transferTool.form.placeholder.currency' })}
            >
              {coinList.map((item: any) => (
                <Option key={item.coinId} value={item.coinId}>
                  {item.coinName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="count"
            label={intl.formatMessage({ id: 'transferTool.form.label.amount' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'transferTool.form.validation.amount' }),
              },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder={intl.formatMessage({ id: 'transferTool.form.placeholder.amount' })}
            />
          </Form.Item>

          {form.getFieldValue('formUid') && (
            <div style={{ marginTop: '-15px', marginBottom: '15px' }}>
              <span>
                {intl.formatMessage({ id: 'transferTool.form.label.available' })}:
                {userInfo?.balance || 0} USDT
              </span>
            </div>
          )}

          <Form.Item
            label={intl.formatMessage({ id: 'transferTool.form.label.googleCode' })}
            name="googleCode"
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'transferTool.form.validation.googleCode' }),
              },
              {
                validator: (_, value) => {
                  if (value && !validateNumber(value)) {
                    return Promise.reject(
                      new Error(
                        intl.formatMessage({
                          id: 'transferTool.form.validation.enterNumber',
                        }),
                      ),
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            {currentUser?.employeeResp?.googleCode === false && (
              <Button type="link" onClick={getGoogleCode}>
                {intl.formatMessage({ id: 'assetAdjustment.googleCode.notBound' })}
              </Button>
            )}
            {currentUser?.employeeResp?.googleCode === true && (
              <Input
                maxLength={6}
                value={googleCode}
                onChange={(e) => setGoogleCode(e.target.value)}
                placeholder={intl.formatMessage({ id: 'transferTool.form.placeholder.googleCode' })}
              />
            )}
          </Form.Item>

          <Form.Item
            name="description"
            label={intl.formatMessage({ id: 'transferTool.form.label.description' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'transferTool.form.validation.description' }),
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder={intl.formatMessage({ id: 'transferTool.form.placeholder.description' })}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <Button htmlType="button" onClick={() => form.resetFields()}>
                {intl.formatMessage({ id: 'transferTool.form.button.cancel' })}
              </Button>
              <Button type="primary" htmlType="submit">
                {intl.formatMessage({ id: 'transferTool.form.button.confirm' })}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
      <GoogleCode
        visible={googleCodeVisible}
        qrCodeUrl={googleCodeData?.codeUri}
        secretKey={googleCodeData?.secretKey}
        onSubmit={handleGoogleCodeSuccess}
        onCancel={() => setGoogleCodeVisible(false)}
      />
    </PageContainer>
  );
};

export default TransferTool;
