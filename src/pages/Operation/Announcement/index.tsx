import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import {Tabs } from 'antd';
import AnnouncementManagement from './components/AnnouncementManagement';
import CategoryManagement from './components/CategoryManagement';


const { TabPane } = Tabs;

const AnnouncementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('announcement');


  // 切换标签页
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <PageContainer>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane
          tab='分类管理'
          key="category"
        >
          <CategoryManagement />
        </TabPane>
        <TabPane
          tab='公告管理'
          key="announcement"
        >
          <AnnouncementManagement />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default AnnouncementPage; 