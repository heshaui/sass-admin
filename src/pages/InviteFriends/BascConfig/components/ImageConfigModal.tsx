import React, { useState } from 'react';
import { Modal, Button, Select } from 'antd';
import AvatarUpload from "@/components/AvatarUpload/index";


interface ImageConfigModalProps {
    visible: boolean;
    onCancel: () => void;
    onSave: () => void;
    language: string;
    imagesConfig:any;


}

const ImageConfigModal: React.FC<ImageConfigModalProps> = ({
    visible,
    onCancel,
    onSave,
    language,
    imagesConfig
}) => {

const [backgroundImage,setBackgroundImage]=useState('');
const [posterImage,setPosterImage]=useState('');


    return (
        <Modal
            title="邀请页面图片配置"
            open={visible}
            onCancel={onCancel}
            footer={[
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button key="cancel" onClick={onCancel} style={{ marginRight: '20px' }}>
                        取消
                    </Button>
                    <Button key="save" type="primary" onClick={()=>{onSave(backgroundImage,posterImage)}}>
                        保存
                    </Button>
                </div>

            ]}
            width={400}
        >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    语言： <Select value={language} disabled={true} >
                         <Select.Option value="zh_CN">简体中文</Select.Option>
                        <Select.Option value="zh_TW">繁体中文</Select.Option>
                        <Select.Option value="en_US">英文</Select.Option>
                        <Select.Option value="ja_JP">日语</Select.Option>
                        <Select.Option value="ko_KR">韩语</Select.Option>
                    </Select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: 20 }}>
                    <div style={{ marginRight: 20, marginBottom: 20 }}>


                        <div style={{ marginTop: 10 }}>
                            <AvatarUpload onChange={(url)=>{setBackgroundImage(url)}} value={imagesConfig[language].backgroundImage}/>
                            <p>建议尺寸1236*452</p>
                        </div>
                    </div>

                    <div style={{ marginTop: 0 }}>

                        <div style={{ marginTop: 10 }}>
                            <AvatarUpload onChange={(url)=>{setPosterImage(url)}} value={imagesConfig[language].posterImage}/>
                            <p>建议尺寸856*452</p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ImageConfigModal;