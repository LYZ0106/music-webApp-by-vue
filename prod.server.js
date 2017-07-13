/**
 * Created by 刘彦佐 on 2017/7/10.
 */
var express = require('express')
var config = require('./config/index.js')

var axios = require('axios')
// nginx代理允许跨域
axios.defaults.withCredentials = true

var app = express()

var apiRoutes = express.Router()
// 热门歌曲
// 后端代理请求，解决host的限制，前端先请求自己的服务端，再通过自己的服务端去请求QQ音乐的服务端，用axios代理
apiRoutes.get('/getDiscList', function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      // Http协议头中的Referer主要用来让服务器判断来源页面, 即用户是从哪个页面来的,通常被网站用来统计用户来源,是从搜索页面来的,
      // 还是从其他网站链接过来,或是从书签等访问,以便网站合理定位.
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query,
  }).then((qq_res) => {
    res.json(qq_res.data)       // 输出到浏览器前端
  }).catch((err) => {
    console.log(err)
  })
})

// 获取歌词
apiRoutes.get('/getLyric', function (req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query,
  }).then((qq_res) => {
    // json化数据
    let ret = qq_res.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) ret = JSON.parse(matches[1])
    }
    res.json(ret)       // 输出到浏览器前端 json化
  }).catch((err) => {
    console.log(err)
  })
})

app.use('/api', apiRoutes)

// 配置静态资源入口
app.use(express.static('./dist'))

var port = process.env.PORT || config.build.port

app.listen(port, function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('listening at http://localhost:' + port + '\n')
  }
})
