import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space,message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { AuthorityList,saveTenantAuthority,deleteTenantById,updateTenantById,permissionsParams,deleteTenantByIdList} from '@/services/ant-design-pro/authAdmin';
import PermissionModal from './component/PermissionModal'; // 引入PermissionModal

const PermissionAdmin: React.FC = () => {
  // 表格数据状态
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null); // 编辑时的记录
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 }); // 添加分页状态

  // 表格列配置
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
       search: false,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      search: false,
    },
    {
      title: '菜单权限',
      dataIndex: 'type',
      key: 'type',
      search: false,
    },
    {
      title: '操作权限',
      dataIndex: 'optionType',
      key: 'optionType',
      search: false,
    },
    {
      title: '中文标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      search: false,
    },
    {
      title: '父级ID',
      dataIndex: 'parentId',
      key: 'parentId',
      search: false,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      search: false,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      search: false,
    },
    {
      title: '页面路径',
      dataIndex: 'path',
      key: 'path',
      search: false,
    },
    {
      title: '组件路径',
      dataIndex: 'component',
      key: 'component',
      search: false,
    },
    {
      title: 'icon',
      dataIndex: 'icon',
      key: 'icon',
      search: false,
    },
    {
      title: '选项',
      key: 'action',
      search: false,
      render: (_, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a style={{ color: '#ff4d4f' }} onClick={() => handleDelete(record.id)}>删除</a>
        </Space>
      ),
    },
  ];

  // 获取权限列表
  const getAuthorityList = async (params = { pageNo: 1, pageSize: 10 }) => {
    setLoading(true); // 设置加载状态
    try {
      const res = await AuthorityList(params); // 调用 API
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
          message.success('编辑成功');
        } else {
          // 新建
       const res=  await saveTenantAuthority(values);
       if(res.code==='0'){
        message.success('新建成功');
       }else{
        message.error('新建失败');
       }
         
        }
        setModalVisible(false);
        setEditingRecord(null);
        getAuthorityList();
      } catch (error) {
        message.error('操作失败');
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
        message.success('删除成功');
        getAuthorityList();
      } catch (error) {
        message.error('删除失败');
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
          <Button key="search" type="primary" onClick={() => getAuthorityList({ pageNo: 1, pageSize: 10 })}>
            查询
          </Button>,
          <Button key="reset" icon={<ReloadOutlined />} onClick={() => getAuthorityList({ pageNo: 1, pageSize: 10 })}>
            重置
          </Button>,
          <Button key="create" icon={<PlusOutlined />} type="primary" onClick={() => setModalVisible(true)}>
            新建
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

export default PermissionAdmin;