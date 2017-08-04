/**
 * Created by 刘彦佐 on 2017/6/22.
 */
import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

export default class Song {
  // 参数记得要解构赋值
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  // 获取歌词
  getLyric() {
    // currentSong调用时，减少请求
    if (this.lyric) {
      // 参数是Promise实例，Promise.resolve不做任何修改、原封不动地返回这个实例。
      return Promise.resolve(this.lyric)
    }

    // 数据要异步获取
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.code === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}

// 一个已经实例化的工厂函数
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  })
}

// 显示两个歌手合唱的名字
function filterSinger(singer) {
  let ret = []
  if (!singer) return ''
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
