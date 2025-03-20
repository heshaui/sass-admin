import React, { useState, useRef,useEffect } from 'react';
import {  Space, message,Button,Image} from 'antd';
import { ProTable } from '@ant-design/pro-components';
import ServiceModal from './ServiceModal';
import LanguageSelector from '@/components/LanguageSelector';
import { addHelpCenterCustomization,getHelpCenterCustomizationList,getHelpCenterCustomizationContentList } from '@/services/ant-design-pro/operation';
const SelfService: React.FC = () => {
  const [activeLanguage, setActiveLanguage] = useState('en_US');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const actionRef = useRef<ActionType>();
  // 添加自助服务
  const handleAddService = () => {
    setIsModalVisible(true);
  };


  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (data: any) => {
    setIsModalVisible(false);
    const res = await addHelpCenterCustomization(data);
    if (res.code==='0'&&res.data) {
      message.success('添加成功');
      actionRef.current?.reload();
    }else{
      message.error('添加失败');
    }

  };

  // 新的合并请求函数
  const fetchHelpCenterData = async () => {
    const params = {
      "page": 1,
      "pageSize": 10000,
      "languageCode": activeLanguage
    };
    
    try {
      // 并行发起两个请求
      const [customizationRes, contentRes] = await Promise.all([
        getHelpCenterCustomizationList(params),
        getHelpCenterCustomizationContentList(params)
      ]);
      
      if (customizationRes.code === '0' && customizationRes.data && 
          contentRes.code === '0' && contentRes.data) {
        
        // 合并数据处理逻辑
        const customizations = customizationRes.data.list || [];
        const contents = contentRes.data.list  || [];
        
        // 可以将内容数据与对应的自定义项关联起来
        const mergedData = customizations.map(item => {
          // 查找该自定义项对应的所有内容
          const relatedContents = contents.filter(
            content => content.customizationId === item.id
          );
          
          return {
            ...item,
            contents: relatedContents || []
          };
        });
          console.log('合并数据:', mergedData);
        // 更新数据源
        setDataSource(mergedData);
        console.log('合并数据:', mergedData);
      } else {
        message.error('获取数据失败');
      }
    } catch (error) {
      console.error('请求出错:', error);
      message.error('获取数据失败');
    }
  };

  const columns = [
    {
      title: '标题',
      dataIndex: ['contents', 0, 'articleTitle'],
      render: (text: string, record: any) => {
        const content = record.contents && record.contents[0];
        return content ? content.articleTitle : '-';
      }
    },
    {
      title: '路径',
      dataIndex: ['contents', 0, 'languagePath'],
      render: (text: string, record: any) => {
        const content = record.contents && record.contents[0];
        return content ? content.languagePath : '-';
      }
    },
    {
      title: '夜间图标',
      dataIndex: 'blackIcon',
      render: (text: string, record: any) => {
        if(text!=='-'){
          return <Image src={text} width={50} height={50} />
        }else{
          return ''
        }
      }
       
      
    },
    {
      title: '日间图标',
      dataIndex: 'whiteIcon',
      render: (text: string, record: any) => {
        if(text!=='-'){
          console.log('text',text)
          return <Image src={text} width={50} height={50} />
        }else{
          return ''
        }
      }
    },
    
  ];


 

  useEffect(() => {
    fetchHelpCenterData();
  }, [activeLanguage]); // 当语言变化时重新获取数据
  return (
    <>
        <Space>
        <LanguageSelector
          value={activeLanguage}
          onChange={(value) => setActiveLanguage(value)}
        />
        </Space>
        <ProTable
          actionRef={actionRef}
          rowKey="id"
          search={false}
          columns={columns}
          dataSource={dataSource}
          toolBarRender={() => 
            dataSource.length < 10 ? [
              <Button type="primary" onClick={handleAddService}>添加</Button>
            ] : []
          }
        />

      <ServiceModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        defaultLanguage={activeLanguage}
      />
    </>
  );
};

export default SelfService; 