import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Modal } from 'antd';
import React, { useEffect } from 'react';
import { homeMenu } from "@/services/ant-design-pro/WebConfig"; 

const Header: React.FC = () => {
  const getMenu=async()=>{
    const res=await homeMenu();
    console.log(res);
  }

  useEffect(()=>{
    getMenu();
  },[])
  return (
    <PageContainer>

    </PageContainer>
  );
};

export default Header;