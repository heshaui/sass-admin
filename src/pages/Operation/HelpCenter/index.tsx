import React, { useState } from 'react';
import { Tabs } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import CategoryManagement from './components/Category/CategoryManagement';
import ArticleManagement from './components/Article/ArticleManagement';
import SelfService from './components/SelfService';

const { TabPane } = Tabs;

const HelpCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1');

  return (
    <PageContainer>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="分类管理" key="1">
          <CategoryManagement />
        </TabPane>
        
        <TabPane tab="文章管理" key="2">
          <ArticleManagement />
        </TabPane>
        
        <TabPane tab="自助服务" key="3">
          <SelfService />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default HelpCenter;
