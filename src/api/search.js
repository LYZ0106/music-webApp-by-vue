import jsonp from 'common/js/jsonp'
import {commonParam, options} from './config'

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, commonParam, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

export function getSuggest(query, page, zhida, pagenum) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  const data = Object.assign({}, commonParam, {
    uin: 0,
    platform: 'h5',
    w: query,
    zhidaqu: 1,
    catZhida: zhida ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: pagenum,
    n: pagenum,
    p: page,
    remoteplace: 'txt.mqq.all',
    needNewCode: 1
  })

  return jsonp(url, data, options)
}
