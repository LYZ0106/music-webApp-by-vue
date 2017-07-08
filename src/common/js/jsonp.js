import originJSONP from 'jsonp'

/*
 *  传给服务端是一个地址，jsonp库不支持带参数，data就是query参数
 *  opts 对应 jsonp 库的 opts
 */
export default function (url, data, opts) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

  return new Promise((resolve, reject) => {
    originJSONP(url, opts, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

// 将 data 拼接到 url 上
function param(data) {
  let url = ''
  for (let i in data) {
    let value = data[i] !== undefined ? data[i] : ''
    url += `&${i}=${encodeURIComponent(value)}`
  }
  return url
}
