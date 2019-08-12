import request from '@/utils/request'

var uri = 'http://localhost:8899/link'

export default {

    getById: (id) => {
        return request({
            url: uri + '/getById',
            method: 'get',
            params: {
                id: id
            }
        })
    },

    getByPage: (start,size) => {
        return request({
            url: uri + '/getByPage',
            method: 'get',
            params: {
                start: start,
                size: size
            }
        })
    },

    delete: (data) => {
        return request({
            url: uri + '/delete',
            method: 'post',
            data
        })
    },

    save: (data) => {
        return request({
            url: uri + '/save',
            method: 'post',
            data
        })
    },

    update: (data) => {
        return request({
            url: uri + '/update',
            method: 'post',
            data
        })
    },
}