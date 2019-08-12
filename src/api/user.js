import request from '@/utils/request'

var uri = "http://localhost:8899/user"

export function login(data) {
  // return request({
  //   url: '/user/login',
  //   method: 'post',
  //   data
  // })
  return request({
    url: uri + '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: uri + '/getCurrent',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: uri + '/logout',
    method: 'get',
  })
}
