import request from '../config/request'
//获取

export function getBgimg () {
  return request({
    url: `getBgimg`
  })
}


export function online () {
  return request({
    url: `online`
  })
}

export function sort (){
  return request({
    url: `sort`
  })
}