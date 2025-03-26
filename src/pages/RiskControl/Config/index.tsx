import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';

const RiskControlConfig: React.FC = () => {
  return (
    <PageContainer>
      <Card title="风控配置" bordered={false}>
        <p>在这里配置资金风控相关参数</p>
        {/* 在此处添加风控配置表单 */}
      </Card>
    </PageContainer>
  );
};

export default RiskControlConfig; 