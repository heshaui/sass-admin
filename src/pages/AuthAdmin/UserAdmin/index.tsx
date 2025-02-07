import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Select, Space, Tag,message } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { employeeList,saveEmployee,deleteEmployeeById,enableEmployee,offEmployee,resetPassword,updateEmployeeById} from '@/services/ant-design-pro/authAdmin';
import UserModal from './component/UserModal'; // 引入UserModal

const UserAdmin: React.FC = () => {
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(false);
   const [modalVisible, setModalVisible] = useState(false);  // 控制弹窗的显示
   const [editingRecord, setEditingRecord] = useState(null); // 用于保存编辑时的记录




    
  // 表格的列配置
  const columns = [
    {
      title: '管理员ID',
      dataIndex: 'id',
      key: 'id',
      search:false
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      search:false
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      search:false
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (text ? text : '--'),
    },
    // {
    //   title: '2FA',
    //   dataIndex: 'twoFactorAuth',
    //   key: 'twoFactorAuth',
    //   render: (text) =>
    //     text === '已开启' ? <Tag color="green">已开启</Tag> : <Tag color="red">未开启</Tag>,
    // },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) =>
        text === 1 ? <Tag color="green">正常</Tag> : <Tag color="red">禁用</Tag>,
    },
    {
      title: '选项',
      key: 'action',
      render: (_, record) => (
        <Space>
          
          <Button onClick={() => handleEdit(record)}>修改</Button>
          <Button style={{ color: '#ff4d4f' }} onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  const getUserList = async (params = { pageNo: 1, pageSize: 10 }) => {
    try {
      const res = await employeeList(params);
      if (res?.data) {
        setData(res.data.list || []); // 更新数据
      }
    } catch (error) {
      console.error('Failed to fetch user list:', error);
      return [];
    }finally {
      setLoading(false);
    }
  }

    // 新建/编辑用户提交
    const handleSubmit = async (values) => {
      try {
        if (editingRecord) {
          // 编辑用户
          await updateEmployeeById({ ...editingRecord, ...values });
          message.success('用户编辑成功');
        } else {
          // 新建用户
          await saveEmployee(values);
          message.success('用户新建成功');
        }
        setModalVisible(false);  // 关闭弹窗
        setEditingRecord(null);  // 清空编辑记录
        getUserList();  // 刷新用户列表
      } catch (error) {
        message.error('操作失败');
      }
    };
  
    // 编辑用户
    const handleEdit = (record) => {
      setEditingRecord(record);  // 设置编辑记录
      setModalVisible(true);  // 打开弹窗
    };
  
    // 删除用户
    const handleDelete = async (userId) => {
      try {
        // 调用API删除用户
        await deleteEmployeeById({ userId });
        message.success('用户删除成功');
        getUserList();  // 刷新用户列表
      } catch (error) {
        message.error('删除失败');
      }
    };
  
    useEffect(() => {
      getUserList();  // 获取用户列表
    }, []);

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        request={async (params) => {
          await getUserList({
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
          <Select placeholder="状态" key="status" style={{ width: 120 }}>
            <Select.Option value="全部">全部</Select.Option>
            <Select.Option value="正常">正常</Select.Option>
            <Select.Option value="禁用">禁用</Select.Option>
          </Select>,
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
       <UserModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        initialValues={editingRecord}
      />
    </PageContainer>
  );
};

export default UserAdmin;