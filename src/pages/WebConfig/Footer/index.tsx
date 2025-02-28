import { HomeMenuTranslationList, saveHomeMenu } from '@/services/ant-design-pro/WebConfig';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import AddMenuModals from './component/AddMenuModals';
import { homeBottomList, homeBottomTranslationList, saveHomeBottom, updateHomeBottomTranslationById, updateHomeBottomById } from '@/services/ant-design-pro/WebConfig';

const languageOptions = [
  { key: 'en', label: 'English' },
  { key: 'zh_CN', label: '简体中文' },
  { key: 'zh_TW', label: '繁體中文' },
  { key: 'ja', label: '日本語' },
  { key: 'ko', label: '한국어' },
];

const Footer: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [menuData, setMenuData] = useState<any[]>([]);
  const [modalType, setModalType] = useState<boolean>(false);
  const [parentId, setParentId] = useState<any>(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 获取菜单数据
  const getMenu = async () => {
    try {
      const res = await HomeMenuTranslationList({ languageCode: currentLanguage });
      if (res.code === '0') {
        setMenuData(res?.data);
      } else {
        message.error('获取菜单数据失败');
      }
    } catch (error) {
      message.error('获取菜单数据失败');
    }
  };

  useEffect(() => {
    getMenu();
  }, [currentLanguage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await homeBottomList({ /* 请求参数 */ });
        if (response.code === '0') {
          setData(response.data);
        } else {
          message.error('获取数据失败');
        }
      } catch (error) {
        message.error('请求失败，请检查网络连接');
      }
    };

    fetchData();
  }, []);

  // 打开弹窗
  const handleModal = (item: any = null) => {
    setParentId(item);
    setModalType(true);
  };

  // 关闭弹窗
  const handleCancel = () => {
    setModalType(false);
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    let displayStatus;
    if (values.values.displayStatus) {
      displayStatus = 1;
    } else {
      displayStatus = 0;
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
          cornerMarkTwo: '',
          displayStatus: displayStatus,
          spreadPattern: values.values.spreadPattern,
          accessType: values.values.accessType,
          accessPath: values.values.accessPath,
        },
        homeMenuTranslation: {
          languageCode: currentLanguage,
          languagePath: '/home/zh_CN',
          menuName: values.values.menuName,
          menuViceName: values.values.menuViceName,
          languageIcon: values.values.uploadedImageUrl,
        },
      };

      const response = await saveHomeMenu(data);
      if (response.code === '0') {
        message.success('菜单添加成功');
        handleCancel();
        getMenu(); // 重新获取菜单数据
      } else {
        message.error('菜单添加失败: ' + (response.message || '未知错误'));
      }
    } catch (error) {
      message.error('提交失败: ' + (error || '网络错误'));
    }
  };

  // 递归渲染菜单（子菜单也有 `+` 按钮）
  const renderMenu = (menuList: any[]) => {
    return menuList.map((item) =>
      item.languageCode === currentLanguage ? (
        <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* 父级菜单 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button
              style={{
                background: '#F5F5F5',
                color: '#000',
                fontSize: 16,
                fontWeight: 'bold',
                padding: '6px 12px',
                borderRadius: 8,
                minWidth: 100,
              }}
            >
              {item.menuName}
            </Button>
            <Button
              onClick={() => handleModal(item)}
              style={{
                background: '#FF6A00',
                color: '#FFF',
                borderRadius: 8,
                height: 32,
                width: 32,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <PlusOutlined />
            </Button>
          </div>

          {/* 子级菜单（带 `+` 按钮） */}
          {item.children && item.children.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {item.children.map((child) => (
                <div key={child.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Button
                    style={{
                      background: '#F5F5F5',
                      color: '#000',
                      fontSize: 14,
                      padding: '6px 12px',
                      borderRadius: 8,
                      minWidth: 80,
                      textAlign: 'left',
                    }}
                  >
                    • {child.menuName}
                  </Button>
                  <Button
                    onClick={() => handleModal(child)}
                    style={{
                      background: '#FF6A00',
                      color: '#FFF',
                      borderRadius: 8,
                      height: 32,
                      width: 32,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <PlusOutlined />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null,
    );
  };




  return (
    <PageContainer>
      {/* 语言切换 */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {languageOptions.map((lang) => (
          <Button
            key={lang.key}
            type={currentLanguage === lang.key ? 'primary' : 'default'}
            onClick={() => setCurrentLanguage(lang.key)}
            style={{
              background: currentLanguage === lang.key ? '#FF6A00' : '#F5F5F5',
              color: currentLanguage === lang.key ? '#FFF' : '#000',
              borderRadius: 8,
              fontWeight: 'bold',
            }}
          >
            {lang.label}
          </Button>
        ))}
      </div>

      {/* 导航菜单 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            paddingBottom: 10,
            borderBottom: '2px solid #ddd',
          }}
        >
          <Button style={{ background: '#F5F5F5', color: '#000', fontWeight: 'bold' }}>Logo</Button>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginLeft: 20 }}>
            {menuData && menuData.length > 0 && renderMenu(menuData)}

            <Button
              type="text"
              style={{
                background: '#FF6A00',
                color: '#fff',
                borderRadius: 8,
                fontWeight: 'bold',
                marginLeft: 20,
              }}
              onClick={() => handleModal()}
            >
              添加一级菜单
              <PlusOutlined />
            </Button>
          </div>
        </div>
      </div>

      {/* 添加菜单弹窗 */}
      <AddMenuModals
        visible={modalType}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        parentId={parentId}
      />

    
    </PageContainer>
  );
};

export default Footer;
