import { request } from '@umijs/max';

// 获取提现存款列表
export async function fetchWithdrawDepositList(params: any) {
  return request('/tenant/v1/withdrawDepositList', {
    method: 'POST',
    data: params,
  });
}

// 获取提现存款详情
export async function fetchWithdrawDepositDetail(params: any) {
  return request('/tenant/v1/withdrawDepositDetail', {
    method: 'POST',
    data: params,
  });
}

// 更新提现存款
export async function updateWithdrawDeposit(params: any) {
  return request('/tenant/v1/updateWithdrawDeposit', {
    method: 'POST',
    data: params,
  });
}