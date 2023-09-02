/*
 * @Author: zhangzhen
 * @Date: 2022-07-25 09:10:38
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-07-29 09:35:07
 *
 */
import request, { prefix } from '../common'; // save二维码信息

// 更新二维码
export const updateQrCodeConfig = <T,>(data: any) => request<T>({
  url: prefix('/dataConfig/batchUpdateDownloadQCDTO'),
  method: 'post',
  data
});

// 新增二维码 /dataConfig/batchInsertDownloadQc
export const addQrCodeConfig = <T,>(data: any) => request<T>({
  url: prefix('/dataConfig/batchInsertDownloadQc'),
  method: 'post',
  data
});

// 获取二维码信息
export const getQrCodeConfig = <T,>(params: any) => request<T>({
  // https://localhost:3000/aapp-api/aapp-portal/dataConfig/findDownloadQCByCode?0=AAPP_Android_APP&1=AAPP_IOS_APP
  url: prefix('/dataConfig/findDownloadQCByCode'),
  method: 'post',
  data: params
}); // 上传二维码

export const uploadQrCode = <T,>(data: any) => request<T>({
  url: prefix('/file/uploadImg', 'fileUpload'),
  method: 'post',
  data
}); // 删除配置

export const deleteQrCode = (dConfigId: number) => request({
  url: prefix(`/comConfig/${dConfigId}`),
  method: 'delete'
});

// 批量删除
export const deleteQrCodeBatch = (dConfigIds: number[]) => request({
  url: prefix(`/dataConfig/deleteByIdList`),
  method: 'post',
  data: dConfigIds,
})