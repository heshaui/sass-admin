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
