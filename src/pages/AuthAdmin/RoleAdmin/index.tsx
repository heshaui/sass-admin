import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Space, message } from 'antd';
import { useIntl } from '@umijs/max';
import { useState, useEffect } from 'react';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { roleList,saveRole,deleteRoleById,updateRoleById,AuthorityList,savePermissionsList} from '@/services/ant-design-pro/authAdmin';
import RoleModal from './component/RoleModal';  // 引入RoleModal

const RoleAdmin: React.FC = () => {
  const intl = useIntl();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);  // 控制弹窗的显示
  const [editingRecord, setEditingRecord] = useState(null); // 用于保存编辑时的记录
  const [permissions, setPermissions] = useState<string[]>([]); // 存储所有权限列表
  // 表格的列配置
  const columns = [
    {
      title: '角色ID',
      dataIndex: 'roleId',
      key: 'roleId',
      search: false,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '描述',
      dataIndex: 'describe',
      key: 'describe',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      search: false,
      valueEnum: {
        0: { text: '禁用', status: 'Error' },
        1: { text: '启用', status: 'Success' },
      },
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <Button  type="primary" onClick={() => handleEdit(record)}>权限分配</Button>
          <Button  type="primary" onClick={() => handleEdit(record)}>修改</Button>
          <Button danger onClick={() => handleDelete(record.roleId)}>删除</Button>
        </Space>
      ),
    },
  ];

  // 获取角色列表
  const getRoleList = async (params = { pageNo: 1, pageSize: 10 }) => {
    setLoading(true); // 设置加载状态
    try {
      const res = await roleList(params); // 调用 API
      if (res?.data) {
        setData(res.data.list || []); // 更新数据
      }
    } catch (error) {
      console.error('Failed to fetch authority list:', error);
    } finally {
      setLoading(false); // 结束加载状态
    }
  };
    // 获取所有权限
    const fetchPermissions = async () => {
      try {
        let data={
          pageNo:1,
          pageSize:1000
        }
        const res = await AuthorityList(data);  // 获取所有权限
        if (res?.data) {
          setPermissions(res.data.list|| []);  // 设置权限列表
        }
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
      }
    };

      // 新建/编辑角色提交
  const handleSubmit = async (values) => {
    try {
      if (editingRecord) {
        // 编辑角色
        await updateRoleById({ ...editingRecord, ...values });
        message.success('角色编辑成功');
      } else {
        // 新建角色
        await saveRole(values);
        message.success('角色新建成功');
      }
      setModalVisible(false);  // 关闭弹窗
      setEditingRecord(null);  // 清空编辑记录
      getRoleList();  // 刷新角色列表
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 编辑角色
  const handleEdit = (record) => {
    setEditingRecord(record);  // 设置编辑记录
    setModalVisible(true);  // 打开弹窗
  };

  // 删除角色
  const handleDelete = async (roleId) => {
    try {
      await deleteRoleById({ roleId });  // 调用API删除角色
      message.success('角色删除成功');
      getRoleList();  // 刷新角色列表
    } catch (error) {
      message.error('删除失败');
    }
  }
  useEffect(() => {
    fetchPermissions();  // 获取所有权限
  }, []);

  return (
    <PageContainer>
      <ProTable
      rowKey="roleId"
      columns={columns}
      dataSource={data}
      loading={loading}
      request={async (params) => {
        await getRoleList({
          pageNo: params.current,
          pageSize: params.pageSize,
        });
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
          <Button key="search" type="primary">
            查询
          </Button>,
          <Button key="reset" icon={<ReloadOutlined />}>
            重置
          </Button>,
          <Button key="create" icon={<PlusOutlined />} type="primary" onClick={() => setModalVisible(true)}>
            新建
          </Button>,
        ]}
      />
      <RoleModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialValues={editingRecord}
        allPermissions={permissions}
      />
    </PageContainer>
  );
};

export default RoleAdmin;