import { request } from '@umijs/max';

/**
 * 租户钱包信息接口
 * @param params 请求参数
 */
export async function tenantWallet(params: any) {
  return request('/tenant/v1/tenant-wallet/tenantWallet?coinId='+params.coinId+'&walletType='+params.walletType, {
    method: 'POST',
    data: params,
  });
}

/**
 * 租户钱包列表接口
 * @param params 请求参数
 */
export async function tenantWalletList(params: any) {
  return request('/tenant/v1/tenant-wallet/tenantWalletList', {
    method: 'POST',
    data: params,
  });
}

/**
 * 租户转到钱包接口
 * @param params 请求参数
 */
export async function tenantToWallet(params: any) {
  return request('/tenant/v1/tenant-wallet/tenantToWallet', {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取钱包类型列表接口
 */
export async function walletTypeList() {
  return request('/tenant/v1/tenant-wallet/walletTypeList', {
    method: 'GET',
  });
}



export async function tenantSubWallet(params: any) {
  return request('/tenant/v1/tenant-wallet/tenantSubWallet', {
    method: 'POST',
    data: params,
  });
}


// /tenant/v1/tenant-wallet/tenantSubWalletList
export async function tenantSubWalletList(params: any) {
  return request('/tenant/v1/tenant-wallet/tenantSubWalletList', {
    method: 'POST',
    data: params,
  });
}


// /tenant/v1/tenant-wallet/fundFlowDirectionOperationList
export async function fundFlowDirectionOperationList(params: any) {
  return request('/tenant/v1/tenant-wallet/fundFlowDirectionOperationList', {
    method: 'POST',
    data: params,
  });
}
