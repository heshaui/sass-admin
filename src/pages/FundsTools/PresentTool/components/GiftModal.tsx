import { getCoinGift, tenantWallet } from '@/services/ant-design-pro/fundsTools';
import { tenantCurrencyCoinList } from '@/services/ant-design-pro/spot';
import { useIntl } from '@umijs/max';
import type { SelectProps } from 'antd';
import { Button, Form, Input, Modal, Select, message } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './styles/gift.module.less';

// const { Option } = Select;

interface GiftModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}
interface walletListType {
  id: number;
  balance: number;
  frozenBalance: number;
  releaseBalance: number;
  isLock: number;
  walletType: string;
  lockVersion: number;
  coinId: string;
  tenantId: string;
}
const GiftModal: React.FC<GiftModalProps> = ({ open, onCancel, onSubmit }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [walletList, setWalletList] = useState<walletListType>({} as walletListType);
  const [coinList, setCoinList] = useState<any[]>([]);
  // const [typeList, setTypeList] = useState<SelectProps['options']>([]);
  const typeOptions: SelectProps['options'] = [
    {
      label: intl.formatMessage({ id: 'presentTool.select.market' }), //'做市赠币'
      value: 'MARKET_GIFT',
    },
    {
      label: intl.formatMessage({ id: 'presentTool.select.activity' }), //'活动赠币'
      value: 'ACTIVITY_GIFT',
    },
  ];

  const getCoin = async () => {
    let data = {
      pageNo: 1,
      pageSize: 10000,
    };
    const res = await tenantCurrencyCoinList(data);
    if (res.code === '0') {
      setCoinList(
        res.data.list.map((item: any) => ({
          ...item,
          label: item.coinName,
          value: item.coinId,
        })),
      );
    }
  };
  const getTenantWalletList = async (value: string) => {
    const coinId = value;
    if (!coinId) return;
    const res = await tenantWallet({
      walletType: 'coin_gift_account',
      coinId: coinId,
    });
    if (res.code === '0') {
      setWalletList(res.data);
    }
  };

  const handleSubmit = async (values: any) => {
    const params = {
      coinName: coinList.find((item: any) => item.value === values.coinId)?.label,
      giftTypeEnum: values.type,
      uidAndAmount: values.amount,
    };
    try {
      const res = await getCoinGift(params);
      if (res.code === '0') {
        message.success(intl.formatMessage({ id: 'presentTool.modal.gift.success' }));
        onSubmit();
        onCancel();
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error(String(error));
    }
  };
  // const getGiftType = async () => {
  //   const res = await getCoinGiftType();
  //   if (res.code === '0') {
  //     setTypeList(res.data);
  //   }
  // }

  useEffect(() => {
    // getGiftType()
    getCoin();
  }, []);
  return (
    <Modal
      title={intl.formatMessage({ id: 'presentTool.modal.gift.title' })}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {intl.formatMessage({ id: 'presentTool.button.cancel' })}
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            form.validateFields().then((values) => {
              handleSubmit(values);
              form.resetFields();
            });
          }}
        >
          {intl.formatMessage({ id: 'presentTool.button.submit2' })}
        </Button>,
      ]}
      width={500}
    >
      <div style={{ display: 'flex' }}>
        <div
          style={{
            width: '100%',
            flex: 1,
            paddingRight: 20,
            // display: 'flex',
            // flexDirection: 'column',
            // alignItems: 'center'
          }}
        >
          <Form form={form} layout="horizontal" labelCol={{ span: 7 }} wrapperCol={{ span: 18 }}>
            <Form.Item
              name="type"
              label={intl.formatMessage({ id: 'presentTool.tip.type' })}
              initialValue=""
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'presentTool.modal.gift.typeError' }),
                },
              ]}
            >
              <Select style={{ width: '100%' }} options={typeOptions} />
            </Form.Item>
            <div>
              <Form.Item
                label={intl.formatMessage({ id: 'presentTool.tip.currency' })}
                name="coinId"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'presentTool.modal.gift.coinTypeError' }),
                  },
                ]}
              >
                <Select
                  style={{ width: '100%' }}
                  options={coinList}
                  allowClear
                  onChange={getTenantWalletList}
                  onClear={() => setWalletList({} as walletListType)}
                />
              </Form.Item>
              <Form.Item label={null}>
                {intl.formatMessage({ id: 'presentTool.modal.gift.balance' })}：{walletList.balance}
              </Form.Item>
            </div>
            <Form.Item
              label={intl.formatMessage({ id: 'presentTool.tip.text' })}
              name="amount"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'presentTool.modal.gift.amountError' }),
                },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder={intl.formatMessage({ id: 'presentTool.modal.gift.amountError' })}
              />
            </Form.Item>
            <Form.Item label={null}>
              <p className={styles.warningText}>
                {intl.formatMessage({ id: 'presentTool.tip.tip1' })}
              </p>
              <p className={styles.warningText}>
                {intl.formatMessage({ id: 'presentTool.tip.tip2' })}
              </p>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default GiftModal;
