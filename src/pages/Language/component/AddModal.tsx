import React, { useState,useEffect } from "react";
import { Modal, Select, Button,message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import FileUpload from"@/components/FileUpload"
import { saveLang,addLangList} from "@/services/ant-design-pro/WebConfig";
const { Option } = Select;

const AddModal: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [language, setLanguage] = useState<string>("");

  // Show modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle modal close
  const handleCancel = () => {
    setIsModalVisible(false);
    setLanguage("");
  };


  const getLangList = async () => {
    try {
        let data={
            tenantId:1007
        }
        const response = await addLangList(data);
        if (response.code === "0") {
            setDataSource(response.data || []);
        } else {
            message.error(`获取语言列表失败: ${response.message}`);
        }
        } catch (error) {
            message.error("请求失败，请检查网络连接");
        }
    };

  // Handle form submission
  const handleAdd = async () => {
    if (language) {
    //   console.log("Added language:", language);
    //   setIsModalVisible(false);
    //   setLanguage("");
    const res=await saveLang()
    } else {
      alert("请选择语言!");
    }
  };

  // Handle language selection
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  useEffect(() => {
    getLangList();
  }
  , []);

  return (
    <>
      {/* Trigger button to open modal - you can customize this */}
      <Button type="primary" onClick={showModal}>
        添加语言
      </Button>

      <Modal
        title="添加语言"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        closeIcon={<CloseOutlined />}
        width={400}
        style={{ top: 20 }}
      >
        <div style={{ padding: "20px" }}>

          


          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              选择语言
            </label>
            <Select
              placeholder="请选择"
              value={language || undefined}
              onChange={handleLanguageChange}
              style={{ width: "100%" }}
            >
              <Option value="中文">中文</Option>
              <Option value="English">English</Option>
              <Option value="日本語">日本語</Option>
              <Option value="Español">Español</Option>
            </Select>
          </div>
          {/* <FileUpload/> */}

          <div style={{ display: "flex", justifyContent: "center",marginTop:"20px" }}>
            <Button onClick={handleCancel} style={{ borderRadius: "20px",marginRight: "20px" }}>
              取消
            </Button>
            <Button
              type="primary"
              onClick={handleAdd}
              style={{ backgroundColor: "#FF7F50", borderColor: "#FF7F50", borderRadius: "20px" }}
            >
              添加
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddModal;