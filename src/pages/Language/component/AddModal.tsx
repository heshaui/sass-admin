import React, { useState,useEffect } from "react";
import { Modal, Select, Button,message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import FileUpload from"@/components/FileUpload"
import { saveLang,addLangList} from "@/services/ant-design-pro/WebConfig";
const { Option } = Select;

interface AddModalProps {
  onSuccess?: () => void; // 添加成功后的回调函数
  existingLanguages: string[];
}

const AddModal: React.FC<AddModalProps> = ({ onSuccess, existingLanguages = [] }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [language, setLanguage] = useState<string[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]); // 添加新的state

  // Show modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle modal close
  const handleCancel = () => {
    setIsModalVisible(false);
    setLanguage([]);
  };


  const getLangList = async () => {
    try {
          
        const response = await addLangList();
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
    if (language && language.length > 0) {
      try {
        // 将选择的ID数组转换为后端需要的数据格式
        const tenantLangs = language.map(langId => ({
          langId: langId
        }));
        
        const data = {
          tenantLangs: tenantLangs
        }
        
        const res = await saveLang(data);
        if (res.code === '0') {
          message.success('添加语言成功');
          // 调用成功回调函数
          if (onSuccess) {
            onSuccess();
          }
          setIsModalVisible(false);
          setLanguage([]);
        } else {
          message.error(`添加失败: ${res.message}`);
        }
      } catch (error) {
        console.log(error)
        message.error('请求失败，请检查网络连接');
      }
    } else {
      message.warning("请选择至少一种语言!");
    }
  };

// ... existing code ...

  // Handle language selection
  const handleLanguageChange = (value: string[]) => {
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
              mode="multiple"
              placeholder="请选择"
              value={language}
              onChange={handleLanguageChange}
              style={{ width: "100%" }}
            >
               {existingLanguages.length}
              {
               
                dataSource.map((item:any) => (
                  <Option 
                    key={item.id} 
                    value={item.id}
                    disabled={existingLanguages.includes(item.langEncode)}
                  >
                    {item.lang}
                  </Option>
                ))
              }
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