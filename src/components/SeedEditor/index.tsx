import '@wangeditor/editor/dist/css/style.css'; // 引入 CSS
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import { ossImgFile,uploadFile } from '@/services/ant-design-pro/api';
import { getLocale,useIntl } from '@umijs/max';


interface SeedEditorProps {
  initialContent?: string; // 初始内容
  onChange?: (content: string) => void; // 内容变化回调
}

// 使用 forwardRef 让父组件能够访问编辑器的方法
const SeedEditor = forwardRef<IDomEditor | null, SeedEditorProps>(({ initialContent, onChange }, ref) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [html, setHtml] = useState(initialContent);
  const intl = useIntl();
  const currentLocal = getLocale();
  // console.log(currentLocal);
  // if(currentLocal==='zh-CN'){
  //   i18nChangeLanguage('zh-cn');
  // }else {
  //   i18nChangeLanguage('en');
  // }

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {};

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: intl.formatMessage({ id: "common.input.content" }),
    MENU_CONF: {
      // 上传图片配置
      uploadImage: {
        customUpload: async (file: File, insertFn: (url: string) => void) => {
          const formData = new FormData();
          formData.append('file', file);
          const msg = await ossImgFile(formData);
          if (msg.code === '0') {
            insertFn(msg.data); // 插入图片
          }
        },
      },
      // 上传视频配置
      uploadVideo: {
        customUpload: async (file: File, insertFn: (url: string, poster: string) => void) => {
          const formData = new FormData();
          formData.append('file', file);
          const msg = await uploadFile(formData); // 调用上传接口
          if (msg.code === '0') {
            const videoUrl = msg.data; // 返回视频 URL
            const posterUrl = `${videoUrl}?vframe/jpg/offset/1`; // 自动生成封面图，具体逻辑根据后端配置调整
            insertFn(videoUrl, posterUrl); // 插入视频及封面
          }
        },
      },
    },
  };

  // 暴露 getHtml 方法给父组件
  useImperativeHandle(ref, () => ({
    getHtml: () => html,
  }));

  // 初次加载时设置编辑器内容
  useEffect(() => {
    if (initialContent) {
      setHtml(initialContent);
    }
  }, [initialContent]);

  // 销毁编辑器实例
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
        setEditor(null);
      }
    };
  }, [editor]);

  return (
    <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: '1px solid #ccc' }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={html}
        onCreated={setEditor}
        onChange={(editor) => {
          const content = editor.getHtml();
          setHtml(content);
          if (onChange) onChange(content); // 回调内容变化
        }}
        mode="default"
        style={{ height: '300px' }}
      />
    </div>
  );
});

export default SeedEditor;