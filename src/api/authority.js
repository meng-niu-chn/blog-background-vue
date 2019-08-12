import request from '@/utils/request'

var uri = 'http://localhost:8899/user'

export default {
    getByPage: (start, size, username) => {
        return request({
            url: uri + '/getByPage',
            method: 'get',
            params: {
                start: start,
                size: size,
                username: username
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

    getRoles: () => {
        return request({
            url: uri + '/getRoles',
            method: 'get',
        })
    },

    getById: (id) => {
        return request({
            url: uri + '/getById',
            method: 'get',
            params: {
                id: id
            }
        })
    },

    update: (data) => {
        return request({
            url: uri + '/update',
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
    }
}
