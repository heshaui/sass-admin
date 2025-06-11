import React, { useState, useEffect } from "react";
import { Modal, Select, Button, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { saveLang, addLangList } from "@/services/ant-design-pro/WebConfig";
import { useIntl } from 'umi';
const { Option } = Select;

interface AddModalProps {
  onSuccess?: () => void; // 添加成功后的回调函数
  existingLanguages: string[];
}

const AddModal: React.FC<AddModalProps> = ({ onSuccess, existingLanguages = [] }) => {
  const intl = useIntl();
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
        // Pass empty object as parameter to fix TypeScript error
        const response = await addLangList({});
        if (response.code === "0") {
            // Ensure we're setting an array
            setDataSource(Array.isArray(response.data) ? response.data : []);
        } else {
            message.error(intl.formatMessage({ id: 'language.message.get.language.failed' }, { message: response.message }));
        }
        } catch (error) {
            message.error(intl.formatMessage({ id: 'language.message.request.failed' }));
        }
    };



  // Handle form submission
  const handleAdd = async () => {
    if (language && language.length > 0) {
      try {
        // 将选择的ID数组转换为后端需要的数据格式
        const tenantLangs = language.map(langId => {
          // Find the corresponding language object from dataSource
          const langItem = dataSource.find(item => item.id === langId);
          return {
            langId: langId,
            langEncode: langItem?.langEncode,
            lang: langItem?.lang // Include item.lang in the submission
          };
        });
        
        // Cast to any to bypass TypeScript type checking for the API call
        const data: any = {
          tenantLangs: tenantLangs
        };
        
        const res = await saveLang(data);
        if (res.code === '0') {
          message.success(intl.formatMessage({ id: 'language.message.add.success' }));
          // 调用成功回调函数
          if (onSuccess) {
            onSuccess();
          }
          setIsModalVisible(false);
          setLanguage([]);
        } else {
          message.error(intl.formatMessage({ id: 'language.message.add.failed' }, { message: res.message }));
        }
      } catch (error) {
        console.log(error)
        message.error(intl.formatMessage({ id: 'language.message.request.failed' }));
      }
    } else {
      message.warning(intl.formatMessage({ id: 'language.message.select.language' }));
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
        {intl.formatMessage({ id: 'language.button.add' })} {intl.formatMessage({ id: 'language.column.language' })}
      </Button>

      <Modal
        title={intl.formatMessage({ id: 'language.modal.add.title' })}
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
              {intl.formatMessage({ id: 'language.form.select.language' })}
            </label>
            <Select
              mode="multiple"
              placeholder={intl.formatMessage({ id: 'language.form.placeholder.select' })}
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
              {intl.formatMessage({ id: 'language.button.cancel' })}
            </Button>
            <Button
              type="primary"
              onClick={handleAdd}
              style={{ backgroundColor: "#FF7F50", borderColor: "#FF7F50", borderRadius: "20px" }}
            >
              {intl.formatMessage({ id: 'language.button.add' })}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddModal;