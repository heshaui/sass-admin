import { request } from 'umi';

// 媒体项接口定义
export interface MediaItem {
  id: string;
  name: string;
  icon: string;
  link: string;
}

// 获取媒体列表
export async function getMediaList() {
  return request<{
    data: MediaItem[];
    success: boolean;
  }>('/tenant/v1/homeSocialMediaList', {
    method: 'POST',
  });
}

// 获取媒体参数
export async function getMediaParams() {
  return request<{
    data: any;
    success: boolean;
  }>('/tenant/v1/homeSocialMediaParams', {
    method: 'POST',
  });
}

// 添加媒体
export async function addMedia(params: Omit<MediaItem, 'id'>) {
  return request<{
    success: boolean;
    data: MediaItem;
  }>('/tenant/v1/saveHomeSocialMedia', {
    method: 'POST',
    data: params,
  });
}

// 更新媒体
export async function updateMedia(params: MediaItem) {
  return request<{
    success: boolean;
  }>('/tenant/v1/updateHomeSocialMediaById', {
    method: 'POST',
    data: params,
  });
}

// 删除媒体
export async function deleteMedia(id: string) {
  return request<{
    success: boolean;
  }>('/tenant/v1/deleteHomeSocialMediaById', {
    method: 'POST',
    data: { id },
  });
}
