import request from '@/utils/request'

export function usersList(query) {
  return request({
    url: '/sales/users/list/',
    method: 'get',
    params: query,
  })
}
export function updateNote(data) {
  return request({
    url: `/sales/update/note/${data.id}/`,
    method: 'patch',
    data,
  })
}
export function accountsList(query) {
  return request({
    url: '/sales/accounts/list/',
    method: 'get',
    params: query,
  })
}

export function signalList(query) {
  return request({
    url: '/sales/signalman/list/',
    method: 'get',
    params: query
  })
}

export function documentList(query) {
  return request({
    url: '/sales/documentary/list/',
    method: 'get',
    params: query,
  })
}
