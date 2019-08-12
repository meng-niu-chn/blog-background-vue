import request from '@/utils/request'

var uri = 'http://localhost:8899'

export default {
    //文章数量
    getArticleCount: () => {
        return request({
            url: uri + '/article/getAllCount',
            method: 'get'
        })
    },
    //评论数量
    getCommentCount: () => {
        return request({
            url: uri + '/comment/getAllCount',
            method: 'get'
        })
    },
    //标签数量
    getTagCount: () => {
        return request({
            url: uri + '/tag/getAllCount',
            method: 'get'
        })
    },
    //友链数量
    getLinkCount: () => {
        return request({
            url: uri + '/link/getAllCount',
            method: 'get'
        })
    },
    //最新文章
    getArticles: () => {
        return request({
            url: uri + '/article/getLatest',
            method: 'get'
        })
    },
    //最新评论
    getComments: () => {
        return request({
            url: uri + '/comment/getLatest',
            method: 'get'
        })
    },
}