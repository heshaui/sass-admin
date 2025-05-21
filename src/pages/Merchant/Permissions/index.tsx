import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space, message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useIntl } from 'umi';
import { 
  tenantPermissionsList,
  saveTenantPermissions,
  deleteTenantPermissionsById,
  updateTenantPermissionsById
} from '@/services/ant-design-pro/merchant';
import PermissionModal from './component/PermissionModal';

const Permissions: React.FC = () => {
  // 表格数据状态
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null); // 编辑时的记录

  const intl = useIntl();

  // 表格列配置
  const columns = [
    {
      title: intl.formatMessage({ id: 'permissions.table.id' }),
      dataIndex: 'id',
      key: 'id',
      width: 100,
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'permissions.table.description' }),
      dataIndex: 'description',
      key: 'description',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'permissions.table.menuPermission' }),
      dataIndex: 'type',
      key: 'type',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'permissions.table.operationPermission' }),
      dataIndex: 'optionType',
      key: 'optionType',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'permissions.table.chineseTitle' }),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: intl.formatMessage({ id: 'permissions.table.name' }),
      dataIndex: 'name',
      key: 'name',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'permissions.table.parentId' }),
      dataIndex: 'parentId',
      key: 'parentId',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'permissions.table.sort' }),
      dataIndex: 'sort',
      key: 'sort',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'permissions.table.title' }),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: intl.formatMessage({ id: 'permissions.table.pagePath' }),
      dataIndex: 'path',
      key: 'path',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'permissions.table.componentPath' }),
      dataIndex: 'component',
      key: 'component',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'permissions.table.icon' }),
      dataIndex: 'icon',
      key: 'icon',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'permissions.table.actions' }),
      key: 'action',
      search: false,
      render: (_, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>
            {intl.formatMessage({ id: 'permissions.action.edit' })}
          </a>
          <a 
            style={{ color: '#ff4d4f' }} 
            onClick={() => handleDelete(record.id)}
          >
            {intl.formatMessage({ id: 'permissions.action.delete' })}
          </a>
        </Space>
      ),
    },
  ];

  // 获取权限列表
  const getAuthorityList = async (params = { pageNo: 1, pageSize: 10 }) => {
    setLoading(true); // 设置加载状态
    try {
      const res = await tenantPermissionsList(params); // 调用 API
      if (res?.data) {
        setData(res.data.list || []); // 更新数据
      }
    } catch (error) {
      console.error('Failed to fetch authority list:', error);
    } finally {
      setLoading(false); // 结束加载状态
    }
  };
    // 新建/编辑提交
    const handleSubmit = async (values) => {
      try {
        if (editingRecord) {
          // 编辑
          await updateTenantById({ ...editingRecord, ...values });
          message.success(intl.formatMessage({ id: 'permissions.message.editSuccess' }));
        } else {
          // 新建
       const res=  await saveTenantPermissions(values);
       if(res.code==='0'){
        message.success(intl.formatMessage({ id: 'permissions.message.createSuccess' }));
       }else{
        message.error(intl.formatMessage({ id: 'permissions.message.createFailed' }));
       }
         
        }
        setModalVisible(false);
        setEditingRecord(null);
        getAuthorityList();
      } catch (error) {
        message.error(intl.formatMessage({ id: 'permissions.message.operationFailed' }));
      }
    };
  
    // 编辑
    const handleEdit = (record) => {
      setEditingRecord(record);
      setModalVisible(true);
    };
  
    // 删除
    const handleDelete = async (id) => {
      try {
        await deleteTenantById(id);
        message.success(intl.formatMessage({ id: 'permissions.message.deleteSuccess' }));
        getAuthorityList();
      } catch (error) {
        message.error(intl.formatMessage({ id: 'permissions.message.deleteFailed' }));
      }
    };

   
  

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ x: 'max-content' }}
        request={async (params) => {
          await getAuthorityList({
            pageNo: params.current,
            pageSize: params.pageSize,
          });
        }}
        search={{
          labelWidth: 'auto',
        }}
        options={{
          density: false,
          fullScreen: true,
          reload: false,
          setting: false,
        }}
        pagination={{
          showQuickJumper: true,
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        toolBarRender={() => [
          <Button key="search" type="primary" onClick={() => getAuthorityList({ pageNo: 1, pageSize: 10 })}>
            {intl.formatMessage({ id: 'permissions.toolbar.search' })}
          </Button>,
          <Button 
            key="reset" 
            icon={<ReloadOutlined />} 
            onClick={() => getAuthorityList({ pageNo: 1, pageSize: 10 })}
          >
            {intl.formatMessage({ id: 'permissions.toolbar.reset' })}
          </Button>,
          <Button 
            key="create" 
            icon={<PlusOutlined />} 
            type="primary" 
            onClick={() => setModalVisible(true)}
          >
            {intl.formatMessage({ id: 'permissions.toolbar.create' })}
          </Button>,
        ]}
      />
      <PermissionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialValues={editingRecord}
      />
    </PageContainer>
  );
};

export default Permissions;