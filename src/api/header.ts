import request from '../config/request'
//获取

export function getBgimg () {
  return request({
    url: `getBgimg`
  })
}
