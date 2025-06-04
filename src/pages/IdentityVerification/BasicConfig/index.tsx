import React,{useEffect}from 'react';
import { Button,message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useIntl } from 'umi';
import { 
  getUserLevelBenefitList,updateLevelBenefitById
} from '@/services/ant-design-pro/IdentityVerification';
import EditModal from './components/EditModal';

interface UserLevelItem {
  levelId: number;
  levelName: string;
  demand: string | null;
  benefitResps: {
    levelBenefitId: number;
    benefitId: number;
    benefitName: string;
    rule: string | null;
    value: string | null;
    params: any | null;
    status:number;
    updateTime: string | null;
  }[];
  updateTime: string | null;
  tenantId: string | null;
}

const UserLevel: React.FC = () => {
  const intl = useIntl();
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
      console.error(intl.formatMessage({ id: 'basicConfig.message.fetchFailed' }), error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      let params = {
        benefitResps:values.benefitResps
      }

     const res = await updateLevelBenefitById(params);
      if(res.code === '0'&&res.data){
        message.success(intl.formatMessage({ id: 'basicConfig.message.updateSuccess' }));
      }else{
        message.error(intl.formatMessage({ id: 'basicConfig.message.updateFailed' }));
      }
      fetchUserLevelList({
        current: pagination.current,
        pageSize: pagination.pageSize,
      });
      // 关闭模态框
      setIsModalVisible(false);
      
    
    } catch (error) {
      console.error(intl.formatMessage({ id: 'basicConfig.message.updateFailed' }), error);
    }
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'basicConfig.column.level' }),
      dataIndex: 'levelValue',
      key: 'levelValue',
      render: (text: string | null) => 
        text === 'L0' ? intl.formatMessage({ id: 'basicConfig.level.unverified' }) : intl.formatMessage({ id: 'basicConfig.level.standard' })
    },
    {
      title: intl.formatMessage({ id: 'basicConfig.column.requirement' }),
      dataIndex: 'demand',
      key: 'demand',
      render: (text: string | null) => text || '-',
    },
    {
      title: intl.formatMessage({ id: 'basicConfig.column.benefits' }),
      dataIndex: 'benefitResps',
      key: 'benefitResps',
      render: (benefitResps: UserLevelItem['benefitResps']) => {
        if (!benefitResps || benefitResps.length === 0) {
          return '-';
        }
        return (
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            {benefitResps.map((item) => (
              <li key={item.levelBenefitId}>
                {intl.formatMessage({id:`basicConfig.column.${item.benefitValue}`})}
                {` ${intl.formatMessage({ id: 'basicConfig.benefit.status' })}: ${item.status===1 ? 
                    intl.formatMessage({ id: 'basicConfig.benefit.allow' }) : 
                    intl.formatMessage({ id: 'basicConfig.benefit.deny' })}`}
                {item.params && (
                  <span style={{ color: '#999', marginLeft: 8 }}>
                    {item.params.amountLimit ? `${intl.formatMessage({ id: 'basicConfig.benefit.limit' })}: ${item.params.amountLimit}` : ''}
                    {item.params.coin ? ` ${intl.formatMessage({ id: 'basicConfig.benefit.coin' })}: ${item.params.coin}` : ''}
                    {item.params.time ? ` ${intl.formatMessage({ id: 'basicConfig.benefit.period' })}: ${item.params.time}${intl.formatMessage({ id: 'basicConfig.benefit.hour' })}` : ''}
                  
                  </span>
                )}
              </li>
            ))}
          </ul>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'basicConfig.column.updateTime' }),
      dataIndex: 'updateTime',
      key: 'updateTime',
      valueType: 'dateTime',
     
    },
    {
      title: intl.formatMessage({ id: 'basicConfig.column.operator' }),
      dataIndex: 'operatorName',
      key: 'tenantId',
      render: (text: string | null) => text || '-',
    },
    {
      title: intl.formatMessage({ id: 'basicConfig.column.action' }),
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          icon={<EditOutlined />} 
          onClick={() => showEditModal(record)}
        >
          {intl.formatMessage({ id: 'basicConfig.action.edit' })}
        </Button>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable 
        dataSource={dataSource} 
        columns={columns} 
        search={false}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => intl.formatMessage({ id: 'basicConfig.pagination.total' }, { total }),
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