import request from '@/utils/request'

export function usersList(query) {
  return request({
    url: '/market/users/list/',
    method: 'get',
    params: query,
  })
}
export function updateNote(data) {
  return request({
    url: `/market/update/note/${data.id}/`,
    method: 'patch',
    data,
  })
}
export function accountsList(query) {
  return request({
    url: '/market/accounts/list/',
    method: 'get',
    params: query,
  })
}
export function documentList(query) {
  return request({
    url: '/market/documentary/list/',
    method: 'get',
    params: query,
  })
}
export function extractList(query) {
  return request({
    url: '/market/extract/list/',
    method: 'get',
    params: query,
  })
}
export function ordersList(query) {
  return request({
    url: '/market/orders/list/',
    method: 'get',
    params: query,
  })
}
export function newsList(query) {
  return request({
    url: '/market/news/list/',
    method: 'get',
    params: query,
  })
}
export function sortList(query) {
  return request({
    url: '/market/sort/list/',
    method: 'get',
    params: query,
  })
}
export function platList(query) {
  return request({
    url: '/market/plat/list/',
    method: 'get',
    params: query,
  })
}

