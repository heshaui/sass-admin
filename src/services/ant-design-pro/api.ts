// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
const isAdmin=process.env.UMI_APP_ADMIN_FLAG==='1';
/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/tenant-admin/v1/getLoginInfo', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function merchantCurrentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/tenant/v1/getLoginInfo', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/tenant-admin/v1/logout', {
    method: 'GET',
    ...(options || {}),
  });
}

// 总后台登录
export async function loginCheck(body: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/tenant-admin/v1/login/check', {
    method: 'POST',
    data:body ,
    ...(options || {}),
  });
}

// 商户登录
export async function tenantLoginCheck(body: any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/tenant/v1/login/check?account=' + body.account, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/tenant-admin/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function tenantLogin(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/tenant/v1/login?', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

// /send/email/not/loginCheckEmail

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}

// 图片上传
export async function ossImgFile(file: File, options?: { [key: string]: any }) {
  // return request<API.OssImgFile>(isAdmin?'tenant-admin/ambit-oss/oss/img/file':'/api/ambit-oss/oss/img/file', {
     return request<API.OssImgFile>('/api/ambit-oss/oss/img/file ', {
    method: 'POST',
    data: file, // 直接发送 FormData
  });
}

//文件上传
export async function uploadFile(file: File, options?: { [key: string]: any }) {
  return request<API.OssImgFile>(isAdmin?'tenant-admin/ambit-oss/oss/upload/file':'/api/ambit-oss/oss/upload/file', {
    // return request<API.OssImgFile>('/oss/upload/file', {
    method: 'POST',
    data: file, // 直接发送 FormData
  });
}


// 国家区号
export async function selectHomeCountryList(options?: { [key: string]: any }) {
  return request(isAdmin?'/tenant-admin/v1/country/selectHomeCountryList':'/tenant/v1/country/selectHomeCountryList', {
    method: 'GET',
    ...(options || {}),
  });
}
