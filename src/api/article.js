import request from '@/utils/request'

var uri = 'http://localhost:8899/article'
var categoryUri = "http://localhost:8899/category"

export default {
  //获得菜单
  getCategory: () => {
    return request({
      url: categoryUri + '/getAll',
      method: 'get'
    })
  },

  //获得文章数量
  getAllCount: () => {
    return request({
      url: uri + '/getAllCount',
      method: 'get'
    })
  },
  //根据ID查询文章
  getById: (id) => {
    return request({
      url: uri + '/getById',
      method: 'get',
      params: {
        id: id
      }
    })
  },
  //条件查询
  getByPage: (start, size, titles) => {
    return request({
      url: uri + '/getByPage',
      method: 'get',
      params: {
        start: start,
        size: size,
        titles: titles,
      }
    })
  },
  //查询全部
  getAll: () => {
    return request({
      url: uri + '/getAll',
      method: 'get',
    })
  },
  //删除
  delete: (data) => {
    return request({
      url: uri + '/delete',
      method: 'post',
      data
    })
  },
  //保存
  save: (data) => {
    return request({
      url: uri + '/save',
      method: 'post',
      data
    })
  },
  //更新
  update: (data) => {
    return request({
      url: uri + '/update',
      method: 'post',
      data
    })
  },

  picupload: (data) => {
    return request({
      url: uri + '/uploadAvatar',
      method: 'post',
      data
    })
  },

  picdelete: (data) => {
    return request({
      url: uri + '/deleteAvatar',
      method: 'post',
      data
    })
  }

}