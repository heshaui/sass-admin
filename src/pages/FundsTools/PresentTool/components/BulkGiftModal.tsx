import { useIntl } from '@umijs/max';
import { Modal, Steps } from 'antd';
import React, { useState } from 'react';
import BulkGiftStep1 from './BulkGiftStep1';
import BulkGiftStep2 from './BulkGiftStep2';
import BulkGiftStep3 from './BulkGiftStep3';

interface BulkGiftProps {
  open: boolean;
  type: string;
  onCancel: () => void;
  onSubmit?: () => void;
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
const BulkGift: React.FC<BulkGiftProps> = ({ open, type, onCancel }) => {
  const intl = useIntl();
  // const [form] = Form.useForm();
  // const [walletList, setWalletList] = useState<walletListType>({} as walletListType);
  // const [coinList, setCoinList] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  // const [typeList, setTypeList] = useState<SelectProps['options']>([]);

  // const getCoin = async () => {
  //   let data = {
  //     pageNo: 1,
  //     pageSize: 10000,
  //   };
  //   const res = await tenantCurrencyCoinList(data);
  //   if (res.code === '0') {
  //     setCoinList(
  //       res.data.list.map((item: any) => ({
  //         ...item,
  //         label: item.coinName,
  //         value: item.coinId,
  //       })),
  //     );
  //   }
  // };
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

  // const handleSubmit = async (values: any) => {
  //   const params = {
  //     coinName: coinList.find((item: any) => item.value === values.coinId)?.label,
  //     giftTypeEnum: values.type,
  //     uidAndAmount: values.amount,
  //   };
  //   try {
  //     const res = await getCoinGift(params);
  //     if (res.code === '0') {
  //       message.success(intl.formatMessage({ id: 'presentTool.modal.gift.success' }));
  //       onSubmit();
  //       onCancel();
  //     } else {
  //       message.error(res.message);
  //     }
  //   } catch (error) {
  //     message.error(String(error));
  //   }
  // };
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
    setCurrent(current + 1);
  };

  // useEffect(() => {
  //   if(!open) return;
  //   // getGiftType()
  //   getCoin();
  // }, [open]);

  const items = [
    {
      title: intl.formatMessage({ id: 'presentTool.steps.step1' }), //基本信息
      content: <BulkGiftStep1 type={type} onCancel={onCancel} onNext={onNext} />,
    },
    {
      title: intl.formatMessage({ id: 'presentTool.steps.step2' }), //上传照片
      content: (
        <BulkGiftStep2 onPrevious={onPrevious} current={current} onNext={onNext} type={type} />
      ),
    },
    {
      title: intl.formatMessage({ id: 'presentTool.steps.step3' }), //已提交
      content: <BulkGiftStep3 onPrevious={onPrevious} current={current} onCancel={onCancel} />,
    },
  ];
  return (
    <Modal
      title={intl.formatMessage({ id: 'presentTool.modal.gift.title' })}
      open={open}
      onCancel={onCancel}
      // footer={[
      //   current > 0 ? (
      //     <Button key="previous" onClick={onPrevious}>
      //       {intl.formatMessage({ id: 'presentTool.button.previous' })}
      //     </Button>
      //   ) : (
      //     <Button key="cancel" onClick={onCancel}>
      //       {intl.formatMessage({ id: 'presentTool.button.cancel' })}
      //     </Button>
      //   ),
      //   current === 2 ? (
      //     <Button
      //       key="submit"
      //       type="primary"
      //       onClick={() => {
      //         form.validateFields().then((values) => {
      //           handleSubmit(values);
      //           form.resetFields();
      //         });
      //       }}
      //     >
      //       {intl.formatMessage({ id: 'presentTool.button.submit2' })}
      //     </Button>
      //   ) : (
      //     <Button key="next" type={'primary'} onClick={onNext} disabled={!steps1NextFlag||!steps2NextFlag}>
      //       {intl.formatMessage({ id: 'presentTool.button.next' })}
      //     </Button>
      //   ),
      // ]}
      footer={[]}
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
      </div>
    </Modal>
  );
};

export default BulkGift;
