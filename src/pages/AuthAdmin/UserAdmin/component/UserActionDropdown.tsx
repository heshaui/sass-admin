import React from 'react';
import { Dropdown, Menu, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';

const actionsMenu = (record: any, intl: any) => {
  return (
    <Menu>
      <Menu.Item key="edit" onClick={() => handleEdit(record)}>
        {intl.formatMessage({ id: 'userActionDropdown.actions.edit' })}
      </Menu.Item>
      <Menu.Item key="resetPassword" onClick={() => handleResetPassword(record.id)}>
        {intl.formatMessage({ id: 'userActionDropdown.actions.resetPassword' })}
      </Menu.Item>
      <Menu.Item key="resetGoogle" onClick={() => handleResetGoogleAuth(record.id)}>
        {intl.formatMessage({ id: 'userActionDropdown.actions.resetGoogle' })}
      </Menu.Item>
      <Menu.Item key="disable" onClick={() => handleDisable(record.id)}>
        {intl.formatMessage({ id: 'userActionDropdown.actions.disable' })}
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleDelete(record.id)}>
        {intl.formatMessage({ id: 'userActionDropdown.actions.delete' })}
      </Menu.Item>
    </Menu>
  );
};

const handleEdit = (record: any) => {
  // Handle editing the user
};

const handleResetPassword = (userId: any) => {
  // Handle resetting password
};

const handleResetGoogleAuth = (userId: any) => {
  // Handle resetting google auth
};

const handleDisable = (userId: any) => {
  // Handle disabling user
};

const handleDelete = (userId: any) => {
  // Handle deleting user
};

const UserActionDropdown = ({ record }: { record: any }) => {
  const intl = useIntl();
  return (
    <Dropdown overlay={() => actionsMenu(record, intl)} trigger={['click']}>
      <Button>
        {intl.formatMessage({ id: 'userActionDropdown.actions' })} <DownOutlined />
      </Button>
    </Dropdown>
  );
};
