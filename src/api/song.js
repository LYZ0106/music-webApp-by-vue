import {commonParam} from './config'
import axios from 'axios'

export function getLyric(songmid) {
  const url = '/api/getLyric'
  const data = Object.assign({}, commonParam, {
    pcachetime: new Date(),
    songmid: songmid,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    inCharset: 'utf8'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    // 静态方法 Promise.resolve返回一个promise对象，它被解析后（resolved）
    return Promise.resolve(res.data)
  })
}
