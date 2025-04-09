import React, { useState,useRef} from 'react';
import { PageContainer,ProTable } from '@ant-design/pro-components';
import {  Space, Select, message} from 'antd';
import { 
  getKvList, 
  updateKv, 
  getTenantKvList, 
  updateTenantKv, 
  releaseKv,
  cancelKv
} from '@/services/ant-design-pro/kv';
import AddModal from './component/AddModal';
import EditModal from './component/EditModal';

const { Option } = Select;

const KvSetting: React.FC = () => {
  const isAdmin = process.env.UMI_APP_ADMIN_FLAG === '1';
  const [loading, setLoading] = useState<boolean>(false);

  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const actionRef = useRef<ActionType>();

  // 获取KV配置列表
  const fetchKvList = async (params:any) => {
    setLoading(true);
    try {
      const data = {
        pageNo: params.current,
        pageSize: params.pageSize,
        ...params

      };
      const response = isAdmin 
        ? await getKvList(data)
        : await getTenantKvList(data);

      if (response.code === '0') {
        return {
          data: response.data.list,
          success: true,
          total: response.data.count,
        };
      }
    } catch (error) {
      console.error('获取KV配置列表失败:', error);
      message.error('获取KV配置列表失败');
    } finally {
      setLoading(false);
    }
  };



  // 处理修改
  const handleEdit = (record: any) => {
    setCurrentRecord(record);
    setIsEditModalVisible(true);
  };

  // 处理发布上线和下线
  const handlePublish = async (record: any) => {
    try {
      let response;
      if (record.status === 1) {
        // 当前是已上线状态，执行下线操作
        response = await cancelKv({ id: record.id });
      } else {
        // 当前是未上线状态，执行上线操作
        response = await releaseKv({
          id: record.id,
        });
      }

      if (response.code === '0'&&response.data) {
        message.success(`${record.status === 1 ? '下线' : '发布上线'}成功`);
        
      } else {
        message.error(`操作失败: ${response.message}`);
      }
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作失败，请重试');
    }
  };

  // 处理新增按钮点击
  const handleAdd = () => {
    setIsAddModalVisible(true);
  };

  const reload = () => {
    actionRef.current?.reload();
  }


  const toggleExpand = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 表格列定义
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      search:false,
    },
    ...(!isAdmin ? [] : [{
      title: '商户id',
      dataIndex: 'tenantId',
      key: 'tenantId',
      search:false, 
    }]),
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      valueType:'select',
      valueEnum:{
        'basic_functions':'基础功能',
        'coin_exchange':'币币交易',
        'system_configuration':'系统配置',
      }
    },
    {
      title: '唯一Key',
      dataIndex: 'keyProperty',
      key: 'keyProperty',
    },
    {
      title: '配置值',
      dataIndex: 'keyValue',
      key: 'keyValue',
      search:false,
      render: (text: string, record: any) => {
        const isExpanded = expandedRows[record.id];
        return (
          <div>
            <div style={{ 
              maxWidth: isExpanded ? 'none' : 150,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: isExpanded ? 'normal' : 'nowrap'
            }}>
              {text}
            </div>
            {text.length > 20 && (
              <a onClick={() => toggleExpand(record.id)}>
                {isExpanded ? '收起' : '展开'}
              </a>
            )}
          </div>
        );
      },
    },
    {
      title: '标题',
      dataIndex: 'theme',
      key: 'theme',
    },
    {
      title: '描述',
      dataIndex: 'describe',
      key: 'describe',
      search:false,
    },
    ...(isAdmin ? [{
      title: '是否显示',
      dataIndex: 'show',
      key: 'show',
      search:false,
      render: (show: number) => (show === 1 ? '是' : '否'),
    }] : []),
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      search:false,
      render: (time: number) => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      search:false,
      render: (_: any, record: any) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>修改</a>
          {isAdmin && (
            <a onClick={() => handlePublish(record)}>
              {record.status === 0 ? '发布上线' : '下线'}
            </a>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="KV配置">
      <ProTable
        loading={loading}
        columns={columns as any}
        actionRef={actionRef}
        request={fetchKvList}
        rowKey="id"
      />
      
      <AddModal
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onSuccess={reload}
      />
      
      {currentRecord && (
        <EditModal
          visible={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          onSuccess={reload}
          record={currentRecord}
        />
      )}
    </PageContainer>
  );
};

export default KvSetting;
