import React from 'react';
import { Dropdown, Menu, Button, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const actionsMenu = (record) => {
  return (
    <Menu>
      <Menu.Item key="edit" onClick={() => handleEdit(record)}>
        修改
      </Menu.Item>
      <Menu.Item key="resetPassword" onClick={() => handleResetPassword(record.id)}>
        重置密码
      </Menu.Item>
      <Menu.Item key="resetGoogle" onClick={() => handleResetGoogleAuth(record.id)}>
        重置谷歌
      </Menu.Item>
      <Menu.Item key="disable" onClick={() => handleDisable(record.id)}>
        禁用
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleDelete(record.id)}>
        删除
      </Menu.Item>
    </Menu>
  );
};

const handleEdit = (record) => {
  // Handle editing the user
};

const handleResetPassword = (userId) => {
  // Handle resetting password
};

const handleResetGoogleAuth = (userId) => {
  // Handle resetting google auth
};

const handleDisable = (userId) => {
  // Handle disabling user
};

const handleDelete = (userId) => {
  // Handle deleting user
};

const UserActionDropdown = ({ record }) => {
  return (
    <Dropdown overlay={() => actionsMenu(record)} trigger={['click']}>
      <Button>
        操作 <DownOutlined />
      </Button>
    </Dropdown>
  );
};