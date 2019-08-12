import request from '@/utils/request'

var uri = 'http://localhost:8899/user'

export default {
    getSetting: () => {
        return request({
            url: uri + '/getSetting',
            metnod: 'get'
        })
    },

    updateSetting: (data) => {
        return request({
            url: uri + '/updateSetting',
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