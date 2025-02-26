import React, { useState, useEffect } from "react";
import { PageContainer } from "@ant-design/pro-components";
import { Card, Tag, Button, Space, Row, Col, Modal, Select, Typography, message, Form, Input, Spin } from "antd";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { langPackageList,saveLangPackage,languageList} from "@/services/ant-design-pro/langPackage";

const { Option } = Select;
const { Title } = Typography;

// 定义接口类型
interface Language {
  id?: number;
  langId?: number;
  name?: string;
  lang?: string;
  code?: string;
  langEncode?: string;
  remark?: string;
  status?: number;
  createTime?: number;
  updateTime?: number | null;
  langPackageId?: number;
}

interface PackageData {
  packageId: number;
  name: string;
  langs: Language[];
}

const Package: React.FC = () => {
  // 基础版语言列表
  const [basicLanguages, setBasicLanguages] = useState<Language[]>([]);
  // 进阶版语言列表
  const [advancedLanguages, setAdvancedLanguages] = useState<Language[]>([]);
  // 高级版语言列表
  const [premiumLanguages, setPremiumLanguages] = useState<Language[]>([]);
  // 加载状态
  const [loading, setLoading] = useState(false);

  // 模态框状态
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPackageType, setCurrentPackageType] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  // 可选语言列表
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [loadingLanguages, setLoadingLanguages] = useState<boolean>(false);

  // 添加编辑状态控制
  const [editingPackage, setEditingPackage] = useState<string | null>(null);

  // 添加当前选中的包类型状态
  const [currentPackage, setCurrentPackage] = useState<'basic' | 'advanced' | 'premium'>('basic');
  
  // 添加模态框可见性状态
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // 添加表单实例
  const [form] = Form.useForm();

  // 获取语言包列表数据
  const fetchLanguagePackages = async () => {
    setLoading(true);
    try {
      const response = await langPackageList();
        console.log(response);
      if (response.code==='0') {
        // 处理返回的数据结构
        const packageData: PackageData[] = response.data;
        
        // 根据packageId分类处理数据
        packageData.forEach(pkg => {
          const languages = pkg.langs.map(lang => ({
            id: lang.langId,
            name: lang.remark || lang.lang,
            code: lang.langEncode,
            langPackageId: lang.langPackageId
          }));
          
          if (pkg.packageId === 1) {
            setBasicLanguages(languages);
          } else if (pkg.packageId === 2) {
            setAdvancedLanguages(languages);
          } else if (pkg.packageId === 3) {
            setPremiumLanguages(languages);
          }
        });
      } else {
        message.error('获取语言包列表失败');
      }
    } catch (error) {
      console.error('获取语言包列表出错:', error);
      message.error('获取语言包列表失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 获取所有可用语言列表
  const fetchAvailableLanguages = async () => {
    setLoadingLanguages(true);
    try {
      let data={
        pageNo:1,
        pageSize:10000
      }
      const response = await languageList(data);
      
      if (response.code==='0') {

        // 处理返回的语言数据，根据实际返回的数据结构调整
        const languages = response.data.map((lang: any) => ({
          id: lang.id,  // 使用id而不是langId
          name: lang.remark || lang.lang,
          code: lang.langEncode,
          lang: lang.lang,
          remark: lang.remark,
          status: lang.status,
          createTime: lang.createTime,
          updateTime: lang.updateTime
        }));
        
        setAvailableLanguages(languages);
      } else {
        message.error('获取可用语言列表失败');
      }
    } catch (error) {
      console.error('获取可用语言列表出错:', error);
      message.error('获取可用语言列表失败，请重试');
    } finally {
      setLoadingLanguages(false);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    fetchLanguagePackages();
  }, []);

  // 移除语言标签
  const removeLanguage = (packageType: string, id: number) => {
    if (packageType === 'basic') {
      setBasicLanguages(basicLanguages.filter(lang => lang.id !== id));
    } else if (packageType === 'advanced') {
      setAdvancedLanguages(advancedLanguages.filter(lang => lang.id !== id));
    } else if (packageType === 'premium') {
      setPremiumLanguages(premiumLanguages.filter(lang => lang.id !== id));
    }
  };

  // 切换编辑模式
  const toggleEditMode = (packageType: string) => {
    if (editingPackage === packageType) {
      // 如果当前已经在编辑这个包，则保存并退出编辑模式

      setEditingPackage(null);
    } else {
      // 进入编辑模式
      setEditingPackage(packageType);
    }
  };

  // 渲染语言标签
  const renderLanguageTags = (packageType: string, languages: Language[]) => {
    const isEditing = editingPackage === packageType;
    
    return (
      <>
        {languages.map(lang => (
          <Tag 
            key={lang.id} 
            closable={isEditing}
            closeIcon={isEditing ? <CloseOutlined /> : null}
            onClose={() => removeLanguage(packageType, lang.id)}
            style={{ margin: '5px' }}
          >
            {lang.name}
          </Tag>
        ))}
        {isEditing && (
          <Tag 
            style={{ margin: '5px', borderStyle: 'dashed' }}
            onClick={() => showAddLanguageModal(packageType as 'basic' | 'advanced' | 'premium')}
          >
            <PlusOutlined /> 添加
          </Tag>
        )}
      </>
    );
  };

  // 显示添加语言模态框
  const showAddLanguageModal = (packageType: 'basic' | 'advanced' | 'premium') => {
    setCurrentPackage(packageType);
    // 获取可用语言列表
    fetchAvailableLanguages();
    setModalVisible(true);
  };

  // 过滤已添加的语言，只显示未添加的语言
  const getFilteredLanguages = () => {
    // 获取当前包已有的语言ID
    let currentLanguageIds: number[] = [];
    if (currentPackage === 'basic') {
      currentLanguageIds = basicLanguages.map(lang => lang.id || 0);
    } else if (currentPackage === 'advanced') {
      currentLanguageIds = advancedLanguages.map(lang => lang.id || 0);
    } else if (currentPackage === 'premium') {
      currentLanguageIds = premiumLanguages.map(lang => lang.id || 0);
    }
    
    // 过滤出未添加的语言
    return availableLanguages.filter(lang => !currentLanguageIds.includes(lang.id || 0));
  };

  // 处理模态框确认
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const selectedLanguageId = values.languageId;
      
      // 查找选中的语言详情
      const selectedLanguage = availableLanguages.find(lang => lang.id === selectedLanguageId);
      
      if (!selectedLanguage) {
        message.error('未找到选中的语言');
        return;
      }
      
      // 确定当前包的packageId
      const packageId = currentPackage === 'basic' ? 1 : currentPackage === 'advanced' ? 2 : 3;
      
      // 获取当前已有的语言ID列表
      let currentLanguageIds: number[] = [];
      if (currentPackage === 'basic') {
        currentLanguageIds = basicLanguages.map(lang => lang.id || 0);
      } else if (currentPackage === 'advanced') {
        currentLanguageIds = advancedLanguages.map(lang => lang.id || 0);
      } else if (currentPackage === 'premium') {
        currentLanguageIds = premiumLanguages.map(lang => lang.id || 0);
      }
      
      // 添加新选择的语言ID
      const updatedLanguageIds = [...currentLanguageIds, selectedLanguageId];
      
      let data={
        packageId:packageId,
        langId:selectedLanguageId
      }

      const response = await saveLangPackage(data);
      
      if (response.code==='0') {
        message.success(`已添加语言到${currentPackage === 'basic' ? '基础版' : currentPackage === 'advanced' ? '进阶版' : '高级版'}`);
        
        // 创建要添加的语言对象（用于本地状态更新）
        const newLanguage = {
          id: selectedLanguage.id,
          name: selectedLanguage.remark || selectedLanguage.lang,
          code: selectedLanguage.langEncode,
          lang: selectedLanguage.lang
        };
        
        // 更新本地状态
        if (currentPackage === 'basic') {
          setBasicLanguages([...basicLanguages, newLanguage]);
        } else if (currentPackage === 'advanced') {
          setAdvancedLanguages([...advancedLanguages, newLanguage]);
        } else if (currentPackage === 'premium') {
          setPremiumLanguages([...premiumLanguages, newLanguage]);
        }
        
        // 重新获取最新数据
        fetchLanguagePackages();
        
        // 关闭模态框并重置表单
        setModalVisible(false);
        form.resetFields();
      } else {
        message.error(response?.message || '保存失败');
      }
    } catch (error) {
      console.error('添加语言出错:', error);
      message.error('添加语言失败，请重试');
    }
  };

  // 处理模态框取消
  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  // 保存语言包配置
  const savePackageConfig = async (packageType: string) => {
    try {
      // 确定当前包的packageId
      const packageId = packageType === 'basic' ? 1 : packageType === 'advanced' ? 2 : 3;
      
      // 获取当前已有的语言ID列表
      let languageIds: number[] = [];
      if (packageType === 'basic') {
        languageIds = basicLanguages.map(lang => lang.id || 0);
      } else if (packageType === 'advanced') {
        languageIds = advancedLanguages.map(lang => lang.id || 0);
      } else if (packageType === 'premium') {
        languageIds = premiumLanguages.map(lang => lang.id || 0);
      }


    } catch (error) {
      console.error('保存语言包配置出错:', error);
      message.error('保存失败，请重试');
    }
  };

  return (
    <PageContainer>
      {/* 基础版套餐 */}
      <Card 
        title={<Space><span>基础版</span></Space>} 
        style={{ marginBottom: 24 }}
        extra={<Space>
          <Button 
            type="primary" 
            onClick={() => toggleEditMode('basic')}
          >
            {editingPackage === 'basic' ? '保存' : '修改'}
          </Button>
        </Space>}
        loading={loading}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', backgroundColor: 'white' }}>
          {renderLanguageTags('basic', basicLanguages)}
        </div>
      </Card>

      {/* 进阶版套餐 */}
      <Card 
        title={<Space><span>进阶版</span></Space>} 
        style={{ marginBottom: 24 }}
        extra={<Space>
          <Button 
            type="primary" 
            onClick={() => toggleEditMode('advanced')}
          >
            {editingPackage === 'advanced' ? '保存' : '修改'}
          </Button>
        </Space>}
        loading={loading}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', backgroundColor: 'white' }}>
          {renderLanguageTags('advanced', advancedLanguages)}
        </div>
      </Card>

      {/* 高级版套餐 */}
      <Card 
        title={<Space><span>高级版</span></Space>} 
        style={{ marginBottom: 24 }}
        extra={<Button 
          type="primary" 
          onClick={() => toggleEditMode('premium')}
        >
          {editingPackage === 'premium' ? '保存' : '修改'}
        </Button>}
        loading={loading}
      >
        <Row>
          <Col span={24}>
            <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 16, gap: '8px', backgroundColor: 'white' }}>
              {renderLanguageTags('premium', premiumLanguages.slice(0, 8))}
            </div>
          </Col>
          <Col span={24}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', backgroundColor: 'white' }}>
              {premiumLanguages.slice(8).map(lang => (
                <Tag key={lang.id} style={{ margin: '5px' }}>
                  {lang.name}
                </Tag>
              ))}
            </div>
          </Col>
        </Row>
      </Card>

      {/* 添加语言模态框 */}
      <Modal
        title={`添加${currentPackage === 'basic' ? '基础版' : currentPackage === 'advanced' ? '进阶版' : '高级版'}语言`}
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            取消
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={loadingLanguages}
            onClick={handleModalOk}
          >
            添加
          </Button>,
        ]}
      >
        <Spin spinning={loadingLanguages}>
          <Form form={form} layout="vertical">
            <Form.Item
              name="languageId"
              label="选择语言"
              rules={[{ required: true, message: '请选择要添加的语言' }]}
            >
              <Select placeholder="请选择语言">
                {getFilteredLanguages().map(lang => (
                  <Option key={lang.id} value={lang.id}>
                    {lang.lang} ({lang.name})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </PageContainer>
  );
};

export default Package;