import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

// console.log(`process.env.NODE_ENV=`, process.env.NODE_ENV)
var baseurl;
switch (process.env.NODE_ENV) {
  case 'production':
    baseurl = 'https://my.klipc.com.cn/api/'
    break;
  case 'development':
    baseurl = 'https://my.klipc.com.cn/api/'
    // baseurl = 'http://192.168.0.169:8000'
    break;
}

const service = axios.create({
  baseURL: baseurl,
  timeout: 5000
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = 'jwt ' + getToken()
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response.status === 401) {
      console.log('登录信息已过期，请重新登录')
      router.replace('/management/login/')
    }
    return Promise.reject(error)
  }
)

export default service
