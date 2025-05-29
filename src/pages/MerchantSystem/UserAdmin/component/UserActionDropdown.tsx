import React from 'react';
import { useIntl } from 'umi';
import { Dropdown, Menu, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';

interface UserRecord {
  id: string | number;
  [key: string]: any;
}

interface UserActionDropdownProps {
  record: UserRecord;
  onEdit: (record: UserRecord) => void;
  onResetPassword: (userId: string | number) => void;
  onResetGoogleAuth: (userId: string | number) => void;
  onDisable: (userId: string | number) => void;
  onDelete: (userId: string | number) => void;
}

const UserActionDropdown: React.FC<UserActionDropdownProps> = ({
  record,
  onEdit,
  onResetPassword,
  onResetGoogleAuth,
  onDisable,
  onDelete
}) => {
  const intl = useIntl();
  
  const menu = (
    <Menu>
      <Menu.Item key="edit" onClick={() => onEdit(record)}>
        {intl.formatMessage({ id: 'merchantSystem.userActionDropdown.button.edit' })}
      </Menu.Item>
      <Menu.Item key="resetPassword" onClick={() => onResetPassword(record.id)}>
        {intl.formatMessage({ id: 'merchantSystem.userActionDropdown.button.resetPassword' })}
      </Menu.Item>
      <Menu.Item key="resetGoogle" onClick={() => onResetGoogleAuth(record.id)}>
        {intl.formatMessage({ id: 'merchantSystem.userActionDropdown.button.resetGoogle' })}
      </Menu.Item>
      <Menu.Item key="disable" onClick={() => onDisable(record.id)}>
        {intl.formatMessage({ id: 'merchantSystem.userActionDropdown.button.disable' })}
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => onDelete(record.id)}>
        {intl.formatMessage({ id: 'merchantSystem.userActionDropdown.button.delete' })}
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button>
        {intl.formatMessage({ id: 'merchantSystem.userAdmin.button.operations' })} <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default UserActionDropdown;