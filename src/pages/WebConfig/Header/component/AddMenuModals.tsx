import React, { useState,useEffect } from "react";
import { Modal, Form, Input, Button, Radio, Switch, Select, Image, Flex } from "antd";
import AvatarUpload from "@/components/AvatarUpload/index";
const { Option } = Select;

interface AddMenuModalsProps {
  visible: boolean;
  parentId: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const AddMenuModals: React.FC<AddMenuModalsProps> = ({ visible, onSubmit, onCancel,parentId }) => {
  const [accessType, setAccessType] = useState("1");
  const [formModal3] = Form.useForm();
  const [selectedStyle, setSelectedStyle] = useState("new");
  const [displayType, setDisplayType] = useState("vertical"); // 默认选中“竖排”
    const [typeId, setTypeId] = useState<number>(1);

  const tops = selectedStyle === "custom" ? 80 : 20;
  const iconNew = "https://meta2025.oss-ap-northeast-2.aliyuncs.com/2025/02/20/c667acb2-89a1-407c-9e03-3017eb222f7f.png";
  const iconHot = "https://meta2025.oss-ap-northeast-2.aliyuncs.com/2025/02/20/3dbef6d2-b329-4770-89ce-6ebdd67f4df8.png";
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [iconUrlDay, setIconUrlDay] = useState<string | null>(null);
  const [iconUrlNight, setIconUrlNight] = useState<string | null>(null);
  useEffect(() => {
    formModal3.setFieldsValue({ parentId: parentId?.menuName });
  }
  ,[parentId])
 
  const handleImageChange = (url: string | null) => {
    setUploadedImageUrl(url);
  };

  const handleDayChange = (url: string | null) => {
    setIconUrlDay(url);
  };

  const handleNightChange = (url: string | null) => {
    setIconUrlNight(url);
  };

  const onFinish = async (values: any) => {
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
    <Modal title="添加菜单" visible={visible} onCancel={onCancel} footer={null}>
      <Form form={formModal3} layout="vertical" onFinish={onFinish}>
        {/* 标签/菜单选择 */}
        <Form.Item label="标签/菜单" name="typeId" rules={[{ required: true, message: "请选择类型" }]}>
          <Radio.Group value={typeId} defaultValue={1}
            onChange={(e) => setTypeId(e.target.value)}>
            <Radio value={1}>标签</Radio>
            <Radio value={2}>菜单</Radio>
          </Radio.Group>
        </Form.Item>
        {
            typeId === 2&&parentId&&<Form.Item
            label="父级菜单"
            name="parentId"
           
          >
            <Input disabled />
      </Form.Item>
        }
        
        {/* 动态渲染字段 */}
        {typeId === 1 ? (
          <>
            {/* 标签模式：只显示展现形式和标签名 */}
            <Form.Item
              label="展现形式"
              name="spreadPattern"
              rules={[{ required: true, message: "请选择展现形式" }]}
            >
            <Radio.Group
                value={displayType}
                onChange={(e) => setDisplayType(e.target.value)}
              >
                <Radio value="0">
                  竖排{" "}
                  <a style={{ color: "#1890ff", marginLeft: 4 }}>查看示例图</a>
                </Radio>
                <Radio value="1">
                  横排{" "}
                  <a style={{ color: "#1890ff", marginLeft: 4 }}>查看示例图</a>
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="标签名"
              name="menuName"
              rules={[{ required: true, message: "请输入标签名" }]}
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
              rules={[{ required: true, message: "请输入菜单名称" }]}
            >
              <Input placeholder="菜单名称" />
            </Form.Item>
            <Form.Item
              label="副标题"
              name="menuViceName"
              rules={[{ required: true, message: "请输入副标题" }]}
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
              {accessType === "1" ? (
                <Form.Item name="accessPath" style={{ marginTop: 10 }}>
                  <Select placeholder="请选择">
                    <Option value="0">选项0</Option>
                    <Option value="1">选项1</Option>
                    <Option value="2">选项2</Option>
                  </Select>
                </Form.Item>
              ) : (
                <Form.Item name="accessPath" style={{ marginTop: 10 }}>
                  <Input placeholder="请输入URL" />
                </Form.Item>
              )}
            </Form.Item>
            <Form.Item label="icon">
              <Flex gap="middle" wrap>
                <div>
                  <div style={{ textAlign: "center" }}>夜间</div>
                  <AvatarUpload onChange={handleDayChange} />
                </div>
                <div>
                  <div style={{ textAlign: "center" }}>日间</div>
                  <AvatarUpload onChange={handleNightChange} />
                </div>
              </Flex>
            </Form.Item>
            <Form.Item label="角标">
              <Radio.Group value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)}>
                <Radio value="new">样式一</Radio>
                <Radio value="hot">样式二</Radio>
                <Radio value="custom">使用自定义</Radio>
              </Radio.Group>
              <div style={{ marginTop: 10, height: 40 }}>
                {selectedStyle === "new" && <Image src={iconNew} width={40} height={20} />}
                {selectedStyle === "hot" && <Image src={iconHot} width={24} height={24} />}
                {selectedStyle === "custom" && <AvatarUpload onChange={handleImageChange} />}
              </div>
            </Form.Item>
            <Form.Item label="是否显示" name="displayStatus" style={{ marginTop: tops }}>
              <Switch />
            </Form.Item>
          </>
        )}

        <Form.Item style={{ textAlign: "center" }}>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" htmlType="submit" style={{ marginLeft: 10 }}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddMenuModals;