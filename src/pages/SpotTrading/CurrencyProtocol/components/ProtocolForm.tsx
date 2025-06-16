import React,{useState,useEffect} from 'react';
import { Form, Input } from 'antd';
import { protocolTypeParams } from '@/services/ant-design-pro/spot';
import { useIntl } from 'umi';



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
    const intl = useIntl();
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
        label={intl.formatMessage({ id: 'protocol.form.protocolName' })}
        rules={[{ required: true, message: intl.formatMessage({ id: 'protocol.form.protocolName.required' }) }]}
      >
        <Input placeholder={intl.formatMessage({ id: 'protocol.form.protocolName.placeholder' })} />
      </Form.Item>
      
      <Form.Item
        name="protocol"
        label={intl.formatMessage({ id: 'protocol.form.protocol' })}
        rules={[{ required: true, message: intl.formatMessage({ id: 'protocol.form.protocol.required' }) }]}
        extra={intl.formatMessage({ id: 'protocol.form.protocol.extra' })}
      >
        <Input placeholder={intl.formatMessage({ id: 'protocol.form.protocol.placeholder' })} />
      </Form.Item>
      
      <Form.Item
        name="browser"
        label={intl.formatMessage({ id: 'protocol.form.browser' })}
        rules={[{ required: true, message: intl.formatMessage({ id: 'protocol.form.browser.required' }) }]}
      >
        <Input placeholder={intl.formatMessage({ id: 'protocol.form.browser.placeholder' })} />
      </Form.Item>
      
      <Form.Item
        name="symbol"
        label={intl.formatMessage({ id: 'protocol.form.symbol' })}
        rules={[{ required: true, message: intl.formatMessage({ id: 'protocol.form.symbol.required' }) }]}
      >
        <Input placeholder={intl.formatMessage({ id: 'protocol.form.symbol.placeholder' })} />
      </Form.Item>
      
      <Form.Item
        name="chainId"
        label={intl.formatMessage({ id: 'protocol.form.chainId' })}
        rules={[{ required: true, message: intl.formatMessage({ id: 'protocol.form.chainId.required' }) }]}
      >
         <Input placeholder={intl.formatMessage({ id: 'protocol.form.chainId.placeholder' })} />
      </Form.Item>
    </Form>
  );
};

export default ProtocolForm; 