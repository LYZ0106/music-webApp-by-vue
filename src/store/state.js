import {playMode} from 'common/js/config'
import {initSaveSearch, initSavePlay} from 'common/js/cache'

const state = {
  // 歌手状态管理
  singer: {},

  // 歌曲播放状态，同时是否显示播放器
  playing: false,

  // 全屏播放模式
  fullScreen: false,

  // 播放列表
  // 服务器返回的歌单次序是不变，歌曲次序初始化为顺序播放，乱序播放由本地处理，但是不能改变服务端的次序
  playlist: [],

  // 顺序播放
  sequenceList: [],

  // 播放模式，默认顺序播放
  mode: playMode.sequence,

  // 根据 currentIndex 播放哪一条歌曲
  currentIndex: -1,

  // 推荐页面热门歌单推荐
  disc: {},

  // 排行榜
  rank: {},

  // 搜索历史
  searchHistory: initSaveSearch(),

  // 播放历史
  playHistory: initSavePlay()
}

export default state
