import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, ConfigProvider, DatePicker, Form, Input, Select, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'umi';

import { getCoinGiftList } from '@/services/ant-design-pro/fundsTools';
import { tenantCurrencyCoinList } from '@/services/ant-design-pro/spot';
import type { SelectProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import BulkGiftType from './components/BulkGiftTypeModal';
import GiftModal from './components/GiftModal';

const { RangePicker } = DatePicker;

interface TransferRecord {
  id: number;
  batchId: string;
  userId: number;
  amount: number;
  coinName: string;
  coinId: string;
  employeeId: number;
  createTime: number;
  updateTime: number;
  tenantId: string;
  type: string;
}
const TransferTool: React.FC = () => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading] = useState<boolean>(false);
  const [coinOptions, setCoinOptions] = useState<SelectProps['options']>([]);
  const [tableData, setTableData] = useState<TransferRecord[]>([]);
  const pagination = useRef({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [giftOpen, setGiftOpen] = useState(false);
  const [bulkGiftOpen, setBulkGiftOpen] = useState(false);
  const typeOptions: SelectProps['options'] = [
    {
      label: intl.formatMessage({ id: 'presentTool.select.all' }), //'全部‘
      value: '',
    },
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
      setCoinOptions(
        res.data.list
          .map((item: any) => ({
            ...item,
            label: item.coinName,
            value: item.coinId,
          }))
          .filter((item: any) => item.status !== 0),
      );
    }
  };

  const columns: ColumnsType<TransferRecord> = [
    {
      title: 'Bulk ID',
      dataIndex: 'batchId',
      key: 'batchId',
    },
    {
      title: intl.formatMessage({ id: 'presentTool.table.column.time' }), //'赠币日期',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => {
        return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: 'UID',
      dataIndex: 'userId',
      key: 'userId',
      render: (employeeId) => (
        <a onClick={() => navigate(`/user-management/user-list?userId=${employeeId}`)}>
          {employeeId}
        </a>
      ),
    },
    {
      title: intl.formatMessage({ id: 'presentTool.table.column.type' }), //'类型',
      dataIndex: 'type',
      key: 'type',
      render: (text) => {
        return text && text.toUpperCase() === 'MARKET_GIFT'
          ? intl.formatMessage({ id: 'presentTool.select.market' })
          : text && text.toUpperCase() === 'ACTIVITY_GIFT'
          ? intl.formatMessage({ id: 'presentTool.select.activity' })
          : '--';
      },
    },
    {
      title: intl.formatMessage({ id: 'basicConfig.benefit.coin' }), //'币种',
      dataIndex: 'coinName',
      key: 'coinName',
    },
    {
      title: intl.formatMessage({ id: 'presentTool.table.column.amount' }), //'赠币数量',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: intl.formatMessage({ id: 'presentTool.table.column.adminID' }), //'管理员ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
    },
  ];
  const onFinish = async () => {
    // 实现赠币查询逻辑
    form.validateFields().then(async (values) => {
      const params = {
        startTime: values.time && values.time[0] ? values.time[0].startOf('day').valueOf() : null,
        endTime: values.time && values.time[1] ? values.time[1].endOf('day').valueOf() : null,
        userId: values.uid || null,
        coinId: values.coinId || null,
        batchId: values.bulkId || null,
        type: values.type || null,
        pageNo: pagination.current.current,
        pageSize: pagination.current.pageSize,
      };
      const res = await getCoinGiftList(params);
      if (res.code === '0') {
        setTableData(res.data.list);
        pagination.current.total = res.data.count;
      }
    });
  };
  const onGiftFinish = async () => {
    pagination.current.current = 1;
    await onFinish();
  };
  useEffect(() => {
    onFinish();
    getCoin();
  }, []);

  return (
    <ConfigProvider
      theme={{
        components: {
          Form: {
            itemMarginBottom: 20,
            inlineItemMarginBottom: 20,
          },
        },
      }}
    >
      <PageContainer>
        <Card title={intl.formatMessage({ id: 'presentTool.title' })}>
          <Form form={form} name="advanced_search" layout="inline" onFinish={onGiftFinish}>
            <Form.Item
              name="type"
              label={intl.formatMessage({ id: 'presentTool.tip.type' })}
              initialValue=""
            >
              <Select style={{ width: 180 }} options={typeOptions}></Select>
            </Form.Item>
            <Form.Item name="uid" label={'UID'} initialValue="">
              <Input placeholder={intl.formatMessage({ id: 'presentTool.tip.input' })} allowClear />
            </Form.Item>
            <Form.Item
              name="coinId"
              label={intl.formatMessage({ id: 'presentTool.tip.currency' })}
              initialValue=""
            >
              <Select style={{ width: 180 }} options={coinOptions} allowClear></Select>
            </Form.Item>
            <Form.Item name="bulkId" label={'Bulk ID'} initialValue="">
              <Input placeholder={intl.formatMessage({ id: 'presentTool.tip.input' })} allowClear />
            </Form.Item>
            <Form.Item name="time" label={intl.formatMessage({ id: 'presentTool.tip.time' })}>
              <RangePicker
                allowClear
                placeholder={[
                  intl.formatMessage({ id: 'presentTool.tip.start' }),
                  intl.formatMessage({ id: 'presentTool.tip.end' }),
                ]}
                // minDate={dayjs().subtract(6, 'month')}
                maxDate={dayjs().endOf('day')}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {intl.formatMessage({ id: 'presentTool.button.submit' })}
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="button" onClick={() => setGiftOpen(true)}>
                {/*  赠币*/}
                {intl.formatMessage({ id: 'presentTool.button.gift' })}
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="button" onClick={() => setBulkGiftOpen(true)}>
                {/*批量赠币  */}
                {intl.formatMessage({ id: 'presentTool.button.bulkGift' })}
              </Button>
            </Form.Item>
          </Form>
          <div>
            {/* <ProTable
              columns={columns}
              request={onFinish}

              search={false}
              loading={loading}
              pagination={{ pageSize: 10 }}
            /> */}
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={{
                pageSize: 10,
                total: pagination.current.total,
                current: pagination.current.current,
                showSizeChanger: false,
                onChange: (page, pageSize) => {
                  pagination.current.current = page;
                  pagination.current.pageSize = pageSize;
                  onFinish();
                },
              }}
              loading={loading}
            />
          </div>
          <GiftModal open={giftOpen} onCancel={() => setGiftOpen(false)} onSubmit={onGiftFinish} />
          <BulkGiftType
            open={bulkGiftOpen}
            onCancel={() => setBulkGiftOpen(false)}
            onSubmit={onGiftFinish}
          />
        </Card>
      </PageContainer>
    </ConfigProvider>
  );
};

export default TransferTool;
