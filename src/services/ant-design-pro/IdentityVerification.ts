import { request } from '@umijs/max';

// 获取用户身份验证详情
export async function getUserIdentityVerificationDetail(params: any) {
  return request('/tenant/v1/userIdentityVerificationDetail', {
    method: 'POST',
    data: params,
  });
}

// 获取用户身份验证列表
export async function getUserIdentityVerificationList(params: any) {
  return request('/tenant/v1/userIdentityVerificationList', {
    method: 'POST',
    data: params,
  });
}

// 更新用户身份验证信息
export async function updateUserIdentityVerificationById(params: any) {
  return request('/tenant/v1/updateUserIdentityVerificationById', {
    method: 'POST',
    data: params,
  });
}

// 获取用户等级权益列表
export async function getUserLevelBenefitList(params: any) {
  return request('/tenant/v1/userLevelBenefitList', {
    method: 'POST',
    data: params,
  });
}

// 更新等级权益信息
export async function updateLevelBenefitById(params: any) {
  return request('/tenant/v1/updateLevelBenefitById', {
    method: 'POST',
    data: params,
  });
}