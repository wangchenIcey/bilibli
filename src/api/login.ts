import request from '../config/request'
//获取

export function getcaptcha() {
    return request({
        url: 'captcha'
    }).then()
}
export function getack() {
    return request({
        url: 'ack'
    }).then()
}
export function login(params) {
    return request({
        url: 'login',
        params
    }).then()
}
export function yiyun(params) {
    return request({
        url: 'yiyun',
        params
    }).then()
}
export function sms(params) {
    return request({
        url: 'sms',
        params
    }).then()
}
export function smslogin(params) {
    return request({
        url: 'smslogin',
        params
    }).then()
}
export function getUserNav() {
    return request({
        url: 'usernav',
    }).then()
}

export function searchDefault() {
    return request({
        url: 'searchDefault',
    }).then()
}


export function QR() {
    return request({
        url: 'QR',
        
    }).then()
}

export function getInfo(params) {
    return request({
        url: 'getInfoByOutkey',
        params
    }).then()
}
