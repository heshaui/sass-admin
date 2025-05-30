import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space,message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useIntl } from 'umi';
import { getTenantAuthorityList} from '@/services/ant-design-pro/merchantSystem';
import PermissionModal from './component/PermissionModal'; // 引入PermissionModal

const PermissionAdmin: React.FC = () => {
  const intl = useIntl();
  // 表格数据状态
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null); // 编辑时的记录
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 }); // 添加分页状态

  // 表格列配置
  const columns = [
    {
      title: intl.formatMessage({ id: 'merchantSystem.permissionAdmin.column.id' }),
      dataIndex: 'id',
      key: 'id',
       search: false,
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.permissionAdmin.column.description' }),
      dataIndex: 'description',
      key: 'description',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.permissionAdmin.column.type' }),
      dataIndex: 'type',
      key: 'type',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.permissionAdmin.column.optionType' }),
      dataIndex: 'optionType',
      key: 'optionType',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.permissionAdmin.column.title' }),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.permissionAdmin.column.name' }),
      dataIndex: 'name',
      key: 'name',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.permissionAdmin.column.parentId' }),
      dataIndex: 'parentId',
      key: 'parentId',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.permissionAdmin.column.sort' }),
      dataIndex: 'sort',
      key: 'sort',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.permissionAdmin.column.title' }),
      dataIndex: 'title',
      key: 'title',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.permissionAdmin.column.path' }),
      dataIndex: 'path',
      key: 'path',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.permissionAdmin.column.component' }),
      dataIndex: 'component',
      key: 'component',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.permissionAdmin.column.systemType' }),
      dataIndex: 'systemType',
      key: 'systemType',
      search: false,
      render: (text) => {
        return text === '1' ? intl.formatMessage({ id: 'merchantSystem.permissionAdmin.systemType.admin' }) : 
               text === '2' ? intl.formatMessage({ id: 'merchantSystem.permissionAdmin.systemType.merchant' }) : 
               intl.formatMessage({ id: 'merchantSystem.permissionAdmin.systemType.common' });
      },
    },
    {
      title: intl.formatMessage({ id: 'merchantSystem.permissionAdmin.column.icon' }),
      dataIndex: 'icon',
      key: 'icon',
      search: false,
    },

  ];

  // 获取权限列表
  const getAuthorityList = async (params = { pageNo: 1, pageSize: 10 }) => {
    setLoading(true); // 设置加载状态
    try {
      const res = await getTenantAuthorityList(params); // 调用 API
      if (res?.data) {
        setData(res.data.list || []); // 更新数据
        setPagination({
          ...pagination,
          current: params.pageNo,
          pageSize: params.pageSize,
          total: res.data.count || 0, // 设置总数
        });
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
          message.success(intl.formatMessage({ id: 'merchantSystem.permissionAdmin.message.edit.success' }));
        } else {
          // 新建
       const res=  await saveTenantAuthority(values);
       if(res.code==='0'){
        message.success(intl.formatMessage({ id: 'merchantSystem.permissionAdmin.message.create.success' }));
       }else{
        message.error(intl.formatMessage({ id: 'merchantSystem.permissionAdmin.message.create.failed' }));
       }
         
        }
        setModalVisible(false);
        setEditingRecord(null);
        getAuthorityList();
      } catch (error) {
        message.error(intl.formatMessage({ id: 'merchantSystem.permissionAdmin.message.operation.failed' }));
      }
    };
  
    // 编辑
    const handleEdit = (record: any) => {
      setEditingRecord(record);
      setModalVisible(true);
    };
  
    // 删除
    const handleDelete = async (id: string | number) => {
      try {
        await deleteTenantById(id);
        message.success(intl.formatMessage({ id: 'merchantSystem.permissionAdmin.message.delete.success' }));
        getAuthorityList();
      } catch (error) {
        message.error(intl.formatMessage({ id: 'merchantSystem.permissionAdmin.message.delete.failed' }));
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
            ...params, // 添加其他查询参数
          });
          return {
            data: data,
            success: true,
            total: pagination.total,
          };
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
          ...pagination,
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            getAuthorityList({ pageNo: page, pageSize });
          },
        }}
        toolBarRender={() => [

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

export default PermissionAdmin;