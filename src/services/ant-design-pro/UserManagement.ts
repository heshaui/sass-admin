import { request } from 'umi';

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
  verificationCode?: string;
}

// 更新邮箱参数
export interface UpdateEmailParams {
  userId: string | number;
  email: string;
  verificationCode?: string;
}

// 操作日志查询参数
export interface OperationLogParams {
  userId: string | number;
  pageSize?: number;
  current?: number;
  startTime?: string;
  endTime?: string;
}

/**
 * 获取用户列表
 */
export async function getUserList(params: UserListParams) {
  return request('/tenant/v1/userList', {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取用户详情
 */
export async function getUserDetail(params: UserDetailParams) {
  return request(`/tenant/v1/userDetail?id=${params}`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 更新用户信息
 */
export async function updateUserById(params: UpdateUserParams) {
  return request('/tenant/v1/updateUserById', {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取用户操作日志列表
 */
export async function getUserOperationLogs(params: OperationLogParams) {
  return request('/tenant/v1/userOperationLogList', {
    method: 'POST',
    data: params,
  });
}

/**
 * 冻结登录
 */
export async function freezeLogin(params: UserOperationParams) {
  return request('/tenant/v1/freezeLogin', {
    method: 'POST',
    data: params,
  });
}

/**
 * 解冻登录
 */
export async function unfreezeLogin(params: UserOperationParams) {
  return request('/tenant/v1/unfreezeLogin', {
    method: 'POST',
    data: params,
  });
}

/**
 * 冻结交易
 */
export async function freezeTransaction(params: UserOperationParams) {
  return request('/tenant/v1/freezeTransaction', {
    method: 'POST',
    data: params,
  });
}

/**
 * 解冻交易
 */
export async function unfreezeTransaction(params: UserOperationParams) {
  return request('/tenant/v1/unfreezeTransaction', {
    method: 'POST',
    data: params,
  });
}

/**
 * 冻结提现
 */
export async function freezeWithdrawal(params: UserOperationParams) {
  return request('/tenant/v1/freezeWithdrawal', {
    method: 'POST',
    data: params,
  });
}

/**
 * 解冻提现
 */
export async function unfreezeWithdrawal(params: UserOperationParams) {
  return request('/tenant/v1/unfreezeWithdrawal', {
    method: 'POST',
    data: params,
  });
}

/**
 * 更新用户手机号
 */
export async function updatePhone(params: UpdatePhoneParams) {
  return request('/tenant/v1/updatePhone', {
    method: 'POST',
    data: params,
  });
}

/**
 * 更新用户邮箱
 */
export async function updateEmail(params: UpdateEmailParams) {
  return request('/tenant/v1/updateEmail', {
    method: 'POST',
    data: params,
  });
}
