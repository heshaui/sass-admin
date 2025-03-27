import React,{useState,useEffect} from 'react';
import { Form, Input } from 'antd';
import { protocolTypeParams } from '@/services/ant-design-pro/spot';



export interface ProtocolItem {
  id: number;
  name: string;
  currency: string;
  type: string;
  content: string;
  isActive: boolean;
  protocol?: string;
  explorer?: string;
  chainId?: string;
}

interface ProtocolFormProps {
  form: any;
  id?:number;
}

const ProtocolForm: React.FC<ProtocolFormProps> = ({ form, id }) => {
    console.log(id);
    const [protocol,setProtocol] = useState<ProtocolItem>();

    useEffect(()=>{
      if(id){
        protocolTypeParams({id:id}).then((res)=>{
            console.log(res);
            if(res.code === '0'){
                form.setFieldsValue(res.data);
            }
        });
      }
    },[id]);
  return (
    <Form
      form={form}
      layout="vertical"
    >
      
      <Form.Item
        name="protocolName"
        label="协议名称"
        rules={[{ required: true, message: '请输入协议名称' }]}
      >
        <Input placeholder="协议名称" />
      </Form.Item>
      
      <Form.Item
        name="protocol"
        label="代币协议"
        rules={[{ required: true, message: '请输入代币协议' }]}
        extra="如：ERC20"
      >
        <Input placeholder="代币协议" />
      </Form.Item>
      
      <Form.Item
        name="browser"
        label="区块浏览器"
        rules={[{ required: true, message: '请输入区块浏览器地址' }]}
      >
        <Input placeholder="1~1000个字符" />
      </Form.Item>
      
      <Form.Item
        name="symbol"
        label="主币名称"
        rules={[{ required: true, message: '请选择主币名称' }]}
      >
        <Input placeholder="主币名称" />
      </Form.Item>
      
      <Form.Item
        name="chainId"
        label="链ID"
        rules={[{ required: true, message: '请选择链ID' }]}
      >
         <Input placeholder="链ID" />
      </Form.Item>
    </Form>
  );
};

export default ProtocolForm; 