import { request } from 'umi';

// 媒体项接口定义
export interface MediaItem {
  id: string;
  name: string;
  icon: string;
  link: string;
}

// 公告项接口定义
export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  status: number;
  createTime?: string;
  updateTime?: string;
}

// 获取媒体列表
export async function getMediaList(data: any) {
  return request<{
    data: MediaItem[];
    success: boolean;
  }>('/tenant/v1/homeSocialMediaList', {
    method: 'POST',
    data,
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

// 获取公告内容列表
export async function getAnnouncementContentList(data: any) {
  return request<{
    data: any[];
    success: boolean;
  }>('/tenant/v1/InformAnnouncementContentList', {
    method: 'POST',
    data,
  });
}

// 获取公告列表
export async function getAnnouncementList(data: any) {
  return request<{
    data: AnnouncementItem[];
    success: boolean;
  }>('/tenant/v1/informAnnouncementList', {
    method: 'POST',
    data,
  });
}

// 获取公告参数
export async function getAnnouncementParams(id: string) {
  return request<{
    data: any;
    success: boolean;
  }>('/tenant/v1/informAnnouncementParams?idString='+id, {
    method: 'POST',
  });
}

// 添加公告
export async function addAnnouncement(params: Omit<AnnouncementItem, 'id'>) {
  return request<{
    success: boolean;
    data: AnnouncementItem;
  }>('/tenant/v1/saveInformAnnouncement', {
    method: 'POST',
    data: params,
  });
}

// 更新公告
export async function updateAnnouncement(params: AnnouncementItem) {
  return request<{
    success: boolean;
  }>('/tenant/v1/updateInformAnnouncementById', {
    method: 'POST',
    data: params,
  });
}

// 更新公告内容
export async function updateAnnouncementContent(params: any) {
  return request<{
    success: boolean;
  }>('/tenant/v1/updateInformAnnouncementContentById', {
    method: 'POST',
    data: params,
  });
}
