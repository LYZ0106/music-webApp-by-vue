/**
 * Created by 刘彦佐 on 2017/6/17.
 */
import jsonp from 'common/js/jsonp'
import {commonParam, options} from './config'

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParam, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    inCharset: 'utf8'
  })

  return jsonp(url, data, options)
}

export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, commonParam, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    inCharset: 'utf8',
    order: 'listen',
    begin: 0,
    num: 50,
    songstatus: 1,
    singermid: singerId
  })

  return jsonp(url, data, options)
}
