import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Space, Switch, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { homeBottomList, saveHomeBottom,homeBottomTranslationList, updateHomeBottomTranslationById, updateHomeBottomById,saveHomeBottomFooter,homeBottomFooterList,updateHomeBottomFooterById} from '@/services/ant-design-pro/WebConfig';
import { updateValue,getTenantKeyParams} from '@/services/ant-design-pro/kv';
import AddMenuModal from './components/AddMenuModal';
import { languages } from '@/config/language';
const languageOptions = languages

const { TextArea } = Input;

const Footer: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en_US');
  const [menuData, setMenuData] = useState<any[]>([]);
  const [modalType, setModalType] = useState<boolean>(false);
  const [parentId, setParentId] = useState<any>(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCustomFooter, setIsCustomFooter] = useState(false);
  const [customCode, setCustomCode] = useState('');
  const [footerId, setFooterId] = useState<number | null>(null);

  // 获取菜单数据
  const getMenu = async () => {
    try {
      let data={
        pageNo:1,
        pageSize:1000,

      }
      const res = await homeBottomList(data);
      console.log(res);
      if (res.code === '0') {
        setMenuData(res?.data.list);
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
        let data={
          pageNo:1,
          pageSize:1000,

        }
        const response = await homeBottomList(data);
        if (response.code === '0') {
          setData(response.data.list);
        } else {
          message.error('获取数据失败');
        }
      } catch (error) {
        message.error('请求失败，请检查网络连接');
      }
    };

    fetchData();
  }, []);

  // 获取自定义Footer状态
  useEffect(() => {
    const getCustomFooterStatus = async () => {
      try {
        const response = await getTenantKeyParams({key:'footer_setting'});
        if (response.code === '0') {
          setIsCustomFooter(response.data.keyValue === '1');
        } else {
          message.error('获取自定义Footer状态失败');
        }
      } catch (error) {
        message.error('获取自定义Footer状态失败');
      }
    };

    getCustomFooterStatus();
  }, []);

  // 获取自定义Footer内容
  useEffect(() => {
    const getCustomFooterContent = async () => {
      try {
        const response = await homeBottomFooterList({ languageCode: currentLanguage });
        if (response.code === '0' && response.data) {
          setCustomCode(response.data.list[0]?.codeContent || '');
          setFooterId(response.data.list[0]?.id);
        } else {
          message.error('获取自定义Footer内容失败');
        }
      } catch (error) {
        message.error('获取自定义Footer内容失败');
      }
    };

    if (isCustomFooter) {
      getCustomFooterContent();
    }
  }, [currentLanguage, isCustomFooter]);

  // 打开弹窗
  const handleModal = (item: any = null) => {
    setParentId(item);
    setModalType(true);
  };

  // 关闭弹窗
  const handleCancel = () => {
    setModalType(false);
    setParentId(null);
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
      console.log(parentId.id);
      const data = {
        homeBottom: {
          menuDescription: values.values.menuDescription,
          parentId: parentId?.id || 0,
          orderIndex: 1,
          bottomDescription:values.values.bottomDescription,
          // displayStatus: displayStatus,
           languageKey: currentLanguage,
          accessType: values.values.accessType,
          accessPath: values.values.accessPath,
        },
        homeBottomTranslation: {
          languageCode: currentLanguage,
          languagePath: '/home/zh_CN',
          bottomName: values.values.menuName,
        },
      };

      const response = await saveHomeBottom(data);
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

  // 递归渲染菜单
  const renderMenu = (menuList: any[]) => {
    // 过滤出父级菜单（parentId === 0）
    const parentMenus = menuList.filter(item => item.parentId === 0);
    
    return parentMenus.map((parentItem) => {
      // 找出当前父菜单的所有子菜单
      const childMenus = menuList.filter(item => item.parentId === parentItem.id);
      
      return (
        <div key={parentItem.id} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
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
              {parentItem.bottomDescription}
            </Button>
            <Button
              onClick={() => handleModal(parentItem)}
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

          {/* 子菜单 */}
          {childMenus.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {childMenus.map((child) => (
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
                    • {child.bottomDescription}
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
      );
    });
  };

  // 处理自定义Footer开关
  const handleCustomFooterChange = async (checked: boolean) => {
    try {
      const response = await updateValue({
        keyProperty: 'footer_setting',
        keyValue: checked ? '1' : '0'
      });
      if (response.code === '0') {
        setIsCustomFooter(checked);
        message.success('更新成功');
      } else {
        message.error('更新失败');
      }
    } catch (error) {
      message.error('更新失败');
    }
  };

  // 处理代码更改
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomCode(e.target.value);
  };

  // 保存配置
  const handleSave = async () => {
    try {
      if (footerId) {
        const data = {
          id: footerId,
          languageCode: currentLanguage,
          codeContent: customCode
        };
        const response = await updateHomeBottomFooterById(data);
        if (response.code === '0') {
          message.success('更新成功');
        } else {
          message.error(response.message || '更新失败');
        }
      } else {
        const data = {
          languageCode: currentLanguage,
          codeContent: customCode
        };
        const response = await saveHomeBottomFooter(data);
        if (response.code === '0') {
          message.success('保存成功');
        } else {
          message.error(response.message || '保存失败');
        }
      }
    } catch (error) {
      message.error('保存失败');
    }
  };

  return (
    <PageContainer>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div>Footer配置</div>|
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>自定义Footer</span>
          </div>
        </div>
        <div style={{marginBottom:20}}> 收否开启自定义Footer<Switch checked={isCustomFooter} onChange={handleCustomFooterChange} style={{marginLeft:10}}/></div>
        <div style={{ marginBottom: 16 }}>
              {languageOptions.map((lang) => (
                <Button
                  key={lang.key}
                  type={currentLanguage === lang.key ? 'primary' : 'default'}
                  onClick={() => setCurrentLanguage(lang.key)}
                  style={{ marginRight: 8 }}
                >
                  {lang.label}
                </Button>
              ))}
            </div>
        {isCustomFooter && (
          <>
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#666', marginBottom: 8 }}>
                Tips:
                <div>开启自定义Footer,前台底部样式将基于此处代码显示;</div>
                <div>英文为必填，其他语言不填，默认使用英文样式。</div>
              </div>
            </div>

            {/* 语言切换 */}
           

            {/* 代码编辑区域 */}
            <TextArea
              placeholder="这是一段系统默认代码"
              value={customCode}
              onChange={handleCodeChange}
              style={{ height: 400, marginBottom: 16 }}
            />

            <Button type="primary" onClick={handleSave}>
              保存
            </Button>
          </>
        )}
      </div>

      {/* 原有的菜单配置部分，当isCustomFooter为false时显示 */}
      {!isCustomFooter && (
        <>
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
        </>
      )}

      <AddMenuModal 
        open={modalType}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        parentId={parentId}
      />
    </PageContainer>
  );
};

export default Footer;
