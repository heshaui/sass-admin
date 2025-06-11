import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Card, ConfigProvider, DatePicker, Form, Input, Select } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'umi';

import type { SelectProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
const { RangePicker } = DatePicker;

interface TransferRecord {
  key: string;
  createTime: string;
  fromAccount: string;
  fromAccountType: string;
  toAccount: string;
  toAccountType: string;
  amount: string;
  remark: string;
  operator: string;
}
const TransferTool: React.FC = () => {
  const intl = useIntl();
  const [form] = Form.useForm();

  const [loading] = useState<boolean>(false);
  const [coinOptions] = useState<SelectProps['options']>([]);

  const typeOptions: SelectProps['options'] = [
    {
      label: '全部',
      value: '',
    },
    {
      label: '做市赠币',
      value: '1',
    },
    {
      label: '活动赠币',
      value: '2',
    },
  ];
  const columns: ColumnsType<TransferRecord> = [
    {
      title: intl.formatMessage({ id: 'transferRecords.column.createTime' }),
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: intl.formatMessage({ id: 'transferRecords.column.fromAccount' }),
      dataIndex: 'fromAccountId',
      key: 'fromAccountId',
    },
    {
      title: intl.formatMessage({ id: 'transferRecords.column.fromAccountType' }),
      dataIndex: 'fromAccountType',
      key: 'fromAccountType',
    },
    {
      title: intl.formatMessage({ id: 'transferRecords.column.toAccount' }),
      dataIndex: 'toAccountType',
      key: 'toAccountType',
    },
    {
      title: intl.formatMessage({ id: 'transferRecords.column.toAccountType' }),
      dataIndex: 'sceneType',
      key: 'sceneType',
    },
    {
      title: intl.formatMessage({ id: 'transferRecords.column.amount' }),
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: intl.formatMessage({ id: 'transferRecords.column.description' }),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: intl.formatMessage({ id: 'transferRecords.column.operator' }),
      dataIndex: 'operateId',
      key: 'operateId',
    },
  ];
  const onFinish = async () => {
    // 实现赠币查询逻辑
  };

  // useEffect(() => {
  //   walletData();
  //   getCoin();
  // }, []);

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
          <Form form={form} name="advanced_search" layout="inline" onFinish={onFinish}>
            <Form.Item name="type" label={'类型'} initialValue="">
              <Select style={{ width: 180 }} options={typeOptions}></Select>
            </Form.Item>
            <Form.Item name="uid" label={'UID'} initialValue="">
              <Input placeholder="请输入UID" />
            </Form.Item>
            <Form.Item name="coinId" label={'币种'} initialValue="">
              <Select style={{ width: 180 }} options={coinOptions}></Select>
            </Form.Item>
            <Form.Item name="bulkId" label={'Bulk ID'} initialValue="">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item name="time" label="时间">
              <RangePicker />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="button">
                赠币
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="button">
                批量赠币
              </Button>
            </Form.Item>
          </Form>
          <div>
            <ProTable
              columns={columns}
              search={false}
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </div>
        </Card>
      </PageContainer>
    </ConfigProvider>
  );
};

export default TransferTool;
