import { PageContainer } from "@ant-design/pro-components";
import { Button, message, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import { HomeMenuTranslationList, saveHomeMenu, homeMenuParams,updateHomeMenuById } from "@/services/ant-design-pro/WebConfig";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AddMenuModals from "./component/AddMenuModals";
import { languages } from '@/config/language';
const languageOptions = languages

const Header: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState("en_US");
  const [menuData, setMenuData] = useState<any[]>([]);
  const [modalType, setModalType] = useState<boolean>(false);
  const [parentId, setParentId] = useState<any>(null);
  const [editingMenu, setEditingMenu] = useState<any>(null);

  // 获取菜单数据
  const getMenu = async () => {
    try {
      const res = await HomeMenuTranslationList({ languageCode: currentLanguage });
      if(res.code === "0"){
        setMenuData(res?.data);
      }else{
        message.error("获取菜单数据失败");
      }
    } catch (error) {
      message.error("获取菜单数据失败");
    }
  };

  useEffect(() => {
    getMenu();
  }, [currentLanguage]);

  // 处理编辑功能
  const handleEdit = async (item: any) => {
    try {
      const res = await homeMenuParams({ menuId: item.id });
      if (res.code === "0") {
        setEditingMenu(res.data);
        setModalType(true);
      } else {
        message.error("获取菜单详情失败");
      }
    } catch (error) {
      message.error("获取菜单详情失败");
    }
  };
  
  // 处理删除功能
  const handleDelete = async (itemId: number) => {
    try {
      // const res = await deleteHomeMenu({ id: itemId });
      // if (res.code === "0") {
      //   message.success("菜单删除成功");
      //   getMenu(); // 重新获取菜单数据
      // } else {
      //   message.error("删除失败: " + (res.message || "未知错误"));
      // }
    } catch (error) {
      message.error("删除失败: " + (error || "网络错误"));
    }
  };

  // 打开弹窗
  const handleModal = (item: any = null) => {
    setParentId(item);
    setEditingMenu(null); // 重置编辑状态
    setModalType(true);
  };

  // 关闭弹窗
  const handleCancel = () => {
    setModalType(false);
    setEditingMenu(null);
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    let displayStatus
    if(values.values.displayStatus){
      displayStatus=1
    }else{
      displayStatus=0
    }
    if(!values.values.typeId){
      values.values.typeId=2
    }
    
    try {
      const data = {
        homeMenu: {
          menuDescription: values.values.menuDescription,
          parentId: parentId?.id || 0,
          typeId: values.values.typeId,
          orderIndex: 1,
          iconUrlDay: values.iconUrlDay,
          iconUrlNight: values.iconUrlNight,
          cornerMarkOne: values.uploadedImageUrl,
          cornerMarkTwo: "",
          displayStatus: displayStatus,
          spreadPattern: values.values.spreadPattern,
          accessType: values.values.accessType,
          accessPath: values.values.accessPath,
        },
        homeMenuTranslation: {
          languageCode: currentLanguage,
          languagePath: "/home/zh_CN",
          menuName: values.values.menuName,
          menuViceName: values.values.menuViceName,
          languageIcon: values.values.uploadedImageUrl,
        },
      };

      let response;
      if (editingMenu) {
        // 编辑模式 - 使用更新接口
        data.homeMenu.id = editingMenu.id; // 添加菜单ID
        data.homeMenuTranslation.menuId = editingMenu.id; // 添加菜单ID到翻译对象
        response = await updateHomeMenuById(data);
      } else {
        // 新增模式 - 使用保存接口
        response = await saveHomeMenu(data);
      }

      if (response.code === "0") {
        message.success(editingMenu ? "菜单更新成功" : "菜单添加成功");
        handleCancel();
        getMenu(); // 重新获取菜单数据
      } else {
        message.error((editingMenu ? "菜单更新失败: " : "菜单添加失败: ") + (response.message || "未知错误"));
      }
    } catch (error) {
      message.error("提交失败: " + (error || "网络错误"));
    }
  };

  // 递归渲染菜单（支持多层嵌套）
  const renderMenu = (menuList: any[]) => {
    return menuList.map((item) =>
      item.languageCode === currentLanguage ? (
        <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {/* 父级菜单 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button
              style={{
                background: "#F5F5F5",
                color: "#000",
                fontSize: 16,
                fontWeight: "bold",
                padding: "6px 12px",
                borderRadius: 8,
                minWidth: 100,
                position: "relative",
                paddingRight: 60,
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Popconfirm
                  title="确定要删除这个菜单吗？"
                  onConfirm={(e) => { e?.stopPropagation(); handleDelete(item.id); }}
                  okText="确定"
                  cancelText="取消"
                >
                  {/* <DeleteOutlined onClick={(e) => e.stopPropagation()} style={{ color: "#ff4d4f", marginRight: 8 }} /> */}
                </Popconfirm>
                {item.menuName}
              </div>
              <div style={{ position: "absolute", right: "8px", display: "flex", gap: "6px" }}>
                <EditOutlined onClick={(e) => { e.stopPropagation(); handleEdit(item); }} style={{ color: "#1890ff" }} />
              </div>
            </Button>
            <Button
              onClick={() => handleModal(item)}
              style={{
                background: "#FF6A00",
                color: "#FFF",
                borderRadius: 8,
                height: 32,
                width: 32,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PlusOutlined />
            </Button>
          </div>

          {/* 递归渲染子菜单 */}
          {item.children && item.children.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginLeft: 20 }}>
              {item.children.map((child: any) => (
                <div key={child.id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Button
                      style={{
                        background: "#F5F5F5",
                        color: "#000",
                        fontSize: 14,
                        padding: "6px 12px",
                        borderRadius: 8,
                        minWidth: 80,
                        textAlign: "left",
                        position: "relative",
                        paddingRight: 60,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Popconfirm
                          title="确定要删除这个菜单吗？"
                          onConfirm={(e) => { e?.stopPropagation(); handleDelete(child.id); }}
                          okText="确定"
                          cancelText="取消"
                        >
                          {/* <DeleteOutlined onClick={(e) => e.stopPropagation()} style={{ color: "#ff4d4f", marginRight: 8 }} /> */}
                        </Popconfirm>
                        • {child.menuName}
                      </div>
                      <div style={{ position: "absolute", right: "8px", display: "flex", gap: "6px" }}>
                        <EditOutlined onClick={(e) => { e.stopPropagation(); handleEdit(child); }} style={{ color: "#1890ff" }} />
                      </div>
                    </Button>
                    <Button
                      onClick={() => handleModal(child)}
                      style={{
                        background: "#FF6A00",
                        color: "#FFF",
                        borderRadius: 8,
                        height: 32,
                        width: 32,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <PlusOutlined />
                    </Button>
                  </div>
                  
                  {/* 递归渲染更深层级的子菜单 */}
                  {child.children && child.children.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginLeft: 20 }}>
                      {renderMenu(child.children)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null
    );
  };

  return (
    <PageContainer>
      {/* 语言切换 */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {languageOptions.map((lang) => (
          <Button
            key={lang.key}
            type={currentLanguage === lang.key ? "primary" : "default"}
            onClick={() => setCurrentLanguage(lang.key)}
            style={{
              background: currentLanguage === lang.key ? "#FF6A00" : "#F5F5F5",
              color: currentLanguage === lang.key ? "#FFF" : "#000",
              borderRadius: 8,
              fontWeight: "bold",
            }}
          >
            {lang.label}
          </Button>
        ))}
      </div>

      {/* 导航菜单 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 10, borderBottom: "2px solid #ddd" }}>
          <Button style={{ background: "#F5F5F5", color: "#000", fontWeight: "bold" }}>Logo</Button>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginLeft: 20 }}>
            
           
            
            {menuData && menuData.length > 0 && renderMenu(menuData)}

            <Button 
                type="text"
                style={{
                  background: "#FF6A00" ,
                  color: "#fff",
                  borderRadius: 8,
                  fontWeight: "bold",
                  marginLeft: 20,
                }}
                onClick={() => handleModal()}
              >添加一级菜单<PlusOutlined /></Button>
          </div>
        </div>
      </div>

      {/* 添加菜单弹窗 */}
      <AddMenuModals 
        visible={modalType} 
        onCancel={handleCancel} 
        onSubmit={handleSubmit} 
        parentId={parentId}
        editingMenu={editingMenu} 
      />
    </PageContainer>
  );
};

export default Header;