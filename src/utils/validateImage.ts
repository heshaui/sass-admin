import { message } from 'antd';

interface ImageValidationOptions {
  allowedTypes?: string[]; // 允许的图片类型（可选，不填则允许所有图片类型）
  maxSizeKB?: number; // 最大文件大小(KB)
  exactWidth?: number; // 要求的精确宽度(像素)
  exactHeight?: number; // 要求的精确高度(像素)
  widthMultiple?: number; // 宽度必须是此数值的倍数
  heightMultiple?: number; // 高度必须是此数值的倍数
  intl: any;
}

/**
 * 验证图片文件的通用函数
 * @param file 要验证的图片文件
 * @param options 验证选项配置
 * @returns Promise<boolean> 验证结果
 */
export const validateImageFile = (
  file: File,
  options: ImageValidationOptions,
): Promise<boolean> => {
  return new Promise((resolve) => {
    // 1. 检查文件类型（如果指定了allowedTypes）
    if (options.allowedTypes && options.allowedTypes.length > 0) {
      const isAllowedType = options.allowedTypes.includes(file.type);
      if (!isAllowedType) {
        message.error(options.intl.formatMessage({ id: 'common.upload.type' }));
        return resolve(false);
      }
    } else {
      // 如果没有指定allowedTypes，则检查是否是图片类型
      if (!file.type.startsWith('image/')) {
        message.error(options.intl.formatMessage({ id: 'common.upload.type' }));
        return resolve(false);
      }
    }

    // 2. 检查文件大小（如果指定了maxSizeKB）
    if (options.maxSizeKB && file.size / 1024 > options.maxSizeKB) {
      message.error(options.intl.formatMessage({ id: 'common.upload.limit' }));
      return resolve(false);
    }

    // 3. 检查是否需要验证尺寸
    const needDimensionCheck =
      options.exactWidth || options.exactHeight || options.widthMultiple || options.heightMultiple;
    if (!needDimensionCheck) return resolve(true);

    // 4. 浏览器环境检查
    if (typeof document === 'undefined') {
      message.error(options.intl.formatMessage({ id: 'common.upload.env' }));
      return resolve(false);
    }

    // 5. 读取并验证图片尺寸
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const { naturalWidth: width, naturalHeight: height } = img;
        console.log(width, height);

        // 检查精确尺寸
        if (
          (options.exactWidth && width !== options.exactWidth) ||
          (options.exactHeight && height !== options.exactHeight)
        ) {
          message.error(options.intl.formatMessage({ id: 'common.upload.dimension' }));
          return resolve(false);
        }

        // 检查尺寸倍数
        if (
          (options.widthMultiple && width % options.widthMultiple !== 0) ||
          (options.heightMultiple && height % options.heightMultiple !== 0)
        ) {
          message.error(options.intl.formatMessage({ id: 'common.upload.dimension.multiple' }));
          return resolve(false);
        }

        resolve(true);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
