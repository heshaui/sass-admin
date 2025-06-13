import { useIntl } from '@umijs/max';
import type { SelectProps } from 'antd';
import { Button, Form, Modal, Select } from 'antd';
import React, { useState } from 'react';
import BulkGift from '../components/BulkGift';

// const { Option } = Select;

interface BulkGiftTypeProps {
  open: boolean;
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
const BulkGiftType: React.FC<BulkGiftTypeProps> = ({ open, onCancel, onSubmit }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  // const [coinList, setCoinList] = useState<any[]>([]);
  const [bulkGiftOpen, setBulkGiftOpen] = useState(false);
  const [giftType, setGiftType] = useState('');
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

  // const getCoin = async () => {
  //   let data = {
  //     pageNo: 1,
  //     pageSize: 10000
  //   }
  //   const res = await tenantCurrencyCoinList(data);
  //   if (res.code === '0') {
  //     setCoinList(res.data.list.map((item: any) => ({
  //       ...item,
  //       label: item.coinName,
  //       value: item.coinId
  //     })));
  //   }
  // }
  const handleSubmit = async (values: any) => {
    setGiftType(values.type);
    setBulkGiftOpen(true);
  };
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };
  const onGiftSubmit = () => {
    onSubmit();
    handleCancel();
  };

  // useEffect(() => {
  //   // getGiftType()
  //   getCoin();
  // }, []);
  return (
    <Modal
      title={intl.formatMessage({ id: 'presentTool.modal.gift.title' })}
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          {intl.formatMessage({ id: 'presentTool.button.cancel' })}
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            form.validateFields().then((values) => {
              handleSubmit(values);
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
          <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
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
          </Form>
        </div>
      </div>
      <BulkGift
        open={bulkGiftOpen}
        type={giftType}
        onCancel={() => setBulkGiftOpen(false)}
        onSubmit={onGiftSubmit}
      />
    </Modal>
  );
};

export default BulkGiftType;
