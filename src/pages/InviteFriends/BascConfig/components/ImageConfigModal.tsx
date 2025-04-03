import React from 'react';
import { Modal, Button, Image, Input } from 'antd';
import LanguageSelector from '@/components/LanguageSelector';
import AvatarUpload from "@/components/AvatarUpload/index";
import { divide } from 'lodash';

interface ImageConfigModalProps {
    visible: boolean;
    onCancel: () => void;
    onSave: () => void;
    language: string;
    onLanguageChange: (value: string) => void;
    imagesConfig?: Record<string, { backgroundImage: string, posterImage: string }>;
    onBackgroundImageChange: (url: string) => void;
    onPosterImageChange: (url: string) => void;
}

const ImageConfigModal: React.FC<ImageConfigModalProps> = ({
    visible,
    onCancel,
    onSave,
    language,
    imagesConfig,
    onBackgroundImageChange,
}) => {
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
                    <Button key="save" type="primary" onClick={onSave}>
                        保存
                    </Button>
                </div>

            ]}
            width={400}
        >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    语言： <Input disabled={true} style={{ width: '200px' }} value={language}></Input>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: 20 }}>
                    <div style={{ marginRight: 20, marginBottom: 20 }}>


                        <div style={{ marginTop: 10 }}>
                            <AvatarUpload/>
                            <p>建议尺寸1236*452</p>
                        </div>
                    </div>

                    <div style={{ marginTop: 0 }}>

                        <div style={{ marginTop: 10 }}>
                            <AvatarUpload />
                            <p>建议尺寸856*452</p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ImageConfigModal;