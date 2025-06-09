import { request } from 'umi';

/**
 * 保存或更新奖励配置
 * @param params 奖励配置参数
 */
export async function saveOrUpdateRewardConfiguration(params: any) {
  return request('/tenant/v1/saveOrUpdateRewardConfiguration', {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取奖励配置详情
 */
export async function getRewardConfigurationDetail() {
  return request('/tenant/v1/rewardConfigurationDetail', {
    method: 'POST',
  });
}

/**
 * 保存或更新图片配置
 * @param params 图片配置参数
 */
export async function saveOrUpdateImageConfiguration(params: any) {
  return request('/tenant/v1/saveOrUpdateImageConfiguration', {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取图片配置详情
 */
export async function getImageConfigurationDetail() {
  return request('/tenant/v1/imageConfigurationDetail', {
    method: 'POST',
  });
}

/**
 * 获取用户邀请详情列表
 * @param params 查询参数
 */
export async function getUserInviteDetailList(params: any) {
  return request('/tenant/v1/userInviteDetailList', {
    method: 'POST',
    data: params,
  });
}



/**
 * 获取币种列表
 */
export async function getCurrencyCoinList(params: any) {
  return request('/tenant/v1/coin/currencyCoinList', {
    method: 'POST',
    data: params,
  });
}





export async function getGrantRecordList(params: any) {
  return request('/tenant/v1/grantRecordList', {
    method: 'POST',
    data: params,
  });
}



// /tenant/v1/fundAccountsList
export async function getFundAccountsList(params: any) {
  return request('/tenant/v1/fundAccountsList', {
    method: 'POST',
    data: params,
  });
}

