import request from '@/utils/request'

export function usersList(query) {
  return request({
    url: '/financial/users/list/',
    method: 'get',
    params: query,
  })
}
export function updateNote(data) {
  return request({
    url: `/financial/update/note/${data.id}/`,
    method: 'patch',
    data,
  })
}
export function accountsList(query) {
  return request({
    url: '/financial/accounts/list/',
    method: 'get',
    params: query,
  })
}
export function operationList(query) {
  return request({
    url: '/financial/operation/list/',
    method: 'get',
    params: query,
  })
}
export function extractList(query) {
  return request({
    url: '/financial/extract/list/',
    method: 'get',
    params: query,
  })
}
export function frozenList(query) {
  return request({
    url: '/financial/frozen/list/',
    method: 'get',
    params: query,
  })
}
export function ordersList(query) {
  return request({
    url: '/financial/orders/list/',
    method: 'get',
    params: query,
  })
}
export function purseList(query) {
  return request({
    url: '/financial/purse/list/',
    method: 'get',
    params: query,
  })
}
export function refundList(query) {
  return request({
    url: '/financial/refund/list/',
    method: 'get',
    params: query,
  })
}
export function transList(query) {
  return request({
    url: '/financial/transaction/list/',
    method: 'get',
    params: query,
  })
}
