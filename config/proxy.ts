/**
 * @name 代理的配置
 * @see 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 *
 * @doc https://umijs.org/docs/guides/proxy
 */

const isAdmin = process.env.UMI_APP_ADMIN_FLAG === '1';
const isMerchant = process.env.UMI_APP_MERCHANT_FLAG === '1';
console.log('isAdmin', isAdmin);
console.log('isMerchant', isMerchant);
export default {
  // 如果需要自定义本地开发服务器  请取消注释按需调整

  dev: {
    ...(isAdmin
      ? {
          '/tenant-admin/': {
            target: 'http://10.233.29.13:8064',
            changeOrigin: true,
          },
        }
      : {
          '/tenant/': {
            // target: 'http://10.233.50.129:8063',
            target: 'https://merchant.imsaas.work',
            changeOrigin: true,
          },
        }),
    '/api/ambit-oss/': {
      target: 'https://www.imsaas.work',
      changeOrigin: true,
    },
    // '/admin/': {
    //   target: 'http://static.imgtest.work',
    //   changeOrigin: true,
    // }
  },

  /**
   * @name 详细的代理配置
   * @doc https://github.com/chimurai/http-proxy-middleware
   */
  test: {
    // localhost:8000/api/** -> https://preview.pro.ant.design/api/**
    '/api/': {
      target: 'https://proapi.azurewebsites.net',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
