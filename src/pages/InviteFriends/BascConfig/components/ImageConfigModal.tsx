import React, { useState } from 'react';
import { Modal, Button, Select } from 'antd';
import { useIntl } from 'umi';
import AvatarUpload from "@/components/AvatarUpload/index";


interface ImageConfigModalProps {
    visible: boolean;
    onCancel: () => void;
    onSave: (backgroundImage: string, posterImage: string) => void;
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
    const intl = useIntl();

const [backgroundImage,setBackgroundImage]=useState('');
const [posterImage,setPosterImage]=useState('');

// 初始化使用imagesConfig中的数据
React.useEffect(() => {
    if (imagesConfig && imagesConfig[language]) {
        setBackgroundImage(imagesConfig[language].backgroundImage || '');
        setPosterImage(imagesConfig[language].posterImage || '');
    }
}, [imagesConfig, language]);

// 添加安全访问方法
const getBackgroundImageValue = () => {
    return imagesConfig && imagesConfig[language] ? imagesConfig[language].backgroundImage || '' : '';
};

const getPosterImageValue = () => {
    return imagesConfig && imagesConfig[language] ? imagesConfig[language].posterImage || '' : '';
};

    return (
        <Modal
            title={intl.formatMessage({ id: 'inviteFriends.imageConfigModal.title' })}
            open={visible}
            onCancel={onCancel}
            footer={[
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button key="cancel" onClick={onCancel} style={{ marginRight: '20px' }}>
                        {intl.formatMessage({ id: 'inviteFriends.imageConfigModal.cancel' })}
                    </Button>
                    <Button key="save" type="primary" onClick={()=>{onSave(backgroundImage,posterImage)}}>
                        {intl.formatMessage({ id: 'inviteFriends.imageConfigModal.save' })}
                    </Button>
                </div>

            ]}
            width={400}
        >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    {intl.formatMessage({ id: 'inviteFriends.imageConfigModal.language' })} <Select value={language} disabled={true} >
                         <Select.Option value="zh_CN">{intl.formatMessage({ id: 'inviteFriends.imageConfigModal.language.zhCN' })}</Select.Option>
                        <Select.Option value="zh_TW">{intl.formatMessage({ id: 'inviteFriends.imageConfigModal.language.zhTW' })}</Select.Option>
                        <Select.Option value="en_US">{intl.formatMessage({ id: 'inviteFriends.imageConfigModal.language.enUS' })}</Select.Option>
                        <Select.Option value="ja_JP">{intl.formatMessage({ id: 'inviteFriends.imageConfigModal.language.jaJP' })}</Select.Option>
                        <Select.Option value="ko_KR">{intl.formatMessage({ id: 'inviteFriends.imageConfigModal.language.koKR' })}</Select.Option>
                    </Select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: 20 }}>
                    <div style={{ marginRight: 20, marginBottom: 20 }}>


                        <div style={{ marginTop: 10 }}>
                            <AvatarUpload onChange={(url)=>{setBackgroundImage(url)}} value={getBackgroundImageValue()}/>
                            <p>{intl.formatMessage({ id: 'inviteFriends.imageConfigModal.backgroundSize' })}</p>
                        </div>
                    </div>

                    <div style={{ marginTop: 0 }}>

                        <div style={{ marginTop: 10 }}>
                            <AvatarUpload onChange={(url)=>{setPosterImage(url)}} value={getPosterImageValue()}/>
                            <p>{intl.formatMessage({ id: 'inviteFriends.imageConfigModal.posterSize' })}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ImageConfigModal;