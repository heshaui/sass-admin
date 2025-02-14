// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 发送验证码 POST /api/login/captcha */
export async function getFakeCaptcha(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant-admin/v1/sendCaptchaBase/mail/not', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function emailCode(body: any) {
  return request<API.FackeResult>('/tenant/send/email/not/loginCheckEmail', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
