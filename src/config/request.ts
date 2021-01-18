import axios from 'axios'
const url = 'http://localhost:2233';

console.log(document.cookie)
// document.cookie = 'SESSDATA=19fa61ae%2C1618970390%2Cbdc2d*a1'
const service = axios.create({
  baseURL: url,
  timeout: 50000,
})
service.interceptors.request.use(config => {
  if (document.cookie) {
    config.headers = {
      edata: document.cookie
    }
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
})

export default service