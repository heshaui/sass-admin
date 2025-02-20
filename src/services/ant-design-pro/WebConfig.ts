// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 发送验证码 POST /api/login/captcha */
export async function homeMenu(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/homeMenuList', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}



// /tenant/v1/saveHomeMenu
export async function saveHomeMenu(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/saveHomeMenu', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}


// /tenant/v1/HomeMenuTranslationList
export async function HomeMenuTranslationList(body: API.FackeParams, options?: { [key: string]: any }) {
  return request<API.FackeResult>('/tenant/v1/HomeMenuTranslationList', {
    method: 'POST',
    data: body,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}


