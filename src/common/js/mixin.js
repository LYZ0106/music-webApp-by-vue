import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

// 迷你播放器的屏幕适配
export const playListMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  // dom 中组件渲染完成后挂载
  mounted() {
    // TODO 为什么要传入this.playlist
    this.handlePlaylist(this.playlist)
  },
  // 内置组件 keep-alive activated 生命周期钩子函数将会被对应执
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    // 使用 mixin 的组件必须重写该方法，覆盖原方法以完成具体业务逻辑
    handlePlaylist() {
      throw new Error('component must implement handlePlay method')
    }
  }
}

// 播放器共享
export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'currentSong',
      'sequenceList',
      'mode',
      'favouriteSong'
    ])
  },
  methods: {
    iconChange() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    resetCurrentIndex(list) {
      // 切换播放模式时，当前歌曲不允许切掉，但当前歌曲次序确实变了
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getFavouriteIcon(song) {
      return this.isFavour(song) ? 'icon-favorite' : 'icon-not-favorite'
    },
    favourSong(song) {
      if (this.isFavour(song)) {
        this.cancelFavouriteSong(song)
      } else {
        this.saveFavouriteSong(song)
      }
    },
    isFavour(song) {
      const index = this.favouriteSong.findIndex((item) => {
        return item.id === song.id
      })

      // 转化为布尔值判断
      return index > -1
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'saveFavouriteSong',
      'cancelFavouriteSong'
    ])
  }
}

// 搜索内容历史本地储存
// 这里必须指定 ref="searchBox"
export const searchMixin = {
  data() {
    return {
      query: ''
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    // 将所点击的搜索历史字段自动添加到搜索框进行搜索
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    // onQueryChange(query)是由组件search-box返回 query，
    // search 组件再将这个query传给子组件suggest来服务器查询
    onQueryChange(query) {
      this.query = query
    },
    saveSearch() { // 搜索结果与localStore结合使用
      this.saveSearchHistory(this.query)
    },
    deleteSearch(item) {
      this.deleteSearchHistory(item)
    },
    blurInput() { // TODO ios滚动时手机收起键盘好像不行
      this.$refs.searchBox.blur()
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
