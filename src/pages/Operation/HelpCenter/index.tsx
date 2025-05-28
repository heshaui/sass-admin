import React, { useState } from 'react';
import { Tabs } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { useIntl } from 'umi';
import CategoryManagement from './components/Category/CategoryManagement';
import ArticleManagement from './components/Article/ArticleManagement';
import SelfService from './components/Self/SelfService';

const { TabPane } = Tabs;

const HelpCenter: React.FC = () => {
  const intl = useIntl();
  const [activeTab, setActiveTab] = useState('1');

  return (
    <PageContainer>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab={intl.formatMessage({ id: 'helpCenter.tab.categoryManagement' })} key="1">
          <CategoryManagement />
        </TabPane>
        
        <TabPane tab={intl.formatMessage({ id: 'helpCenter.tab.articleManagement' })} key="2">
          <ArticleManagement />
        </TabPane>
        
        <TabPane tab={intl.formatMessage({ id: 'helpCenter.tab.selfService' })} key="3">
          <SelfService />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default HelpCenter;
