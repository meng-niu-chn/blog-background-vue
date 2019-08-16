import request from '@/utils/request'

var categoryUri = 'http://localhost:8899/category'
var tagUri = 'http://localhost:8899/tag'

export default {
    getCategorysByPage: (start, size) => {
        return request({
            url: categoryUri + '/getByPage',
            method: 'get',
            params: {
                start: start,
                size: size
            }
        })
    },

    getTagsByPage: (start, size) => {
        return request({
            url: tagUri + '/getByPage',
            method: 'get',
            params: {
                start: start,
                size: size
            }
        })
    },

    deleteCategorys: (data) => {
        return request({
            url: categoryUri + '/delete',
            method: 'post',
            data
        })
    },

    deleteTags: (data) => {
        return request({
            url: tagUri + '/delete',
            method: 'post',
            data
        })
    },

    getCategoryById: (id) => {
        return request({
            url: categoryUri + '/getById',
            method: 'get',
            params: {
                id: id
            }
        })
    },

    getTagById: (id) => {
        return request({
            url: tagUri + '/getById',
            method: 'get',
            params: {
                id: id
            }
        })
    },

    saveCategory: (data) => {
        return request({
            url: categoryUri + '/save',
            method: 'post',
            data
        })
    },

    saveTag: (data) => {
        return request({
            url: tagUri + '/save',
            method: 'post',
            data
        })
    },

    updateCategory: (data) => {
        return request({
            url: categoryUri + '/update',
            method: 'post',
            data
        })
    },

    updateTag: (data) => {
        return request({
            url: tagUri + '/update',
            method: 'post',
            data
        })
    }
}