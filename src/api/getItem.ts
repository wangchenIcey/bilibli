import request from '../config/request'
//获取

export function Getregion (params) {
  return request({
    url: `region`,
    params
  })
}
