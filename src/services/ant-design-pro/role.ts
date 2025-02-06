import { request } from '@umijs/max';

/** 发送验证码 POST /api/login/captcha */
export async function AuthorityList(
  body:API.TenantAuthorityVo,
  options?: { [key: string]: any },
) {
  return request<API.TenantAuthority>('/tenant-admin/v1/tenantAuthority/tenantAuthorityList', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}


