import { PageContainer } from '@ant-design/pro-components';
import {  Button,message } from 'antd';
import React, { useEffect, useState, } from 'react';
import { HomeMenuTranslationList} from "@/services/ant-design-pro/WebConfig";
import { PlusOutlined } from "@ant-design/icons";

import { saveHomeMenu } from "@/services/ant-design-pro/WebConfig";
import AddMenuModals from './component/AddMenuModals';


const languageOptions = [
  { key: "en", label: "English" },
  { key: "zh_CN", label: "简体中文" },
  { key: "zh_TW", label: "繁體中文" },
  { key: "ja", label: "日本語" },
  { key: "ko", label: "한국어" },
];



const Header: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState("en"); // 默认英文
  const [menuData, setMenuData] = useState<any[]>([]);
  const [modalType, setModalType] = useState<boolean>(false);
  const [parentId, setParentId] = useState<any>({});
  const getMenu = async () => {
    let data = { pageNo: 1, pageSize: 1000 };
    const res = await HomeMenuTranslationList(data);
    console.log(res);
    setMenuData(res?.data?.list || []);
  };

  useEffect(() => {
    getMenu();
  }, []);

  // 切换语言
  const changeLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    getMenu();
  };

  const handleMoal=(item:any)=>{
    
    setParentId(item);
    setModalType(true);
  }

  const handleCancel = () => {
    setModalType(false);
  };

  const handelSubmit = async (values: any) => {
    console.log("homevalues",values);
    try {
      const data = {
          homeMenu: {
              "menuDescription": values.values.menuDescription,
              "parentId": parentId?.menuId,
              "typeId": values.values.typeId,
              "orderIndex": 1,
              "iconUrlDay": values.iconUrlDay,
              "iconUrlNight":values.iconUrlNight,
              "cornerMarkOne": values.uploadedImageUrl,
              "cornerMarkTwo": "",
              "displayStatus": values.values.displayStatus,
              "spreadPattern": values.values.spreadPattern,
              "accessType": values.values.accessType,
              "accessPath": values.values.accessPath,
          },
          homeMenuTranslation: {
              "languageCode": currentLanguage,
              "languagePath": "/home/zh_CN",
              "menuName": values.values.menuName,
              "menuViceName": values.values.menuViceName,
              "languageIcon": values.values.uploadedImageUrl,

          }

      };

      // 调用 saveHomeMenu 接口
      const response = await saveHomeMenu(data);
      if (response.code==='0') { // 假设接口返回 { success: true } 表示成功
          message.success("菜单添加成功");
          handleCancel();
          
      } else {
          message.error("菜单添加失败: " + (response.message || "未知错误"));
      }
  } catch (error) {
      message.error("提交失败: " + (error || "网络错误"));
  }
  }



  return (
    <PageContainer>
      {/* 语言切换 */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {languageOptions.map((lang) => (
          <Button
            key={lang.key}
            type={currentLanguage === lang.key ? "primary" : "default"}
            onClick={() => changeLanguage(lang.key)}
          >
            {lang.label}

          </Button>
        ))}
      </div>

      {/* 导航菜单 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <Button style={{ background: "#F5F5F5", color: "#000" }}>logo</Button>

       {menuData.map((item) =>
          item.languageCode === currentLanguage ? (
            <Button  key={item.id} onClick={() => handleMoal(item)}>{item.menuName}<PlusOutlined/></Button>
          ) : null
        )}



        
        <Button type="primary"   onClick={() => handleMoal()}><PlusOutlined/>添加</Button>
      </div>
      <AddMenuModals visible={modalType} onCancel={() => handleCancel()}
        onSubmit={handelSubmit} parentId={parentId}/>

    </PageContainer>
  );
};

export default Header;