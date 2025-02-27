import React from 'react';
import { PageContainer } from "@ant-design/pro-components";
import {  Tabs, Upload, Button } from "antd";;
import  AvatarUpload  from '@/components/AvatarUpload';

const { TabPane } = Tabs;

const Logo: React.FC = () => {
  return (
    <PageContainer>
      <Tabs defaultActiveKey="1">
        <TabPane tab="夜间版" key="1">
          <div style={{ display: 'flex',  marginBottom: 16 }}>
            <div style={{ marginRight: 16 }}>
              <AvatarUpload
                onChange={(value) => {
                  console.log(value);
                }}
              />
              <p>(适用于顶部Header/底部Footer)</p>
            </div>
            <div>
            <AvatarUpload
                onChange={(value) => {
                  console.log(value);
                }}
              />
              <p>(适用于浏览器标签)</p>
            </div>
          </div>
          <Button type="primary">提交</Button>
        </TabPane>
        <TabPane tab="日间版" key="2">
        <div style={{ display: 'flex',  marginBottom: 16 }}>
            <div style={{ marginRight: 16 }}>
              <AvatarUpload
                onChange={(value) => {
                  console.log(value);
                }}
              />
              <p>(适用于顶部Header/底部Footer)</p>
            </div>
            <div>
            <AvatarUpload
                onChange={(value) => {
                  console.log(value);
                }}
              />
              <p>(适用于浏览器标签)</p>
            </div>
          </div>
          <Button type="primary">提交</Button>
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default Logo;