import AvatarUpload from '@/components/AvatarUpload/index';
import { pcAccessPathAll } from '@/services/ant-design-pro/WebConfig';
import { Button, Flex, Form, Image, Input, Modal, Radio, Select, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
const { Option } = Select;

interface AddMenuModalsProps {
  editingMenu: any;
  visible: boolean;
  parentId: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const AddMenuModals: React.FC<AddMenuModalsProps> = ({
  visible,
  onSubmit,
  onCancel,
  parentId,
  editingMenu,
}) => {
  const [accessType, setAccessType] = useState('1');
  const [formModal3] = Form.useForm();
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [displayType, setDisplayType] = useState('vertical'); // 默认选中"竖排"
  const [typeId, setTypeId] = useState<number>(1); // Default to 1 (标签) for new form instances
  const [accessPaths, setAccessPaths] = useState<any[]>([]);
  // displayStatus - default to 1 (enabled)
  const [displayStatus, setDisplayStatus] = useState(1);
  const tops = selectedStyle === 'custom' ? 80 : 20;
  const iconNew =
    'https://meta2025.oss-ap-northeast-2.aliyuncs.com/2025/02/20/c667acb2-89a1-407c-9e03-3017eb222f7f.png';
  const iconHot =
    'https://meta2025.oss-ap-northeast-2.aliyuncs.com/2025/02/20/3dbef6d2-b329-4770-89ce-6ebdd67f4df8.png';
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [iconUrlDay, setIconUrlDay] = useState<string | null>(null);
  const [iconUrlNight, setIconUrlNight] = useState<string | null>(null);
  console.log(parentId);
  // 当visible或parentId变化时重新初始化表单
  useEffect(() => {
    if (visible) {
      if (!parentId) {
        setTypeId(2); // 如果没有parentId，设置为菜单模式
      } else {
        setTypeId(1); // 如果有parentId，设置为标签模式
      }
      formModal3.setFieldsValue({ parentId: parentId?.menuName });
    }
  }, [visible, parentId]);
  
  // 监听typeId变化，便于调试
  useEffect(() => {
    console.log('typeId changed to:', typeId);
  }, [typeId]);

  // 获取访问路径数据
  useEffect(() => {
    const fetchAccessPaths = async () => {
      try {
        const result = await pcAccessPathAll();
        if (result.code === '0' && result.data) {
          setAccessPaths(JSON.parse(result.data));
        }
      } catch (error) {
        console.error('获取访问路径失败:', error);
      }
    };

    fetchAccessPaths();
    if (editingMenu) {
      // 正确处理嵌套的数据结构
      const { homeMenu, homeMenuTranslation } = editingMenu;

      // 设置状态变量
      setTypeId(homeMenu.typeId);
      setAccessType(homeMenu.accessType || '1');
      setDisplayType(homeMenu.spreadPattern?.toString() || '0');
      setDisplayStatus(homeMenu.displayStatus ?? 1);

      // 设置图标状态
      setIconUrlDay(homeMenu.iconUrlDay);
      setIconUrlNight(homeMenu.iconUrlNight);
      setUploadedImageUrl(homeMenu.cornerMarkOne);

      if (homeMenu.cornerMarkOne) {
        setSelectedStyle('custom');
      }

      // 填充表单数据
      formModal3.setFieldsValue({
        typeId: homeMenu.typeId,
        menuName: homeMenuTranslation.menuName,
        menuViceName: homeMenuTranslation.menuViceName,
        menuDescription: homeMenu.menuDescription,
        accessPath: homeMenu.accessPath,
        spreadPattern: homeMenu.spreadPattern?.toString(),
        displayStatus: homeMenu.displayStatus === 1,
      });
    }
  }, [editingMenu]);

  const handleImageChange = (url: string | null) => {
    setUploadedImageUrl(url);
  };

  const handleDayChange = (url: string | null) => {
    setIconUrlDay(url);
  };

  const handleNightChange = (url: string | null) => {
    setIconUrlNight(url);
  };

  const handleCancelAndReset = () => {
    // 重置所有状态
    setIconUrlDay(null);
    setIconUrlNight(null);
    setUploadedImageUrl(null);
    setSelectedStyle(null);
    setAccessType('1');
    setDisplayType('vertical');
    setTypeId(1);
    formModal3.resetFields();
    // 调用传入的onCancel函数
    onCancel();
  };

  const onFinish = async (values: any) => {
    // Ensure displayStatus is set to 1 by default if not provided
    if (values.displayStatus === undefined) {
      values.displayStatus = 1;
    } else {
      values.displayStatus = values.displayStatus ? 1 : 0;
    }

    let data = {
      values,
      uploadedImageUrl,
      iconUrlDay,
      iconUrlNight,
    };

    // if (typeId === 1) {
    //   // 仅提交标签相关字段
    //   data = {

    //   };
    // } else {
    //   // 菜单相关字段
    //   data = {
    //     values,
    //     uploadedImageUrl,
    //     iconUrlDay,
    //     iconUrlNight,
    //   };
    // }
    setIconUrlDay(null);
    setIconUrlNight(null);
    setUploadedImageUrl(null);
    formModal3.resetFields();
    onSubmit(data);
  };

  return (
    <Modal title={editingMenu ? '编辑菜单' : '添加菜单'} visible={visible} onCancel={handleCancelAndReset} footer={null}>
      <Form form={formModal3} layout="vertical" onFinish={onFinish}>
        {/* 标签/菜单选择 */}
        {parentId && (
          <Form.Item label="标签/菜单" rules={[{ required: true, message: '请选择类型' }]} name="typeId">
            <Radio.Group
              onChange={(e) => {
                setTypeId(e.target.value);
              }}
              value={typeId}
            >
              <Radio value={1}>标签</Radio>
              <Radio value={2}>菜单</Radio>
            </Radio.Group>
          </Form.Item>
        )}

        {typeId === 2 && parentId && (
          <Form.Item label="父级菜单" name="parentId">
            <Input disabled />
          </Form.Item>
        )}

        {/* 动态渲染字段 */}
        {typeId === 1 ? (
          <>
            {/* 标签模式：只显示展现形式和标签名 */}
            {/* <Form.Item
              label="展现形式"
              name="spreadPattern"
              rules={[{ required: true, message: '请选择展现形式' }]}
            >
              <Radio.Group value={displayType} onChange={(e) => setDisplayType(e.target.value)}>
                <Radio value="0">
                  竖排 <a style={{ color: '#1890ff', marginLeft: 4 }}>查看示例图</a>
                </Radio>
                <Radio value="1">
                  横排 <a style={{ color: '#1890ff', marginLeft: 4 }}>查看示例图</a>
                </Radio>
              </Radio.Group>
            </Form.Item> */}
            <Form.Item
              label="标签名"
              name="menuName"
              rules={[{ required: true, message: '请输入标签名' }]}
            >
              <Input placeholder="标签" />
            </Form.Item>
          </>
        ) : (
          <>
            {/* 菜单模式：显示所有字段 */}
            <Form.Item
              label="主标题"
              name="menuName"
              rules={[{ required: true, message: '请输入菜单名称' }]}
            >
              <Input placeholder="菜单名称" />
            </Form.Item>
            <Form.Item
              label="副标题"
              name="menuViceName"
              rules={[{ required: true, message: '请输入副标题' }]}
            >
              <Input placeholder="副标题" />
            </Form.Item>
            <Form.Item label="菜单描述" name="menuDescription">
              <Input placeholder="菜单描述" />
            </Form.Item>
            <Form.Item label="访问路径">
              <Radio.Group value={accessType} onChange={(e) => setAccessType(e.target.value)}>
                <Radio value="1">PC功能</Radio>
                <Radio value="2">自定义URL</Radio>
              </Radio.Group>
              {accessType === '1' ? (
                <Form.Item name="accessPath" style={{ marginTop: 10 }}>
                  <Select placeholder="请选择">
                    {accessPaths.map((item) => (
                      <Option key={item.accessPath} value={item.accessPath}>
                        {item.functionName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : (
                <Form.Item name="accessPath" style={{ marginTop: 10 }}>
                  <Input placeholder="请输入URL" />
                </Form.Item>
              )}
            </Form.Item>
            {parentId && (
              <Form.Item label="icon">
                <Flex gap="middle" wrap>
                  <div>
                    <div style={{ textAlign: 'center' }}>夜间</div>
                    <AvatarUpload onChange={handleDayChange} value={iconUrlNight} />
                    <div style={{ fontSize: 12, color: '#999' }}>
                      请上传小于500k
                      <br />
                      142*72png图片
                    </div>
                  </div>
                  <div>
                    <div style={{ textAlign: 'center' }}>日间</div>
                    <AvatarUpload onChange={handleNightChange} value={iconUrlDay} />
                    <div style={{ fontSize: 12, color: '#999' }}>
                      请上传小于500k
                      <br />
                      142*72png图片
                    </div>
                  </div>
                </Flex>
              </Form.Item>
            )}

            <Form.Item label="角标">
              <Radio.Group value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)}>
                <Radio value="new">样式一</Radio>
                <Radio value="hot">样式二</Radio>
                <Radio value="custom">使用自定义</Radio>
              </Radio.Group>
              <div style={{ marginTop: 10, height: 40 }}>
                {selectedStyle === 'new' && <Image src={iconNew} width={40} height={20} />}
                {selectedStyle === 'hot' && <Image src={iconHot} width={24} height={24} />}
                {selectedStyle === 'custom' && <AvatarUpload onChange={handleImageChange} />}
              </div>
              {selectedStyle === 'custom' && (
                <div style={{ fontSize: 12, color: '#999' }}>
                  请上传小于500k
                  <br />
                  142*72png图片
                </div>
              )}
            </Form.Item>
            <Form.Item label="是否显示" name="displayStatus" style={{ marginTop: tops }}>
              <Switch onChange={(checked) => setDisplayStatus(checked ? 1 : 0)} checked={displayStatus === 1} />
            </Form.Item>
          </>
        )}

        <Form.Item style={{ textAlign: 'center' }}>
          <Button onClick={handleCancelAndReset}>取消</Button>
          <Button type="primary" htmlType="submit" style={{ marginLeft: 10 }}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddMenuModals;
