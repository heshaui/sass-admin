import {
  adminCurrencyCoinExtList,
  adminSaveCurrencyCoin,
  adminSaveCurrencyCoinExt,
  currencyCoinList,
  saveTenantCurrencyCoin,
  tenantCurrencyCoinList,
  adminUpdateCurrencyCoinExtById,
  adminUpdateCurrencyCoinById,
  saveTenantCurrencyCoinExt,
  updateTenantCurrencyCoinExtById
} from '@/services/ant-design-pro/spot';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Modal, Space, Spin, Switch, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { useIntl } from 'umi';
import CurrencyForm from './components/CurrencyForm';
import ExtendInfoForm, { ExtendInfoFormData } from './components/ExtendInfoForm';
import CurrencyIntroForm, { CurrencyIntroFormData } from './components/CurrencyIntroForm';
// 币种类型定义
type CurrencyItem = {
  id: number;
  coinId: number | string;
  name: string;
  symbol: string;
  logo: string;
  networkType: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  sortId?: string; // 排序ID
  canRecharge:number;
  canWithdraw:number;
  canTransfer:number;
  canAutoWithdraw:number;
};

const CurrencyManagement: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [selectedRows, setSelectedRows] = useState<CurrencyItem[]>([]);
  const [extInfo, setExtInfo] = useState<any>(null);

  const [data, setData] = useState<CurrencyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [extendInfoVisible, setExtendInfoVisible] = useState<boolean>(false);
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyItem | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [extendInfoMode, setExtendInfoMode] = useState<'add' | 'edit'>('add');
  const isAdmin = process.env.UMI_APP_ADMIN_FLAG === '1';
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [expandLoading, setExpandLoading] = useState<Record<string, boolean>>({});
  const [expandedData, setExpandedData] = useState<Record<string, any>>({});
  const [introFormVisible, setIntroFormVisible] = useState<boolean>(false);
  const [currentIntroData, setCurrentIntroData] = useState<CurrencyIntroFormData | null>(null);

  const fetchData = async (params: any) => {
    setLoading(true);

    const res = isAdmin
      ? await currencyCoinList({
        pageNo: current,
        pageSize: pageSize,
        keyword:params.keyword,
        coinName:params.coinName,
        status:params.status,
        symbol:params.symbol,
        recharge:params.recharge,
        networkType:params.networkType,
        canWithdraw:params.canWithdraw,
        canRecharge:params.canRecharge,
        canTransfer:params.canTransfer,
        canAutoWithdraw:params.canAutoWithdraw,
      })
      : await tenantCurrencyCoinList({
        pageNo: current,
        pageSize: pageSize,
        keyword:params.keyword,
        coinName:params.coinName,
        status:params.status,
        recharge:params.recharge,
        symbol:params.symbol,
        networkType:params.networkType,
        canWithdraw:params.canWithdraw,
        canRecharge:params.canRecharge,
        canTransfer:params.canTransfer,
        canAutoWithdraw:params.canAutoWithdraw,
      });
    if (res.code === '0') {
      return {
        data: res.data.list,
        success: true,
        total: res.data.count,
      };
    } else {
      message.error(res.message);
      return {
        data: [],
        success: false,
        total: 0,
      };
    }
  };

  // 获取拓展信息
  const fetchExtendInfo = async (coinId: string | number) => {
    try {
      setExpandLoading((prev) => ({ ...prev, [coinId]: true }));

      // 这里替换为实际的API调用
      const res = await adminCurrencyCoinExtList({
        coinId: coinId,
        pageNo: 1,
        pageSize: 10,
      });

      if (res.code === '0') {
        setExpandedData(res.data.list );
      } else {
        message.error(res.message || '获取拓展信息失败');
      }
    } catch (error) {
      console.error('获取拓展信息失败:', error);
      message.error('获取拓展信息失败');
    } finally {
      setExpandLoading((prev) => ({ ...prev, [coinId]: false }));
    }
  };

  // 处理添加拓展信息
  const handleAddExtendInfo = (record: CurrencyItem) => {
    setCurrentCurrency(record);
    setExtendInfoMode('add');
    setExtendInfoVisible(true);
  };

  // 处理编辑拓展信息按钮点击
  const handleEditExtendInfo = (record: CurrencyItem, extInfo: any) => {
    // 设置当前选中的币种
    setCurrentCurrency(record);
    setExtInfo(extInfo);

    // 使用扩展信息填充表单的初始值
    const initialValues = {
      id: record.id,
      coinId: record.coinId,
      protocolId: record.protocolId,
      mainAddress: record.mainAddress,
      token: record.token,
      decimals: record.decimals,
      status: record.status,
      withdrawFee: record.withdrawFee,
      minWithdrawFee: record.minWithdrawFee,
      confirms: record.confirms,
    };

    // 设置当前表单初始值，模式为编辑，并显示表单
    setCurrentCurrency({ ...record, ...initialValues });
    setExtendInfoMode('edit');
    setExtendInfoVisible(true);
  };

  // 处理扩展信息的开关切换
  const handleExtSwtich = async (record: any, type: string) => {
    let data = {
      id: record.id,
      coinId: record.coinId,
    };

    if (type === 'status') {
      data['status'] = record.status === 1 ? 0 : 1;
    } else if (type === 'recharge') {
      data['recharge'] = record.recharge === 1 ? 0 : 1;
    } else if (type === 'autoWithdraw') {
      data['autoWithdraw'] = record.autoWithdraw === 1 ? 0 : 1;
    }

    const tip: Record<string, string> = {
      status: intl.formatMessage({ 
        id: record.status === 1 ? 'currency.tip.status.disable' : 'currency.tip.status.enable' 
      }),
      recharge: intl.formatMessage({ 
        id: record.recharge === 1 ? 'currency.tip.recharge.off' : 'currency.tip.recharge.on' 
      }),
      autoWithdraw: intl.formatMessage({ 
        id: record.autoWithdraw === 1 ? 'currency.tip.autoWithdraw.off' : 'currency.tip.autoWithdraw.on' 
      }),
    };

    let res;
    if (isAdmin) {
      res = await adminUpdateCurrencyCoinExtById(data);
    } else {
      res = await updateTenantCurrencyCoinExtById(data);
    }

    if (res.code === '0' && res.data) {
      message.success(intl.formatMessage({ id: 'currency.message.success' }, { action: tip[type] }));
      // 更新扩展数据
      fetchExtendInfo(record.coinId);
    } else {
      message.error(intl.formatMessage({ id: 'currency.message.error' }, { action: tip[type] }));
    }
  };

  // 渲染展开行
  const renderExpandedRow = (record: CurrencyItem) => {
    const extInfo = expandedData
    const { Text } = Typography;

    if (expandLoading[record.coinId]) {
      return <Spin tip={intl.formatMessage({ id: 'currency.loading' })} />;
    }

    if (!extInfo) {
      return (
        <div style={{ padding: 16 }}>
          <Space>
            <span>--</span>
          </Space>
        </div>
      );
    }

    const columns = [
      { title: intl.formatMessage({ id: 'currency.column.protocolId' }), dataIndex: 'protocolId', key: 'protocolId' },
      { 
        title: intl.formatMessage({ id: 'currency.column.mainAddress' }), 
        dataIndex: 'mainAddress', 
        key: 'mainAddress',
        width: 120,
        ellipsis: true,
        render: (dom: any, entity: any) => {
          const text = entity.mainAddress;
          return text ? (
            <Typography.Text 
              style={{ width: 120 }} 
              ellipsis={{ tooltip: text }}
            >
              {text}
            </Typography.Text>
          ) : '-';
        }
      },
      { 
        title: intl.formatMessage({ id: 'currency.column.contractAddress' }), 
        dataIndex: 'token', 
        key: 'token',
        width: 120,
        ellipsis: true,
        render: (dom: any, entity: any) => {
          const text = entity.token;
          return text ? (
            <Typography.Text 
              style={{ width: 120 }} 
              ellipsis={{ tooltip: text }}
            >
              {text}
            </Typography.Text>
          ) : '-';
        }
      },
      { title: intl.formatMessage({ id: 'currency.column.decimals' }), dataIndex: 'decimals', key: 'decimals' },
      { 
        title: intl.formatMessage({ id: 'currency.column.status' }), 
        dataIndex: 'status', 
        key: 'status',
        render: (dom: any, extRecord: any) => (
          <Switch
            checked={extRecord.status === 1}
            onChange={(checked) => {
              Modal.confirm({
                title: intl.formatMessage(
                  { id: 'currency.modal.confirm.status' },
                  { action: intl.formatMessage({ id: checked ? 'currency.switch.on' : 'currency.switch.off' }) }
                ),
                onOk: () => {
                  handleExtSwtich(extRecord, 'status');
                },
              });
            }}
          />
        )
      },
      { title: intl.formatMessage({ id: 'currency.column.withdrawFee' }), dataIndex: 'withdrawFee', key: 'withdrawFee' },
      { title: intl.formatMessage({ id: 'currency.column.minWithdrawFee' }), dataIndex: 'minWithdrawFee', key: 'minWithdrawFee' },
      { 
        title: intl.formatMessage({ id: 'currency.column.recharge' }), 
        dataIndex: 'recharge', 
        key: 'recharge',
        render: (dom: any, extRecord: any) => (
          <Switch
            checked={extRecord.recharge === 1}
            onChange={(checked) => {
              Modal.confirm({
                title: intl.formatMessage(
                  { id: 'currency.modal.confirm.recharge' },
                  { action: intl.formatMessage({ id: checked ? 'currency.switch.on' : 'currency.switch.off' }) }
                ),
                onOk: () => {
                  handleExtSwtich(extRecord, 'recharge');
                },
              });
            }}
          />
        )
      },
      { 
        title: intl.formatMessage({ id: 'currency.column.autoWithdraw' }), 
        dataIndex: 'autoWithdraw', 
        key: 'autoWithdraw',
        render: (dom: any, extRecord: any) => (
          <Switch
            checked={extRecord.autoWithdraw === 1}
            onChange={(checked) => {
              Modal.confirm({
                title: intl.formatMessage(
                  { id: 'currency.modal.confirm.autoWithdraw' },
                  { action: intl.formatMessage({ id: checked ? 'currency.switch.on' : 'currency.switch.off' }) }
                ),
                onOk: () => {
                  handleExtSwtich(extRecord, 'autoWithdraw');
                },
              });
            }}
          />
        )
      },
      { title: intl.formatMessage({ id: 'currency.column.minWithdraw' }), dataIndex: 'minWithdraw', key: 'minWithdraw' },
      { title: intl.formatMessage({ id: 'currency.column.maxWithdraw' }), dataIndex: 'maxWithdraw', key: 'maxWithdraw' },
      { title: intl.formatMessage({ id: 'currency.column.minRecharge' }), dataIndex: 'minRecharge', key: 'minRecharge' },
      { title: intl.formatMessage({ id: 'currency.column.confirms' }), dataIndex: 'confirms', key: 'confirms' },
      {
        title: intl.formatMessage({ id: 'currency.column.action' }),
        dataIndex:'action',
        key:'action',
        render:(dom: any, record: any)=>(
          <Button type='link' onClick={()=>handleEditExtendInfo(record,extInfo)}>
            {intl.formatMessage({ id: 'currency.action.edit' })}
          </Button>
        )
      }
    ];

    return (
      <div style={{ position: 'relative', padding: '0 16px' }}>
        <ProTable
          headerTitle={intl.formatMessage({ id: 'currency.table.extendInfo' })}
          columns={columns}
          dataSource={extInfo}
          search={false}
          options={false}
          pagination={false}
          rowKey="id"
          // toolBarRender={() => [
          //   <Button
          //     type="primary"
          //     icon={<EditOutlined />}
          //     onClick={() => handleEditExtendInfo(record, extInfo)}
          //   >
          //     编辑
          //   </Button>
          // ]}
        />
      </div>
    );
  };

  // 处理行展开事件
  const handleExpand = (expanded: boolean, record: CurrencyItem) => {
    console.log(record);
    if (expanded) {
      // 展开行时加载数据
      fetchExtendInfo(record.coinId);
      setExpandedRowKeys([record.coinId]);
    } else {
      setExpandedRowKeys([]);
    }
  };

  const handleSwtich=async(record:CurrencyItem,type:string)=>{
    let data
      if(type==='canRecharge'){
        data={
          id:record.id,
          coinId:record.coinId,
          canRecharge:record.canRecharge===1?0:1
        }
      }else if(type==='canWithdraw'){
        data={
          id:record.id,
          coinId:record.coinId,
          canWithdraw:record.canWithdraw===1?0:1
        }
      }else if(type==='canTransfer'){
        data={
          id:record.id,
          coinId:record.coinId,
          canTransfer:record.canTransfer===1?0:1
        }
      }else if(type==='canAutoWithdraw'){
        data={
          id:record.id,
          coinId:record.coinId,
          canAutoWithdraw:record.canAutoWithdraw===1?0:1
        }
      }
      const tip: Record<string, string> = {
        canRecharge: intl.formatMessage({ 
          id: record.canRecharge === 1 ? 'currency.tip.canRecharge.off' : 'currency.tip.canRecharge.on' 
        }),
        canWithdraw: intl.formatMessage({ 
          id: record.canWithdraw === 1 ? 'currency.tip.canWithdraw.off' : 'currency.tip.canWithdraw.on' 
        }),
        canTransfer: intl.formatMessage({ 
          id: record.canTransfer === 1 ? 'currency.tip.canTransfer.off' : 'currency.tip.canTransfer.on' 
        }),
        canAutoWithdraw: intl.formatMessage({ 
          id: record.canAutoWithdraw === 1 ? 'currency.tip.canAutoWithdraw.off' : 'currency.tip.canAutoWithdraw.on' 
        }),
      }
    let res=await adminUpdateCurrencyCoinById(data);
    if(res.code==='0'&&res.data){
      message.success(intl.formatMessage({ id: 'currency.message.success' }, { action: tip[type] }));
      actionRef.current?.reload();
    }else{
      message.error(intl.formatMessage({ id: 'currency.message.error' }, { action: tip[type] }));
    }
  }

  // 表格列定义
  const columns: ProColumns<CurrencyItem>[] = [
    {
      title: intl.formatMessage({ id: 'currency.column.sort' }),
      dataIndex: 'sort',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'currency.column.coinName' }),
      dataIndex: 'coinName',
      valueType: 'text',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'currency.column.networkType' }),
      dataIndex: 'mianChain',
      search: false,
      renderText: (text: string) => {
        return text === '1' ? intl.formatMessage({ id: 'currency.mainChain' }) : intl.formatMessage({ id: 'currency.token' });
      },
    },
    {
      title: intl.formatMessage({ id: 'currency.column.status' }),
      dataIndex: 'status',
      valueEnum:{
        1: intl.formatMessage({ id: 'currency.status.normal' }),
        0: intl.formatMessage({ id: 'currency.status.disabled' })
      },
      renderText: (text: number) => {
        return text === 1 ? intl.formatMessage({ id: 'currency.status.normal' }) : intl.formatMessage({ id: 'currency.status.disabled' });
      },
    },
    {
      title: intl.formatMessage({ id: 'currency.column.recharge' }),
      dataIndex: 'canRecharge',
      valueEnum:{
        0: intl.formatMessage({ id: 'currency.switch.off' }),
        1: intl.formatMessage({ id: 'currency.switch.on' })
      },
      render: (_, record) => (
        <Switch
          checked={record.canRecharge === 1}
          onChange={(checked) => {
            Modal.confirm({
              title: intl.formatMessage(
                { id: 'currency.modal.confirm.canRecharge' },
                { action: intl.formatMessage({ id: checked ? 'currency.switch.on' : 'currency.switch.off' }) }
              ),
              onOk: () => {
                handleSwtich(record,'canRecharge');
              },
            });
          }}
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'currency.column.withdraw' }),
      dataIndex: 'canWithdraw',
      valueEnum:{
        0: intl.formatMessage({ id: 'currency.switch.off' }),
        1: intl.formatMessage({ id: 'currency.switch.on' })
      },
      render: (_, record) => (
        <Switch
          checked={record.canWithdraw === 1}
          onChange={(checked) => {
            Modal.confirm({
              title: intl.formatMessage(
                { id: 'currency.modal.confirm.canWithdraw' },
                { action: intl.formatMessage({ id: checked ? 'currency.switch.on' : 'currency.switch.off' }) }
              ),
              onOk: () => {
                handleSwtich(record,'canWithdraw');
              },
            });
          }}
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'currency.column.transfer' }),
      dataIndex: 'canTransfer',
      valueEnum:{
        0: intl.formatMessage({ id: 'currency.switch.off' }),
        1: intl.formatMessage({ id: 'currency.switch.on' })
      },
      render: (_, record) => (
        <Switch
          checked={record.canTransfer === 1}
          onChange={(checked) => {
            Modal.confirm({
              title: intl.formatMessage(
                { id: 'currency.modal.confirm.canTransfer' },
                { action: intl.formatMessage({ id: checked ? 'currency.switch.on' : 'currency.switch.off' }) }
              ),
              onOk: () => {
                handleSwtich(record,'canTransfer');
              },
            });
          }}
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'currency.column.autoWithdraw' }),
      dataIndex: 'canAutoWithdraw',
      valueEnum:{
        0: intl.formatMessage({ id: 'currency.switch.off' }),
        1: intl.formatMessage({ id: 'currency.switch.on' })
      },
      render: (_, record) => (
        <Switch
          checked={record.canAutoWithdraw === 1}
          onChange={(checked) => {
            Modal.confirm({
              title: intl.formatMessage(
                { id: 'currency.modal.confirm.canAutoWithdraw' },
                { action: intl.formatMessage({ id: checked ? 'currency.switch.on' : 'currency.switch.off' }) }
              ),
              onOk: () => {
                handleSwtich(record,'canAutoWithdraw');
              },
            });
          }}
        />
      ),
    },
    {
      title: intl.formatMessage({ id: 'currency.column.createTime' }),
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'currency.column.action' }),
      valueType: 'option',
      search: false,
      render: (_, record) =>
        isAdmin
          ? [
            <Button key="edit" onClick={() => handleEdit(record)}>
              {intl.formatMessage({ id: 'currency.action.edit' })}
            </Button>,
            <Button key="extendInfo" onClick={() => handleExtendInfo(record)}>
              {intl.formatMessage({ id: 'currency.action.addExtendInfo' })}
            </Button>,
          ]
          : [
            <Button key="edit" onClick={() => handleEdit(record)}>
              {intl.formatMessage({ id: 'currency.action.edit' })}
            </Button>,
            <Button key="detail" onClick={() => handleDetail(record)}>
              {intl.formatMessage({ id: 'currency.action.currencyIntro' })}
            </Button>,
            <Button key="extendInfo" onClick={() => handleExtendInfo(record)}>
              {intl.formatMessage({ id: 'currency.action.addSameChain' })}
            </Button>,
          ],
    },
  ];

  // 处理函数
  const handleAdd = () => {
    setFormMode('add');
    setCurrentCurrency(null);
    setFormVisible(true);
  };

  const handleEdit = (record: CurrencyItem) => {
    setFormMode('edit');
    setCurrentCurrency(record);
    setFormVisible(true);
  };

  const handlePublish = (record: CurrencyItem) => {
    message.success(intl.formatMessage({ id: 'currency.message.publishOnline' }, { name: record.name }));
    // 实现发布上线逻辑
  };

  const handleAddSameChain = (record: CurrencyItem) => {
    message.success(intl.formatMessage({ id: 'currency.message.addSameChain' }, { name: record.name }));
    // 实现添加同币异链逻辑
  };

  const handleDetail = async (record: CurrencyItem) => {

      

        setCurrentIntroData(record);
        setIntroFormVisible(true);




  };

  const handleExtendInfo = (record: CurrencyItem) => {
    setCurrentCurrency(record);
    setExtendInfoVisible(true);
  };

  const handleExtendInfoSubmit = async (values: ExtendInfoFormData) => {
    console.log(
      intl.formatMessage({ id: 'currency.log.extendInfoFormSubmit' }), 
      values, 
      intl.formatMessage({ id: 'currency.log.extendInfoMode' }), 
      extendInfoMode
    );

    let res;
    if (extendInfoMode === 'add') {
      if (isAdmin) {
        res = await adminSaveCurrencyCoinExt(values);
      }else{
        res = await saveTenantCurrencyCoinExt(values);
      }

      if (res && res.code === '0') {
        message.success(intl.formatMessage({ 
          id: extendInfoMode === 'add' ? 'currency.message.addExtendInfoSuccess' : 'currency.message.updateExtendInfoSuccess' 
        }));

        // 更新已展开行的数据
        if (expandedRowKeys.length > 0) {
          const coinId = expandedRowKeys[0];
          fetchExtendInfo(coinId);
        }
      } else if (res) {
        message.error(res.message);
      }

      setExtendInfoVisible(false);
    } else {
      if (isAdmin) {
        values.id = extInfo?.id;
        res = await adminUpdateCurrencyCoinExtById(values);
      }else{
        values.id = extInfo?.id;
        res = await updateTenantCurrencyCoinExtById(values);
      }
      
      if (res && res.code === '0') {
        message.success(intl.formatMessage({ 
          id: extendInfoMode === 'add' ? 'currency.message.addExtendInfoSuccess' : 'currency.message.updateExtendInfoSuccess' 
        }));

        // 更新已展开行的数据
        if (expandedRowKeys.length > 0) {
          const coinId = expandedRowKeys[0];
          fetchExtendInfo(coinId);
        }
        setExtendInfoVisible(false);
      }
    }
  };

  const handleExtendInfoCancel = () => {
    setExtendInfoVisible(false);
  };

  const handleBatchDelete = () => {
    if (selectedRows.length === 0) {
      message.warning(intl.formatMessage({ id: 'currency.message.warning.selectDelete' }));
      return;
    }
    message.success(intl.formatMessage({ id: 'currency.message.batchDelete' }, { count: selectedRows.length }));
    // 这里实现批量删除逻辑
  };

  const handleFormSubmit = async (values: CurrencyFormData) => {
    console.log(intl.formatMessage({ id: 'currency.log.formSubmit' }), values);
    if (formMode === 'add') {
      let res;
      if (isAdmin) {
        res = await adminSaveCurrencyCoin(values);
      } else {
        res = await saveTenantCurrencyCoin(values);
      }
      if (res.code === '0'&&res.data) {
        message.success(intl.formatMessage({ id: 'currency.message.addSuccess' }));
        setFormVisible(false);
        actionRef.current?.reload();
      } else {
        message.error(res.message);
      }
    } else {
      let res;

        console.log(currentCurrency);
        let data={
          id:currentCurrency?.id,
          coinId:currentCurrency?.coinId,
          ...values
        }
        res = await adminUpdateCurrencyCoinById(data);

      if (res.code === '0'&&res.data) {
        message.success(intl.formatMessage({ id: 'currency.message.editSuccess' }, { name: values.coinName }));
      } else {
        message.error(intl.formatMessage({ id: 'currency.message.editError' }));
      
      }
      setFormVisible(false);
    }

    // 重新加载数据
    actionRef.current?.reload();
  };

  const handleFormCancel = () => {
    console.log('取消');
    setFormVisible(false);
  };

  // 处理币种简介表单提交
  const handleIntroFormSubmit = async (values: CurrencyIntroFormData) => {
    try {
      // 这里应该是保存币种简介的API调用
      // 示例代码，需要替换为实际API
      const res = await saveCurrencyIntro(values);
      
      if (res.code === '0') {
        message.success(intl.formatMessage({ id: 'currency.message.introSaveSuccess' }));
        setIntroFormVisible(false);
      } else {
        message.error(res.message || intl.formatMessage({ id: 'currency.message.introSaveError' }));
      }
    } catch (error) {
      console.error(intl.formatMessage({ id: 'currency.message.introSaveError' }), error);
      message.error(intl.formatMessage({ id: 'currency.message.introSaveError' }));
    }
  };

  // 处理币种简介表单取消
  const handleIntroFormCancel = () => {
    setIntroFormVisible(false);
  };

  return (
    <PageContainer>
      {!formVisible ? (
        <ProTable
          headerTitle={intl.formatMessage({ id: 'currency.table.title' })}
          actionRef={actionRef}
          rowKey="coinId"
          request={fetchData}
          columns={columns}
          toolBarRender={() => [
            <Button type="primary" onClick={handleAdd}>
              {intl.formatMessage({ id: 'currency.action.add' })}
            </Button>,
          ]}
          rowSelection={{
            onChange: (_, selectedRows) => {
              setSelectedRows(selectedRows);
            },
          }}
          expandable={{
            expandedRowRender: renderExpandedRow,
            expandedRowKeys,
            onExpand: handleExpand,
          }}
          pagination={{
            pageSize: 10,
          }}
        />
      ) : (
        <CurrencyForm
          initialValues={currentCurrency}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      <ExtendInfoForm
        visible={extendInfoVisible}
        initialValues={currentCurrency}
        onSubmit={handleExtendInfoSubmit}
        onCancel={handleExtendInfoCancel}
        mode={extendInfoMode}
      />

      <CurrencyIntroForm
        visible={introFormVisible}
        initialValues={currentIntroData || undefined}
        onSubmit={handleIntroFormSubmit}
        onCancel={handleIntroFormCancel}
      />
    </PageContainer>
  );
};

export default CurrencyManagement;
