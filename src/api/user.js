import request from '@/utils/request'

// export function login(data) {
//   return request.post('/management/login/', data)
// }

export function login(data) {
  return request({
    url: '/management/login/',
    method: 'post',
    data,
  })
}

export function getInfo() {
  return request({
    url: '/management/login_user/',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'get',
  })
}
