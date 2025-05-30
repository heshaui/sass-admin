import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Switch, Button, Radio, Select } from 'antd';
import { useIntl } from 'umi';
import { saveHomeBottom, pcAccessPathAll,updateHomeBottomById,updateHomeBottomTranslationById} from '@/services/ant-design-pro/WebConfig';

const { Option } = Select;

interface AddMenuModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  parentId?: any;
  editingMenu?: any;
}

const AddMenuModal: React.FC<AddMenuModalProps> = ({ open, onCancel, onSubmit, parentId, editingMenu }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [accessType, setAccessType] = useState("1");
  const [pcOptions, setPcOptions] = useState<any[]>([]);

  useEffect(() => { 
    const fetchPcOptions = async () => {
      try {
        const result = await pcAccessPathAll();
        if (result.code === '0' && result.data) {
          const options = JSON.parse(result.data);
          setPcOptions(options);
        }
      } catch (error) {
        console.error(intl.formatMessage({ id: 'webConfig.footer.fetchPcOptionsFailed' }), error);
      }
    };
    
    fetchPcOptions();
    console.log("editingMenu", editingMenu);
    console.log("parentId", parentId);
    if (editingMenu || parentId) {
      const formValues = {
        bottomName: parentId?.bottomName,
        menuName: editingMenu?.homeBottomTranslation?.bottomName,
        accessPath: editingMenu?.homeBottom?.accessPath,
        // Add null check for accessType to prevent toString() on null
        accessType: editingMenu?.homeBottom?.accessType ? editingMenu.homeBottom.accessType.toString() : "1",
        show: editingMenu?.homeBottom?.show,
        orderIndex: editingMenu?.homeBottom?.orderIndex,
        parentId: editingMenu?.homeBottom?.parentId,
        languagePath: editingMenu?.homeBottomTranslation?.languagePath,
        menuId: editingMenu?.homeBottomTranslation?.menuId,
        languageCode: editingMenu?.homeBottomTranslation?.languageCode,
        languageIcon: editingMenu?.homeBottomTranslation?.languageIcon,
      };
      
      form.setFieldsValue({ values: formValues });
    }
  }, [form, parentId, editingMenu]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={editingMenu ? intl.formatMessage({ id: 'webConfig.footer.modal.editTitle' }) : intl.formatMessage({ id: 'webConfig.footer.modal.addTitle' })}
      open={open}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        onFinish={onSubmit}
        layout="vertical"
        initialValues={{
          values: {
            accessType: "1",
            displayStatus: true
          }
        }}
      >
        <Form.Item
          label={intl.formatMessage({ id: 'webConfig.footer.modal.menuName' })}
          name={['values', 'menuName']}
          rules={[{ required: true, message: intl.formatMessage({ id: 'webConfig.footer.modal.menuNameRequired' }) }]}
        >
          <Input placeholder={intl.formatMessage({ id: 'webConfig.footer.modal.menuNamePlaceholder' })} />
        </Form.Item>
        { parentId && (
        <Form.Item
          label={intl.formatMessage({ id: 'webConfig.footer.modal.parentMenu' })}
          name={['values', 'bottomName']}
        >
          <Input placeholder={intl.formatMessage({ id: 'webConfig.footer.modal.parentMenuPlaceholder' })} disabled={true}/>
        </Form.Item> 
       
        )}
        <Form.Item label={intl.formatMessage({ id: 'webConfig.footer.modal.redirectAddress' })}>
          <Form.Item
            name={['values', 'accessType']}
            noStyle
          >
            <Radio.Group onChange={(e) => setAccessType(e.target.value)}>
              <Radio value="1">{intl.formatMessage({ id: 'webConfig.footer.modal.pcFunction' })}</Radio>
              <Radio value="2">{intl.formatMessage({ id: 'webConfig.footer.modal.customUrl' })}</Radio>
            </Radio.Group>
          </Form.Item>
          
          {accessType === "1" ? (
            <Form.Item 
              name={['values', 'accessPath']} 
              style={{ marginTop: 10 }}
            >
              <Select placeholder={intl.formatMessage({ id: 'webConfig.footer.modal.selectPlaceholder' })}>
                {Array.isArray(pcOptions) && pcOptions.map(option => (
                  <Option key={option.accessPath} value={option.accessPath}>
                    {option.functionName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          ) : (
            <Form.Item 
              name={['values', 'accessPath']} 
              style={{ marginTop: 10 }}
            >
              <Input placeholder={intl.formatMessage({ id: 'webConfig.footer.modal.urlPlaceholder' })} />
            </Form.Item>
          )}
        </Form.Item>
        
        <Form.Item
          label={intl.formatMessage({ id: 'webConfig.footer.modal.display' })}
          name={['values', 'show']}
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>
        
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={handleCancel}>{intl.formatMessage({ id: 'webConfig.footer.modal.cancel' })}</Button>
            <Button type="primary" htmlType="submit">
              {intl.formatMessage({ id: 'webConfig.footer.modal.submit' })}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddMenuModal; 