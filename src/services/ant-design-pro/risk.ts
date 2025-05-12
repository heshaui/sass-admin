import { request } from 'umi';


export async function assetAccountReviewList(data?: any) {
  return request('/tenant/v1/assetAccountReviewList', {
    method: 'POST',
    data,
  });
}



export async function riskConditionTemplateList(data?: any) {
  return request('/tenant/v1/riskConditionTemplateList', {
    method: 'POST',
    data,
  });
}



export async function saveRiskConditions(data?: any) {
  return request('/tenant/v1/saveRiskConditions', {
    method: 'POST',
    data,
  });
}



// /tenant/v1/riskConditionList
export async function riskConditionList(data?: any) {
  return request('/tenant/v1/riskConditionList', {
    method: 'POST',
    data,
  });
}


export async function saveActionRiskLevel(data?: any) {
  return request('/tenant/v1/saveActionRiskLevels', {
    method: 'POST',
    data,
  });
}


export async function riskSceneList(data?: any) {
  return request('/tenant/v1/riskSceneList', {
    method: 'POST',
    data,
  });
}


//风控等级处理建议查询详情列表
export async function actionRiskLevelParams(data?: any) {
  return request('/tenant/v1/actionRiskLevelParams', {
    method: 'POST',
    data,
  });
}