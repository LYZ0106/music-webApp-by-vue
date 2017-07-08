/*
 * 特别注意参数，一个都不能错
 */
import jsonp from 'common/js/jsonp'
import {commonParam, options, getHotSongListCbName} from './config'
import axios from 'axios'

// 轮播图
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParam, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

// 热门歌单
export function getDiscList() {
  // 前端先请求自己的服务端，再通过自己的服务端去请求QQ音乐的服务端，拿到数据后，是一个ajax请求
  const url = '/api/getDiscList'
  const data = Object.assign({}, commonParam, {
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    sin: 0,
    ein: 12,
    sortId: 5,
    categoryId: 10000000,
    format: 'json',
    rnd: Math.random(),
    loginUin: 0,
    inCharset: 'utf8',
    notice: 0,
    jsonpCallback: 'getPlaylist'
  })

  // 请求代理
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 热门歌单详情歌曲
export function getHotSongList(disstid) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  const data = Object.assign({}, commonParam, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid,
    loginUin: 0,
    hostUin: 0,
    inCharset: 'utf8',
    platform: 'yqq',
    needNewCode: 0
  })

  return jsonp(url, data, getHotSongListCbName)
}
