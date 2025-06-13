import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, message } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import AssetAdjustmentForm from './components/AssetAdjustmentForm';
import { tenantSubWallet, tenantSubWalletList } from '@/services/ant-design-pro/fundsTools';
import { getCurrencyCoinList } from '@/services/ant-design-pro/inviteFriends';
import { useIntl } from '@umijs/max';

const AssetAdjustment: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [currencyList, setCurrencyList] = useState<any[]>([]);

  const subWalletList = async (params: any) => {
    const res = await tenantSubWalletList({
      pageNo: params.current,
      pageSize: params.pageSize,
      coinId: params.coinId,
    });
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

  const getCoinList = async () => {
    let data = {
      pageNo: 1,
      pageSize: 10000,
    };
    const res = await getCurrencyCoinList(data);
    if (res.code === '0') {
      setCurrencyList(res.data.list);
    }
  };

  const handleFormSubmit = async (values: any) => {
    if (values.direction === 'increase') {
      values.to = values.account;
    } else {
      values.form = values.account;
    }
    let data = {
      sceneTypeEnum: 'M2M',
      coinId: values.currency,
      count: values.amount,
      googleCode: values.googleCode,
      form: values?.form,
      to: values?.to,
      description: values.description,
    };
    const res = await tenantSubWallet(data);
    if (res.code === '0') {
      message.success(intl.formatMessage({ id: 'assetAdjustment.message.success' }));
      actionRef.current?.reload();
    } else {
      message.error(res.message);
    }
    setFormVisible(false);
  };

  // 定义ProTable的列
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({ id: 'assetAdjustment.column.id' }),
      dataIndex: 'id',
      key: 'id',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'assetAdjustment.column.coinName' }),
      dataIndex: 'coinName',
      key: 'coinName',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'assetAdjustment.column.coinName' }),
      dataIndex: 'coinId',
      key: 'coinId',
      valueType: 'select',
      fieldProps: {
        options: currencyList.map((item: any) => ({
          label: item.coinName,
          value: item.coinId,
        })),
      },
    },

    {
      title: intl.formatMessage({ id: 'assetAdjustment.column.amount' }),
      dataIndex: 'count',
      key: 'count',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'assetAdjustment.column.description' }),
      dataIndex: 'description',
      key: 'description',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'assetAdjustment.column.operator' }),
      dataIndex: 'operateId',
      key: 'operateId',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'assetAdjustment.column.createTime' }),
      dataIndex: 'createTime',
      key: 'createTime',
      valueType: 'dateTime',
      search: false,
    },
  ];

  useEffect(() => {
    getCoinList();
  }, []);
  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        columns={columns}
        request={subWalletList}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
        toolBarRender={() => [
          <Button key="button" type="primary" onClick={() => setFormVisible(true)}>
            {intl.formatMessage({ id: 'assetAdjustment.button.operation' })}
          </Button>,
        ]}
        search={{
          labelWidth: 'auto',
        }}
      />

      <AssetAdjustmentForm
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        onSubmit={handleFormSubmit}
      />
    </PageContainer>
  );
};

export default AssetAdjustment;
