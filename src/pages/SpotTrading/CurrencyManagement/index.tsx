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
import { EditOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Descriptions, message, Modal, Space, Spin, Switch, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import CurrencyForm from './components/CurrencyForm';
import ExtendInfoForm, { ExtendInfoFormData } from './components/ExtendInfoForm';
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
        setExpandedData((prev) => ({ ...prev, [coinId]: res.data.list[0] }));
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
      id: extInfo.id,
      coinId: record.coinId,
      protocolId: extInfo.protocolId,
      mainAddress: extInfo.mainAddress,
      token: extInfo.token,
      decimals: extInfo.decimals,
      status: extInfo.status,
      withdrawFee: extInfo.withdrawFee,
      minWithdrawFee: extInfo.minWithdrawFee,
      confirms: extInfo.confirms,
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

    const tip = {
      status: '状态' + (record.status === 1 ? '禁用' : '启用'),
      recharge: '充值开关' + (record.recharge === 1 ? '关闭' : '开启'),
      autoWithdraw: '自动提现开关' + (record.autoWithdraw === 1 ? '关闭' : '开启'),
    };

    let res;
    if (isAdmin) {
      res = await adminUpdateCurrencyCoinExtById(data);
    } else {
      res = await updateTenantCurrencyCoinExtById(data);
    }

    if (res.code === '0' && res.data) {
      message.success(`${tip[type]}成功`);
      // 更新扩展数据
      fetchExtendInfo(record.coinId);
    } else {
      message.error(`${tip[type]}失败`);
    }
  };

  // 渲染展开行
  const renderExpandedRow = (record: CurrencyItem) => {
    const extInfo = expandedData[record.coinId];
    const { Text } = Typography;

    if (expandLoading[record.coinId]) {
      return <Spin tip="加载中..." />;
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
      { title: '协议ID', dataIndex: 'protocolId', key: 'protocolId' },
      { 
        title: '主地址', 
        dataIndex: 'mainAddress', 
        key: 'mainAddress',
        width: 120,
        ellipsis: true,
        render: (text: string) => (
          text ? (
            <Typography.Text 
              style={{ width: 120 }} 
              ellipsis={{ tooltip: text }}
            >
              {text}
            </Typography.Text>
          ) : '-'
        )
      },
      { 
        title: '合约地址', 
        dataIndex: 'token', 
        key: 'token',
        width: 120,
        ellipsis: true,
        render: (text: string) => (
          text ? (
            <Typography.Text 
              style={{ width: 120 }} 
              ellipsis={{ tooltip: text }}
            >
              {text}
            </Typography.Text>
          ) : '-'
        )
      },
      { title: '小数位数', dataIndex: 'decimals', key: 'decimals' },
      { 
        title: '状态', 
        dataIndex: 'status', 
        key: 'status',
        render: (text: number, extRecord: any) => (
          <Switch
            checked={extRecord.status === 1}
            onChange={(checked) => {
              Modal.confirm({
                title: `确定要${checked ? '启用' : '禁用'}该币种吗？`,
                onOk: () => {
                  handleExtSwtich(extRecord, 'status');
                },
              });
            }}
          />
        )
      },
      { title: '提现手续费', dataIndex: 'withdrawFee', key: 'withdrawFee' },
      { title: '最小提现手续费', dataIndex: 'minWithdrawFee', key: 'minWithdrawFee' },
      { 
        title: '充值开关', 
        dataIndex: 'recharge', 
        key: 'recharge',
        render: (text: number, extRecord: any) => (
          <Switch
            checked={extRecord.recharge === 1}
            onChange={(checked) => {
              Modal.confirm({
                title: `确定要${checked ? '开启' : '关闭'}充值开关吗？`,
                onOk: () => {
                  handleExtSwtich(extRecord, 'recharge');
                },
              });
            }}
          />
        )
      },
      { 
        title: '自动提现开关', 
        dataIndex: 'autoWithdraw', 
        key: 'autoWithdraw',
        render: (text: number, extRecord: any) => (
          <Switch
            checked={extRecord.autoWithdraw === 1}
            onChange={(checked) => {
              Modal.confirm({
                title: `确定要${checked ? '开启' : '关闭'}自动提现开关吗？`,
                onOk: () => {
                  handleExtSwtich(extRecord, 'autoWithdraw');
                },
              });
            }}
          />
        )
      },
      { title: '最小提现量', dataIndex: 'minWithdraw', key: 'minWithdraw' },
      { title: '最大提现量', dataIndex: 'maxWithdraw', key: 'maxWithdraw' },
      { title: '最小充值量', dataIndex: 'minRecharge', key: 'minRecharge' },
      { title: '确认数', dataIndex: 'confirms', key: 'confirms' },
    ];

    return (
      <div style={{ position: 'relative', padding: '0 16px' }}>
        <ProTable
          headerTitle="币种拓展信息"
          columns={columns}
          dataSource={[extInfo]}
          search={false}
          options={false}
          pagination={false}
          rowKey="id"
          toolBarRender={() => [
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEditExtendInfo(record, extInfo)}
            >
              编辑
            </Button>
          ]}
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
      const tip={
        canRecharge:'充值'+(record.canRecharge===1?'关闭':'开启'),
        canWithdraw:'提现'+(record.canWithdraw===1?'关闭':'开启'),
        canTransfer:'转账'+(record.canTransfer===1?'关闭':'开启'),
        canAutoWithdraw:'自动提币'+(record.canAutoWithdraw===1?'关闭':'开启'),
      }
    let res=await adminUpdateCurrencyCoinById(data);
    if(res.code==='0'&&res.data){
      message.success(`${tip[type]}成功`);
      actionRef.current?.reload();
    }else{
      message.error(`${tip[type]}失败`);
    }
  }

  // 表格列定义
  const columns: ProColumns<CurrencyItem>[] = [
    {
      title: '排序',
      dataIndex: 'sort',
      search: false,
    },
    {
      title: '币种简称',
      dataIndex: 'coinName',
      valueType: 'text',
      search: false,
    },
    {
      title: '网络类型',
      dataIndex: 'mianChain',
      search: false,
      renderText: (text: string) => {
        return text === '1' ? '主链' : 'token';
      },
    },
    {
      title: '币种状态',
      dataIndex: 'status',
      valueEnum:{
        1:'正常',
        0:'禁用'
      },
      renderText: (text: number) => {
        return text === 1 ? '正常' : '禁用';
      },
    },
    {
      title: '充值',
      dataIndex: 'canRecharge',
      valueEnum:{
        0:'关闭',
        1:'开启'
      },
      render: (_, record) => (
        <Switch
          checked={record.canRecharge === 1}
          onChange={(checked) => {
            Modal.confirm({
              title: `确定要${checked ? '开启' : '关闭'}充值吗？`,
              onOk: () => {
                handleSwtich(record,'canRecharge');
              },
            });
          }}
        />
      ),
    },
    {
      title: '提现',
      dataIndex: 'canWithdraw',
      valueEnum:{
        0:'关闭',
        1:'开启'
      },
      render: (_, record) => (
        <Switch
          checked={record.canWithdraw === 1}
          onChange={(checked) => {
            Modal.confirm({
              title: `确定要${checked ? '开启' : '关闭'}提现吗？`,
              onOk: () => {
                handleSwtich(record,'canWithdraw');
              },
            });
          }}
        />
      ),
    },
    {
      title: '转账',
      dataIndex: 'canTransfer',
      valueEnum:{
        0:'关闭',
        1:'开启'
      },
      render: (_, record) => (
        <Switch
          checked={record.canTransfer === 1}
          onChange={(checked) => {
            Modal.confirm({
              title: `确定要${checked ? '开启' : '关闭'}转账吗？`,
              onOk: () => {
                handleSwtich(record,'canTransfer');
              },
            });
          }}
        />
      ),
    },
    {
      title: '自动提币',
      dataIndex: 'canAutoWithdraw',
      valueEnum:{
        0:'关闭',
        1:'开启'
      },
      render: (_, record) => (
        <Switch
          checked={record.canAutoWithdraw === 1}
          onChange={(checked) => {
            Modal.confirm({
              title: `确定要${checked ? '开启' : '关闭'}自动提币吗？`,
              onOk: () => {
                handleSwtich(record,'canAutoWithdraw');
              },
            });
          }}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      search: false,
      render: (_, record) =>
        isAdmin
          ? [
            <Button key="edit" onClick={() => handleEdit(record)}>
              编辑
            </Button>,
            <Button key="extendInfo" onClick={() => handleExtendInfo(record)}>
              拓展信息增加
            </Button>,
          ]
          : [
            <Button key="edit" onClick={() => handleEdit(record)}>
              编辑
            </Button>,
            <Button key="detail" onClick={() => handleDetail(record)}>
              币种简介
            </Button>,
            <Button key="extendInfo" onClick={() => handleExtendInfo(record)}>
              添加同币异链
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
    message.success(`发布上线币种: ${record.name}`);
    // 实现发布上线逻辑
  };

  const handleAddSameChain = (record: CurrencyItem) => {
    message.success(`添加同币异链: ${record.name}`);
    // 实现添加同币异链逻辑
  };

  const handleDetail = (record: CurrencyItem) => {
    message.success(`查看币种简介: ${record.name}`);
    // 实现查看币种简介逻辑
  };

  const handleExtendInfo = (record: CurrencyItem) => {
    setCurrentCurrency(record);
    setExtendInfoVisible(true);
  };

  const handleExtendInfoSubmit = async (values: ExtendInfoFormData) => {
    console.log('拓展信息表单提交数据:', values, '模式:', extendInfoMode);

    let res;
    if (extendInfoMode === 'add') {
      if (isAdmin) {
        res = await adminSaveCurrencyCoinExt(values);
      }else{
        res = await saveTenantCurrencyCoinExt(values);
      }

      if (res && res.code === '0') {
        message.success(extendInfoMode === 'add' ? '拓展信息添加成功' : '拓展信息更新成功');

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
        message.success(extendInfoMode === 'add' ? '拓展信息添加成功' : '拓展信息更新成功');

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
      message.warning('请选择要删除的币种');
      return;
    }
    message.success(`批量删除${selectedRows.length}个币种`);
    // 这里实现批量删除逻辑
  };

  const handleFormSubmit = async (values: CurrencyFormData) => {
    console.log('表单提交数据:', values);
    if (formMode === 'add') {
      let res;
      if (isAdmin) {
        res = await adminSaveCurrencyCoin(values);
      } else {
        res = await saveTenantCurrencyCoin(values);
      }
      if (res.code === '0'&&res.data) {
        message.success('添加币种成功');
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
        message.success(`编辑币种成功: ${values.coinName}`);
      } else {
        message.error('编辑币种失败');
      
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

  return (
    <PageContainer>
      {!formVisible ? (
        <ProTable
          headerTitle="币种管理"
          actionRef={actionRef}
          rowKey="coinId"
          request={fetchData}
          columns={columns}
          toolBarRender={() => [
            <Button type="primary" onClick={handleAdd}>
              添加币种
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
    </PageContainer>
  );
};

export default CurrencyManagement;
