import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Input, Button, Table, Space, Select, message, Tooltip } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
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
  const [keyValue, setKeyValue] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('全部');
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // 获取KV配置列表
  const fetchKvList = async (page = current, size = pageSize) => {
    setLoading(true);
    try {
      const params = {
        pageNo: page,
        pageSize: size,
        keyValue,        // 添加搜索条件
        title,
        category: category === '全部' ? undefined : category
      };
      const response = isAdmin 
        ? await getKvList(params)
        : await getTenantKvList(params);

      if (response.code === '0') {
        setDataSource(response.data.list);
        setTotal(response.data.count); // 设置总数
      }
    } catch (error) {
      console.error('获取KV配置列表失败:', error);
      message.error('获取KV配置列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKvList();
  }, []);

  // 处理查询
  const handleSearch = () => {
    fetchKvList();
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
        fetchKvList(); // 刷新列表
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

  // 处理页码变化
  const handleTableChange = (pagination: any) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
    fetchKvList(pagination.current, pagination.pageSize);
  };

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
    },
    ...(isAdmin ? [{
      title: '是否显示',
      dataIndex: 'show',
      key: 'show',
      render: (show: number) => (show === 1 ? '是' : '否'),
    }] : []),
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: number) => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
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
      <div style={{ marginBottom: 16 }}>
        <Space size="large">
          <Space>
            <span>Key</span>
            <Input
              placeholder="Key"
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value)}
              style={{ width: 250 }}
            />
          </Space>
          <Space>
            <span>标题</span>
            <Input
              placeholder="标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: 250 }}
            />
          </Space>
          <Space>
            <span>类别</span>
            <Select
              value={category}
              onChange={(value) => setCategory(value)}
              style={{ width: 250 }}
            >
              <Option value="全部">全部</Option>
              <Option value="法币交易">法币交易</Option>
              <Option value="币币交易">币币交易</Option>
              <Option value="系统配置">系统配置</Option>
            </Select>
          </Space>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            查询
          </Button>
          
          {isAdmin && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增
            </Button>
          )}
        </Space>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={{
          current,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
          pageSizeOptions: ['10', '20', '50', '100']
        }}
        onChange={handleTableChange}
        bordered
      />
      
      <AddModal
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onSuccess={fetchKvList}
      />
      
      {currentRecord && (
        <EditModal
          visible={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          onSuccess={fetchKvList}
          record={currentRecord}
        />
      )}
    </PageContainer>
  );
};

export default KvSetting;
