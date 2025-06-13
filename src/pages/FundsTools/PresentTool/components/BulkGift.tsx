import { getCoinGift } from '@/services/ant-design-pro/fundsTools';
import { tenantCurrencyCoinList } from '@/services/ant-design-pro/spot';
import { useIntl } from '@umijs/max';
import { Button, Form, Modal, Steps, message } from 'antd';
import React, { useEffect, useState } from 'react';
import BulkGiftSetp1 from './BulkGiftSetp1';
import BulkGiftSetp2 from './BulkGiftSetp2';

interface BulkGiftProps {
  open: boolean;
  type: string;
  onCancel: () => void;
  onSubmit: () => void;
}
// interface walletListType {
//   id: number,
//   balance: number,
//   frozenBalance: number,
//   releaseBalance: number,
//   isLock: number,
//   walletType: string,
//   lockVersion: number,
//   coinId: string,
//   tenantId: string
// }
const BulkGift: React.FC<BulkGiftProps> = ({ open, type, onCancel, onSubmit }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  // const [walletList, setWalletList] = useState<walletListType>({} as walletListType);
  const [coinList, setCoinList] = useState<any[]>([]);
  const [current, setCurrent] = useState(1);
  const [steps1NextFlag, setSteps1NextFlag] = useState(false);
  // const [typeList, setTypeList] = useState<SelectProps['options']>([]);

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
  // const getTenantWalletList = async (value: string) => {
  //   const coinId = value;
  //   if (!coinId) return;
  //   const res = await tenantWallet({
  //     walletType: 'coin_gift_account',
  //     coinId: coinId
  //   });
  //   if (res.code === '0') {
  //     setWalletList(res.data);
  //   }
  // }

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
  const onPrevious = () => {
    setCurrent(current - 1);
  };
  const onNext = () => {
    if (!steps1NextFlag) return;
    setCurrent(current + 1);
  };
  const setSteps1Next = () => {
    setSteps1NextFlag(true);
  };
  useEffect(() => {
    // getGiftType()
    getCoin();
  }, []);

  const items = [
    {
      title: intl.formatMessage({ id: 'presentTool.steps.step1' }), //基本信息
      content: <BulkGiftSetp1 setps1Next={setSteps1Next} type={type} />,
    },
    {
      title: intl.formatMessage({ id: 'presentTool.steps.step2' }), //上传照片
      content: <BulkGiftSetp2 setps1Next={setSteps1Next} type={type} />,
    },
    {
      title: intl.formatMessage({ id: 'presentTool.steps.step3' }), //已提交
      content: '333',
    },
  ];
  return (
    <Modal
      title={intl.formatMessage({ id: 'presentTool.modal.gift.title' })}
      open={open}
      onCancel={onCancel}
      footer={[
        current > 0 ? (
          <Button key="previous" onClick={onPrevious}>
            {intl.formatMessage({ id: 'presentTool.button.previous' })}
          </Button>
        ) : (
          <Button key="cancel" onClick={onCancel}>
            {intl.formatMessage({ id: 'presentTool.button.cancel' })}
          </Button>
        ),
        current === 2 ? (
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
          </Button>
        ) : (
          <Button key="next" type={'primary'} onClick={onNext} disabled={!steps1NextFlag}>
            {intl.formatMessage({ id: 'presentTool.button.next' })}
          </Button>
        ),
      ]}
      width={600}
    >
      <div style={{ display: 'flex' }}>
        <div
          style={{
            width: '100%',
            flex: 1,
            paddingRight: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Steps
            current={current}
            labelPlacement="vertical"
            items={items}
            className="custom-steps2"
          />
          <div style={{ width: '100%' }}>{items[current].content}</div>
        </div>

        <div></div>
      </div>
    </Modal>
  );
};

export default BulkGift;
