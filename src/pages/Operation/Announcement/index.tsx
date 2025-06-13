import { PageContainer } from '@ant-design/pro-components';
import { Tabs } from 'antd';
import React, { useState } from 'react';
import { useIntl } from '@umijs/max';
import AnnouncementManagement from './components/AnnouncementManagement';
import CategoryManagement from './components/CategoryManagement';

const { TabPane } = Tabs;

const AnnouncementPage: React.FC = () => {
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState<string>(() => {
    const savedTab = localStorage.getItem('announcementActiveTab');
    return savedTab || 'announcement';
  });

  // 切换标签页
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    localStorage.setItem('announcementActiveTab', key);
  };

  return (
    <PageContainer>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane
          tab={intl.formatMessage({ id: 'announcement.tab.category', defaultMessage: '分类管理' })}
          key="category"
        >
          <CategoryManagement />
        </TabPane>
        <TabPane
          tab={intl.formatMessage({
            id: 'announcement.tab.announcement',
            defaultMessage: '公告管理',
          })}
          key="announcement"
        >
          <AnnouncementManagement />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default AnnouncementPage;
