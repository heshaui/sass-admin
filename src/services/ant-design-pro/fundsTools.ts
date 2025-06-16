import { request } from '@umijs/max';

/**
 * 租户钱包信息接口
 * @param params 请求参数
 */
export async function tenantWallet(params: any) {
  return request(
    '/tenant/v1/tenant-wallet/tenantWallet?coinId=' +
      params.coinId +
      '&walletType=' +
      params.walletType,
    {
      method: 'POST',
      data: params,
    },
  );
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

// 赠币记录查询
export async function getCoinGiftList(params?: Record<string, any>) {
  return request('/tenant/v1/coin-gift/list', {
    method: 'POST',
    data: params,
  });
}

// 单个赠币
export async function getCoinGift(params?: Record<string, any>) {
  return request('/tenant/v1/coin-gift/gift', {
    method: 'POST',
    data: params,
  });
}
// 赠币类型
export async function getCoinGiftType(): Promise<any> {
  return request('/tenant/v1/coin-gift/types', {
    method: 'GET',
  });
}
// 下载赠币Excel模板
export async function getCoinGiftTemplate(): Promise<any> {
  return request('/tenant/v1/coin-gift/template', {
    method: 'GET',
    responseType: 'blob',
    getResponse: true, // 获取完整响应，包括headers等信息
  });
}
// 批量赠币导入验证
export async function getCoinGiftCheckImport({
  file,
  type,
}: {
  file: File;
  type: string;
}): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);

  return request('/tenant/v1/coin-gift/check-import?type=' + type, {
    method: 'POST',
    data: formData,
    requestType: 'form', // 确保使用正确的请求类型
    // headers: { "Content-Type": "multipart/form-data" },
  });
}
//确认导入执行数据
export async function getCoinGiftConfirmImport({ batchId }: { batchId: string }): Promise<any> {
  return request('/tenant/v1/coin-gift/confirm-import?batchId=' + batchId, {
    method: 'POST',
  });
}
// // 批量赠币提交
// export async function getCoinGiftSubmitImport(): Promise<any> {
//   return request('/tenant/v1/coin-gift/submit-import', {
//     method: 'POST',
//   });
// }
// 查询赠币导入处理状态
export async function getCoinGiftImportStatus({ batchId }: { batchId: string }): Promise<any> {
  return request('/tenant/v1/coin-gift/import-status?batchId=' + batchId, {
    method: 'GET',
  });
}
