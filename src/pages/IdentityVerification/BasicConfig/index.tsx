import React from 'react';
import { Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { 
  getUserLevelBenefitList
} from '@/services/ant-design-pro/IdentityVerification';
import EditModal from './components/EditModal';

interface UserLevelItem {
  key: string;
  level: string;
  requirements: React.ReactNode;
  permissions: React.ReactNode;
  updateTime: string;
  operator: string;
  action: React.ReactNode;
}

const UserLevel: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [dataSource, setDataSource] = React.useState<UserLevelItem[]>([]);
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);
  const [editingRecord, setEditingRecord] = React.useState<any>(null);

  const fetchUserLevelList = async (params: {
    current?: number;
    pageSize?: number;
  }) => {
    try {
      setLoading(true);
      const { current = 1, pageSize = 10 } = params;
      const response = await getUserLevelBenefitList({
        page: current,
        pageSize,
      });
      
      if (response.code === '0' && response.data) {
        setDataSource(response.data || []);
        setPagination({
          ...pagination,
          current,
          pageSize,
          total: response.data.total || 0,
        });
      }
    } catch (error) {
      console.error('获取用户等级列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUserLevelList({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  }, []);

  const handleTableChange = (page: any) => {
    fetchUserLevelList({
      current: page.current,
      pageSize: page.pageSize,
    });
  };

  const showEditModal = (record: any) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSave = async (values: any) => {
    try {
      // 这里添加保存逻辑，发送请求到后端
      // 示例：await updateUserLevel({...values});
      console.log('保存的值:', values);
      
      // 关闭模态框
      setIsModalVisible(false);
      
      // 刷新表格数据
      fetchUserLevelList({
        current: pagination.current,
        pageSize: pagination.pageSize,
      });
    } catch (error) {
      console.error('更新失败:', error);
    }
  };

  const columns = [
    {
      title: '等级',
      dataIndex: 'levelName',
      key: 'levelName',
      search: false,
    },
    {
      title: '要求',
      dataIndex: 'demand',
      key: 'demand',
      search: false,
    },
    {
      title: '权益',
      dataIndex: 'benefitResps',
      key: 'benefitResps',
      search: false,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      search: false,
    },
    {
      title: '操作管理员',
      dataIndex: 'tenantId',
      key: 'tenantId',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<EditOutlined />} 
          onClick={() => showEditModal(record)}
        >
          编辑
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable 
        dataSource={dataSource} 
        columns={columns} 
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        loading={loading}
        onChange={handleTableChange}
      />
      
      <EditModal
        visible={isModalVisible}
        record={editingRecord}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    </PageContainer>
  );
};

export default UserLevel;