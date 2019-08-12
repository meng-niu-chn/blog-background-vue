import request from '@/utils/request'

var uri = 'http://localhost:8899/user'

export default {

    update: (data) => {
        return request({
            url: uri + '/update',
            method: 'post',
            data
        })
    },

    getCurrent: () => {
        return request({
            url: uri + '/getCurrent',
            method: 'get'
        })
    },

    logout: () => {
        return request({
            url: uri + '/logout',
            method: 'get',
        })
    }
}