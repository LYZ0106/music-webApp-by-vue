<template>
  <scroll class="suggest"
          :data="suggest"
          :pullup="pullup"
          @scrollToEnd="searchMore"
          ref="suggest"
          :beforeScroll="beforeScroll"
          @beforeScroll='listScroll'
          @click.stop>
    <ul class="suggest-list" ref="suggestList">
      <li class="suggest-item" v-for="item in suggest" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <li v-show="suggest.length===totalnum && suggest.length>0" class="showAllTip">已经加载全部</li>
      <!-- 需要预先判断当前量与总量 -->
      <loading v-show="hasMore"></loading>
    </ul>
    <div v-show="!hasMore && !suggest.length" class="no-result-wrapper">
      <no-result title="抱歉,无搜索结果！"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Loading from 'base/loading/loading'
  import {getSuggest} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Singer from 'common/js/singer'
  import {mapMutations, mapActions} from 'vuex'
  import {playListMixin} from 'common/js/mixin'
  import NoResult from 'base/no-result/no-result'

  const TYPE_SINGER = 'singer'
  const pagenum = 18

  export default {
    mixins: [playListMixin],
    props: {
      query: {
        type: String,
        default: ''
      },
      // 搜索时候是否展现歌手
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        suggest: [],
        pullup: true,
        // 标志位，防止欸有数据时再请求服务器
        hasMore: true,
        totalnum: 0,
        // 这里滚动，所以这里设为true
        beforeScroll: true
      }
    },
    methods: {
      search() {
        this.page = 1
        this.hasMore = true
        this.$refs.suggest.scrollTo(0, 0)
        getSuggest(this.query, this.page, this.showSinger, pagenum).then((res) => {
          if (res.code === ERR_OK) {
            this.suggest = this.getResult(res.data)
            // 首次请求，判断是否请求完数据
            this._checkLastPageMore(res.data)
          }
        })
      },
      getResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          // type 用来区分歌手与歌曲不同样式的显示
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          // 相当于 ret = ret.concat(data.song.list) 添加到数组的后边
          ret.push(...this._normalizeSongs(data.song.list))
          // 拿到所有的数据数量
          this.totalnum = data.song.totalnum
          console.log('总数' + this.totalnum)
        }
        return ret
      },
      getIconCls(item) {
        return item.type === TYPE_SINGER ? 'icon-mine' : 'icon-music'
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          // singer为一个数组的数据结构
          // item.singer[0].name 这么取也可以，但会影响性能，返回其它无用的字段
          return `${item.name} - ${item.singer}`
        }
      },
      searchMore() {
        if (!this.hasMore) return
        this.page++

        getSuggest(this.query, this.page, this.showSinger, pagenum).then((res) => {
          if (res.code === ERR_OK) {
            // 添加新数据，不是重新赋值
            // this.suggest = this.suggest.concat(this.getResult(res.data))
            this.suggest.push(...this.getResult(res.data))
            this._checkLastPageMore(res.data)
          }
        })
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          // 获取歌手的信息
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          // 共享该状态，传递给其它组件 传入mutation 的 载荷（payload）：singer
          // 相当于执行 mutations.js 的 state.singer = singer
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
        this.$emit('select', item)
      },
      refresh() {
        this.$refs.suggest.refresh()
      },
      _checkLastPageMore(data) {
        const song = data.song
        // 请求的是下一页的数据，这样避免多发一个请求，但有个小bug
        if (!song.list.length || (song.curpage * pagenum + song.curnum) > song.totalnum) {
          this.hasMore = false
        }
        // 解决bug：如果剩余的数据量少于每页最大请求数，则不会继续请求，数据渲染不完全
        if (!song.list.length || song.totalnum - ((song.curpage - 1) * pagenum + song.curnum) < pagenum && song.totalnum - ((song.curpage - 1) * pagenum + song.curnum) !== 0) {
          this.hasMore = true
        }
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albumid) {
            // 变为自己的实例
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      listScroll() {
        // 通知父组件，滚动前需要触发事件
        this.$emit('listScroll')
      },
      handlePlaylist(playlist) {
        this.$refs.suggestList.style.paddingBottom = playlist.length > 0 ? 60 + 'px' : 0
        this.$refs.suggest.refresh()
      },
      ...mapMutations({
        // 映射到 mutations-types 的  'SET_SINGER'
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query() {
        // 调用服务端
        this.search()
      }
    },
    components: {
      Loading,
      Scroll,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
      .showAllTip
        flex: 1
        padding-bottom: 20px
        text-align center
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
