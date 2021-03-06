import { axios } from '@/utils/request'
import system from '@/config/defaultSettings'
// 获取简介列表
export function getEnterpriseSynopsisList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/enterpriseInformation/toList?informationType=1',
    method: 'get',
    params: parameter
  })
}
// 获取视频列表
export function getEnterpriseVideoList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/enterpriseInformation/toList',
    method: 'get',
    params: parameter
  })
}

// export function getEnterpriseVideoList (parameter) {
//   return axios({
//     baseURL: system.baseURL,
//     url: '/enterpriseInformation/toList?informationType=2',
//     method: 'get',
//     params: parameter
//   })
// }
// 获取产品宣传视频列表
// export function getProductPromotionVideoList (parameter) {
//   return axios({
//     baseURL: system.baseURL,
//     url: '/enterpriseInformation/toList?informationType=3',
//     method: 'get',
//     params: parameter
//   })
// }
// 获取产品使用教学视频列表
// export function getTeachingVideoOfProductUseList (parameter) {
//   return axios({
//     baseURL: system.baseURL,
//     url: '/enterpriseInformation/toList?informationType=4',
//     method: 'get',
//     params: parameter
//   })
// }
// 获取产品功能简介列表
export function getProductFunctionIntroductionList (parameter) {
  return axios({
    baseURL: system.baseURL,
    url: '/enterpriseInformation/toList?informationType=5',
    method: 'get',
    params: parameter
  })
}
// 新增简介/视频
export function saveInformation (data) {
  const token = data.Authorization
  return axios({
    baseURL: system.baseURL,
    url: '/enterpriseInformation/add',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: data
  })
}
// 修改简介/视频
export function editInformation (data) {
  const token = data.Authorization
  return axios({
    baseURL: system.baseURL,
    url: '/enterpriseInformation/edit',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: data
  })
}
// 删除简介/视频
export function delInformation (data) {
  const token = data.Authorization
  return axios({
    baseURL: system.baseURL,
    url: '/enterpriseInformation/del',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: data
  })
}

/**
 * 删除服务器资源
 * @param data
 * @returns {*}
 */
export function delUrl (data) {
  const token = data.Authorization
  return axios({
    baseURL: system.baseURL,
    url: '/enterpriseInformation/delUrl',
    method: 'post',
    headers: {
      Authorization: token
    },
    data: data
  })
}
