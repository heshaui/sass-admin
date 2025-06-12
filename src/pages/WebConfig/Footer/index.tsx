import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Space, Switch, Input, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from '@umijs/max';
import {
  homeBottomList,
  saveHomeBottom,
  homeBottomTranslationList,
  updateHomeBottomTranslationById,
  updateHomeBottomById,
  saveHomeBottomFooter,
  homeBottomFooterList,
  updateHomeBottomFooterById,
  deleteHomeBottom,
  homeBottomParams,
} from '@/services/ant-design-pro/WebConfig';
import { updateValue, getTenantKeyParams } from '@/services/ant-design-pro/kv';
import AddMenuModal from './components/AddMenuModal';
import { tenantLangList } from '@/services/ant-design-pro/WebConfig';

const { TextArea } = Input;

const Footer: React.FC = () => {
  const intl = useIntl();
  const [currentLanguage, setCurrentLanguage] = useState('en_US');
  const [menuData, setMenuData] = useState<any[]>([]);
  const [modalType, setModalType] = useState<boolean>(false);
  const [parentId, setParentId] = useState<any>(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCustomFooter, setIsCustomFooter] = useState(false);
  const [customCode, setCustomCode] = useState('');
  const [footerId, setFooterId] = useState<number | null>(null);
  const [editingMenu, setEditingMenu] = useState<any>(null);
  const [languages, setLanguages] = useState<any[]>([]);

  const getLang = async () => {
    let data = {
      pageNo: 1,
      pageSize: 10000,
    };
    const res = await tenantLangList(data);
    if (res.code === '0') {
      setLanguages(res.data?.list || []);
    }
  };
  // 获取菜单数据
  const getMenu = async () => {
    setLoading(true);
    try {
      let data = {
        pageNo: 1,
        pageSize: 1000,
        languageCode: currentLanguage,
      };
      const res = await homeBottomList(data);
      if (res.code === '0') {
        setMenuData(res?.data);
        setData(res?.data); // 同时更新data状态
      } else {
        message.error(intl.formatMessage({ id: 'webConfig.footer.fetchFailed' }));
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'webConfig.footer.fetchFailed' }));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getLang();
  }, []);
  useEffect(() => {
    getMenu();
  }, [currentLanguage]);

  // 获取自定义Footer状态
  useEffect(() => {
    const getCustomFooterStatus = async () => {
      try {
        const response = await getTenantKeyParams({ key: 'footer_setting' });
        if (response.code === '0') {
          setIsCustomFooter(response.data.keyValue === '1');
        } else {
          message.error(intl.formatMessage({ id: 'webConfig.footer.fetchCustomStatusFailed' }));
        }
      } catch (error) {
        message.error(intl.formatMessage({ id: 'webConfig.footer.fetchCustomStatusFailed' }));
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
          message.error(intl.formatMessage({ id: 'webConfig.footer.fetchCustomContentFailed' }));
        }
      } catch (error) {
        message.error(intl.formatMessage({ id: 'webConfig.footer.fetchCustomContentFailed' }));
      }
    };

    if (isCustomFooter) {
      getCustomFooterContent();
    }
  }, [currentLanguage, isCustomFooter]);

  // 打开弹窗
  const handleModal = (item: any = null) => {
    console.log('item', item);
    setEditingMenu(null);
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
    if (editingMenu != null) {
      await handleEditSubmit(values);
      return;
    }
    let show;
    if (values.values.show) {
      show = 1;
    } else {
      show = 0;
    }
    console.log('values', values);
    console.log('parentId', parentId);
    try {
      const data = {
        homeBottom: {
          menuDescription: values.values.menuDescription,
          parentId: parentId?.bottomId || 0,
          orderIndex: 1,
          bottomDescription: values.values.bottomDescription,
          show: show,
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
        message.success(intl.formatMessage({ id: 'webConfig.footer.addSuccess' }));
        handleCancel();
        getMenu(); // 重新获取菜单数据
        setParentId(null);
      } else {
        message.error(
          intl.formatMessage({ id: 'webConfig.footer.addFailed' }) +
            (response.message || intl.formatMessage({ id: 'webConfig.footer.unknownError' })),
        );
      }
    } catch (error) {
      console.log(error);
      message.error(
        intl.formatMessage({ id: 'webConfig.footer.submitFailed' }) +
          (error || intl.formatMessage({ id: 'webConfig.footer.networkError' })),
      );
    }
  };

  const handleEditSubmit = async (values: any) => {
    let show;
    if (values.values.show) {
      show = 1;
    } else {
      show = 0;
    }

    console.log('editingMenu', editingMenu);

    // const data = {
    //   homeBottom: {
    //     menuDescription: values.values.menuDescription,
    //     parentId: parentId?.bottomId || 0,
    //     orderIndex: 1,
    //     bottomDescription: values.values.bottomDescription,
    //     show: show,
    //     languageKey: currentLanguage,
    //     accessType: values.values.accessType,
    //     accessPath: values.values.accessPath,
    //   },
    //   homeBottomTranslation: {
    //     languageCode: currentLanguage,
    //     languagePath: '/home/zh_CN',
    //     bottomName: values.values.menuName,
    //   },
    // };
    let data = {
      id: editingMenu?.homeBottom.id,
      menuDescription: values.values.menuDescription,
      parentId: editingMenu?.homeBottom.parentId || 0,
      orderIndex: 1,
      bottomDescription: values.values.bottomDescription,
      show: show,
      languageKey: currentLanguage,
      accessType: values.values.accessType,
      accessPath: values.values.accessPath,
    };

    let data1 = {
      id: editingMenu?.homeBottomTranslation.id,
      bottomId: editingMenu?.homeBottom.id,
      languageCode: currentLanguage,
      languagePath: '/home/zh_CN',
      bottomName: values.values.menuName,
    };
    const response = await updateHomeBottomById(data);
    const response1 = await updateHomeBottomTranslationById(data1);

    if (response.code === '0' && response.data && response1.code === '0' && response1.data) {
      message.success(intl.formatMessage({ id: 'webConfig.footer.editSuccess' }));
      getMenu();
    } else {
      message.error(intl.formatMessage({ id: 'webConfig.footer.editFailed' }));
    }
    setModalType(false);
    setEditingMenu(null);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteHomeBottom({ id });
      if (response.code === '0') {
        message.success(intl.formatMessage({ id: 'webConfig.footer.deleteSuccess' }));
        getMenu(); // 重新获取菜单数据
      } else {
        message.error(
          intl.formatMessage({ id: 'webConfig.footer.deleteFailed' }) +
            (response.message || intl.formatMessage({ id: 'webConfig.footer.unknownError' })),
        );
      }
    } catch (error) {
      console.log(error);
      message.error(
        intl.formatMessage({ id: 'webConfig.footer.deleteFailed' }) +
          (error || intl.formatMessage({ id: 'webConfig.footer.networkError' })),
      );
    }
  };

  // 处理编辑功能
  const handleEdit = async (item: any) => {
    try {
      const res = await homeBottomParams({ id: item.bottomId });
      if (res.code === '0') {
        // 查找父级菜单信息
        let parentMenuInfo = null;
        if (res.data.homeBottom.parentId) {
          // 递归查找父级菜单
          const findParentMenu = (menus: any[], parentId: number): any => {
            for (const menu of menus) {
              if (menu.id === parentId) {
                return menu;
              }
              if (menu.children && menu.children.length > 0) {
                const found = findParentMenu(menu.children, parentId);
                if (found) return found;
              }
            }
            return null;
          };
          parentMenuInfo = findParentMenu(menuData, res.data.homeBottom.parentId);
        }
        console.log('parentMenuInfo', parentMenuInfo);

        setEditingMenu(res.data);
        setParentId(parentMenuInfo);
        setModalType(true);
      } else {
        message.error(intl.formatMessage({ id: 'webConfig.footer.fetchMenuDetailFailed' }));
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'webConfig.footer.fetchMenuDetailFailed' }));
    }
  };

  // 递归渲染菜单
  const renderMenu = (menuList: any[]) => {
    // 过滤出父级菜单（parentId === 0）
    const parentMenus = menuList.filter((item) => item.parentId === 0);

    return parentMenus.map((parentItem) => {
      // 找出当前父菜单的所有子菜单
      const childMenus = menuList.filter((item) => item.parentId === parentItem.bottomId);

      return (
        <div key={parentItem.bottomId} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
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
                minWidth: 150,
              }}
            >
              <Popconfirm
                title={intl.formatMessage(
                  { id: 'webConfig.footer.deleteConfirm' },
                  { name: parentItem.bottomName },
                )}
                onConfirm={(e) => {
                  e?.stopPropagation();
                  handleDelete(parentItem.bottomId);
                }}
                okText={intl.formatMessage({ id: 'webConfig.footer.confirmText' })}
                cancelText={intl.formatMessage({ id: 'webConfig.footer.cancelText' })}
              >
                <DeleteOutlined
                  onClick={(e) => e.stopPropagation()}
                  style={{ color: '#ff4d4f', marginRight: 8 }}
                />
              </Popconfirm>
              {parentItem.bottomName}
              <div style={{ position: 'absolute', right: '8px', display: 'flex', gap: '6px' }}>
                <EditOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(parentItem);
                  }}
                  style={{ color: '#1890ff' }}
                />
              </div>
            </Button>
            <div style={{ display: 'flex', alignItems: 'center' }}></div>
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
                <div key={child.bottomId} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
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
                    <Popconfirm
                      title={intl.formatMessage(
                        { id: 'webConfig.footer.deleteConfirm' },
                        { name: child.menuName },
                      )}
                      onConfirm={(e) => {
                        e?.stopPropagation();
                        handleDelete(child.bottomId);
                      }}
                      okText={intl.formatMessage({ id: 'webConfig.footer.confirmText' })}
                      cancelText={intl.formatMessage({ id: 'webConfig.footer.cancelText' })}
                    >
                      <DeleteOutlined
                        onClick={(e) => e.stopPropagation()}
                        style={{ color: '#ff4d4f', marginRight: 8 }}
                      />
                    </Popconfirm>
                    • {child.bottomName}
                    <div
                      style={{ position: 'absolute', right: '8px', display: 'flex', gap: '6px' }}
                    >
                      <EditOutlined
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(child);
                        }}
                        style={{ color: '#1890ff' }}
                      />
                    </div>
                  </Button>
                  {/* 暂时不支持添加二级以下菜单 */}
                  {/* <Button
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
                  </Button> */}
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
        keyValue: checked ? '1' : '0',
      });
      if (response.code === '0') {
        setIsCustomFooter(checked);
        message.success(intl.formatMessage({ id: 'webConfig.footer.updateSuccess' }));
      } else {
        message.error(intl.formatMessage({ id: 'webConfig.footer.updateFailed' }));
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'webConfig.footer.updateFailed' }));
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
          codeContent: customCode,
        };
        const response = await updateHomeBottomFooterById(data);
        if (response.code === '0') {
          message.success(intl.formatMessage({ id: 'webConfig.footer.updateSuccess' }));
        } else {
          message.error(
            response.message || intl.formatMessage({ id: 'webConfig.footer.updateFailed' }),
          );
        }
      } else {
        const data = {
          languageCode: currentLanguage,
          codeContent: customCode,
        };
        const response = await saveHomeBottomFooter(data);
        if (response.code === '0') {
          message.success(intl.formatMessage({ id: 'webConfig.footer.saveSuccess' }));
        } else {
          message.error(
            response.message || intl.formatMessage({ id: 'webConfig.footer.saveFailed' }),
          );
        }
      }
    } catch (error) {
      message.error(intl.formatMessage({ id: 'webConfig.footer.saveFailed' }));
    }
  };

  return (
    <PageContainer>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div>{intl.formatMessage({ id: 'webConfig.footer.title' })}</div>|
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{intl.formatMessage({ id: 'webConfig.footer.customFooter' })}</span>
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          {' '}
          {intl.formatMessage({ id: 'webConfig.footer.enableCustomFooter' })}
          <Switch
            checked={isCustomFooter}
            onChange={handleCustomFooterChange}
            style={{ marginLeft: 10 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          {languages.map((lang) => (
            <Button
              key={lang.langEncode}
              type={currentLanguage === lang.langEncode ? 'primary' : 'default'}
              onClick={() => setCurrentLanguage(lang.langEncode)}
              style={{ marginRight: 8 }}
            >
              {lang.lang}
            </Button>
          ))}
        </div>
        {isCustomFooter && (
          <>
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: '#666', marginBottom: 8 }}>
                {intl.formatMessage({ id: 'webConfig.footer.tips.title' })}
                <div>{intl.formatMessage({ id: 'webConfig.footer.tips.line1' })}</div>
                <div>{intl.formatMessage({ id: 'webConfig.footer.tips.line2' })}</div>
              </div>
            </div>

            {/* 语言切换 */}

            {/* 代码编辑区域 */}
            <TextArea
              placeholder={intl.formatMessage({ id: 'webConfig.footer.codeTextareaPlaceholder' })}
              value={customCode}
              onChange={handleCodeChange}
              style={{ height: 400, marginBottom: 16 }}
            />

            <Button type="primary" onClick={handleSave}>
              {intl.formatMessage({ id: 'webConfig.footer.save' })}
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
              <Button style={{ background: '#F5F5F5', color: '#000', fontWeight: 'bold' }}>
                Logo
              </Button>
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
                  {intl.formatMessage({ id: 'webConfig.footer.addTopLevelMenu' })}
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
        editingMenu={editingMenu}
      />
    </PageContainer>
  );
};

export default Footer;
