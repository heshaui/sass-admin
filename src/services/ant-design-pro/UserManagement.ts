import { request } from '@umijs/max';
const isAdmin = process.env.UMI_APP_ADMIN_FLAG === '1';

// 用户列表查询参数类型
export interface UserListParams {
  pageSize?: number;
  current?: number;
  keyword?: string;
  status?: string;
  // 其他可能的筛选条件
}

// 用户详情参数
export interface UserDetailParams {
  userId: string | number;
}

// 用户更新参数
export interface UpdateUserParams {
  userId: string | number;
  [key: string]: any;
}

// 冻结/解冻/更新操作参数
export interface UserOperationParams {
  userId: string | number;
  reason?: string;
  remark?: string;
}

// 更新手机号参数
export interface UpdatePhoneParams {
  userId: string | number;
  phone: string;
  newPhone: string;
  googleCode?: string;
  remark?: string;
}

// 更新邮箱参数
export interface UpdateEmailParams {
  userId: string | number;
  email: string;
  newEmail: string;
  googleCode?: string;
  remark?: string;
}

// 操作日志查询参数
export interface OperationLogParams {
  userId: string | number;
  pageSize?: number;
  pageNo?: number;
  startTime?: string;
  endTime?: string;
}

/**
 * 获取用户列表
 */
export async function getUserList(params: UserListParams) {
  return request(isAdmin ? '/tenant-admin/v1/user/userList' : '/tenant/v1/userList', {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取用户详情
 */
export async function getUserDetail(params: string | number) {
  return request(isAdmin ? `/tenant-admin/v1/user/userDetail?id=${params}` : `/tenant/v1/userDetail?id=${params}`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 更新用户信息
 */
export async function updateUserById(params: UpdateUserParams) {
  return request(isAdmin ? '/tenant-admin/v1/user/updateUserById' : '/tenant/v1/updateUserById', {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取用户操作日志列表
 */
export async function getUserOperationLogs(params: OperationLogParams) {
  return request(isAdmin ? '/tenant-admin/v1/user/userOperationLogList' : '/tenant/v1/userOperationLogList', {
    method: 'POST',
    data: params,
  });
}

/**
 * 冻结登录
 */
export async function freezeLogin(params: UserOperationParams) {
  return request(isAdmin ? '/tenant-admin/v1/user/freezeLogin' : '/tenant/v1/freezeLogin', {
    method: 'POST',
    data: params,
  });
}

/**
 * 解冻登录
 */
export async function unfreezeLogin(params: UserOperationParams) {
  return request(isAdmin ? '/tenant-admin/v1/user/unfreezeLogin' : '/tenant/v1/unfreezeLogin', {
    method: 'POST',
    data: params,
  });
}

/**
 * 冻结交易
 */
export async function freezeTransaction(params: UserOperationParams) {
  return request(isAdmin ? '/tenant-admin/v1/user/freezeTransaction' : '/tenant/v1/freezeTransaction', {
    method: 'POST',
    data: params,
  });
}

/**
 * 解冻交易
 */
export async function unfreezeTransaction(params: UserOperationParams) {
  return request(isAdmin ? '/tenant-admin/v1/user/unfreezeTransaction' : '/tenant/v1/unfreezeTransaction', {
    method: 'POST',
    data: params,
  });
}

/**
 * 冻结提现
 */
export async function freezeWithdrawal(params: UserOperationParams) {
  return request(isAdmin ? '/tenant-admin/v1/user/freezeWithdrawal' : '/tenant/v1/freezeWithdrawal', {
    method: 'POST',
    data: params,
  });
}

/**
 * 解冻提现
 */
export async function unfreezeWithdrawal(params: UserOperationParams) {
  return request(isAdmin ? '/tenant-admin/v1/user/unfreezeWithdrawal' : '/tenant/v1/unfreezeWithdrawal', {
    method: 'POST',
    data: params,
  });
}

/**
 * 更新用户手机号
 */
export async function updatePhone(params: UpdatePhoneParams) {
  return request(isAdmin ? '/tenant-admin/v1/user/updatePhone' : '/tenant/v1/updatePhone', {
    method: 'POST',
    data: params,
  });
}

/**
 * 更新用户邮箱
 */
export async function updateEmail(params: UpdateEmailParams) {
  return request(isAdmin ? '/tenant-admin/v1/user/updateEmail' : '/tenant/v1/updateEmail', {
    method: 'POST',
    data: params,
  });
}

// /tenant/v1/relieveGoogle
export async function relieveGoogle(params: any) {
  return request(isAdmin ?'/tenant-admin/v1/user/relieveGoogle' :'/tenant/v1/relieveGoogle', {
    method: 'POST',
    data: params,
  });
}


// 用户资产
export async function userWalletList(params: any) {
  return request(isAdmin ?'/tenant-admin/v1/user/userWalletList' :'/tenant/v1/userWalletList', {
    method: 'POST',
    data: params,
  });
}


// 用户流水
export async function userTransactionLogList(params: any) {
  return request(isAdmin ?'/tenant-admin/v1/user/userTransactionLogList' :'/tenant/v1/userTransactionLogList', {
    method: 'POST',
    data: params,
  });
}



export async function gatewayAccessLogList(params: any) {
  return request(isAdmin ?'/tenant-admin/v1/user/gatewayAccessLogList' :'/tenant/v1/gatewayAccessLogList', {
    method: 'POST',
    data: params,
  });
}



export async function userTransactionCount(params: any) {
  return request(isAdmin ?'/tenant-admin/v1/user/userTransactionCount' :'/tenant/v1/userTransactionCount', {
    method: 'POST',
    data: params,
  });
}

export async function userWalletCount(params: any) {
  return request(isAdmin ?'/tenant-admin/v1/user/userWalletCount' :'/tenant/v1/userWalletCount', {
    method: 'POST',
    data: params,
  });
}




export async function userReconciliation(params: any) {
  return request(isAdmin ?'/tenant-admin/v1/userReconciliationList' :'/tenant/v1/userReconciliationList', {
    method: 'POST',
    data: params,
  });
}
