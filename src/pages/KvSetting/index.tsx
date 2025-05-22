import React, { useState, useRef } from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Space, Select, message } from 'antd';
import { useIntl } from 'umi';
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
  const intl = useIntl();

  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
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
      console.error(intl.formatMessage({ id: 'kv.message.fetchListError' }), error);
      message.error(intl.formatMessage({ id: 'kv.message.fetchListError' }));
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
        message.success(record.status === 1 
          ? intl.formatMessage({ id: 'kv.message.operationSuccess' }, { action: intl.formatMessage({ id: 'kv.table.action.offline' }) })
          : intl.formatMessage({ id: 'kv.message.operationSuccess' }, { action: intl.formatMessage({ id: 'kv.table.action.publish' }) }));
        reload();
      } else {
        message.error(`操作失败: ${response.message}`);
      }
    } catch (error) {
      console.error('操作失败:', error);
message.error(intl.formatMessage({ id: 'kv.message.operationFailed' }));
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
      title: intl.formatMessage({ id: 'kv.table.id' }),
      dataIndex: 'id',
      key: 'id',
      search:false,
    },
    ...(!isAdmin ? [] : [{
      title: intl.formatMessage({ id: 'kv.table.tenantId' }),
      dataIndex: 'tenantId',
      key: 'tenantId',
      search:false, 
    }]),
    {
      title: intl.formatMessage({ id: 'kv.table.type' }),
      dataIndex: 'type',
      key: 'type',
      valueType: 'select',
      valueEnum: {
        'basic_functions': intl.formatMessage({ id: 'kv.table.type.basic_functions' }),
        'coin_exchange': intl.formatMessage({ id: 'kv.table.type.coin_exchange' }),
        'system_configuration': intl.formatMessage({ id: 'kv.table.type.system_configuration' }),
      }
    },
    {
      title: intl.formatMessage({ id: 'kv.table.keyProperty' }),
      dataIndex: 'keyProperty',
      key: 'keyProperty',
    },
    {
      title: intl.formatMessage({ id: 'kv.table.keyValue' }),
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
                {isExpanded 
                  ? intl.formatMessage({ id: 'kv.table.collapse' }) 
                  : intl.formatMessage({ id: 'kv.table.expand' })}
              </a>
            )}
          </div>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'kv.table.theme' }),
      dataIndex: 'theme',
      key: 'theme',
    },
    {
      title: intl.formatMessage({ id: 'kv.table.describe' }),
      dataIndex: 'describe',
      key: 'describe',
      search:false,
    },
    ...(isAdmin ? [{
      title: intl.formatMessage({ id: 'kv.table.show' }),
      dataIndex: 'show',
      key: 'show',
      search: false,
      render: (show: number) => (show === 1 
        ? intl.formatMessage({ id: 'kv.table.show.yes' }) 
        : intl.formatMessage({ id: 'kv.table.show.no' })),
    }] : []),
    {
      title: intl.formatMessage({ id: 'kv.table.createTime' }),
      dataIndex: 'createTime',
      key: 'createTime',
      search:false,
      render: (time: number) => new Date(time).toLocaleString(),
    },
    {
      title: intl.formatMessage({ id: 'kv.table.action' }),
      key: 'action',
      width: 180,
      search:false,
      render: (_: any, record: any) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>
            {intl.formatMessage({ id: 'kv.table.action.edit' })}
          </a>
          {isAdmin && (
            <a onClick={() => handlePublish(record)}>
              {record.status === 0 
                ? intl.formatMessage({ id: 'kv.table.action.publish' }) 
                : intl.formatMessage({ id: 'kv.table.action.offline' })}
            </a>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title={intl.formatMessage({ id: 'kv.title' })}>
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
