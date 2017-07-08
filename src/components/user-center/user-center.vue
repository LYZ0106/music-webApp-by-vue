<template>
  <transition name="slide">
    <div class="user-center" ref="userCenter">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :currentIndex="currentIndex" @switch="switchItem" :switchesText="switchesText"></switches>
      </div>
      <div class="play-btn">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper">
        <scroll class="list-scroll" v-if="currentIndex===0">
          <div class="list-inner">
            <div></div>
          </div>
        </scroll>
        <scroll class="list-scroll" :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper">

      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters, mapActions} from 'vuex'
  import Switches from 'base/switches/switches'
  import SongList from 'base/song-list/song-list'
  import Scroll from 'base/scroll/scroll'
  import {playListMixin} from 'common/js/mixin'

  export default {
    mixins: [playListMixin],
    data() {
      return {
        currentIndex: 0
      }
    },
    computed: {
      switchesText() {
        return ['我最爱的', '最近播放']
      },
      ...mapGetters([
        'playHistory'
      ])
    },
    methods: {
      back() {
        this.$router.back()
      },
      switchItem(index) {
        this.currentIndex = index
      },
      selectSong(item) {
        this.insertSong(item)
      },
      handlePlaylist(playlist) {
        this.$refs.userCenter.style.bottom = playlist.length > 0 ? 60 + 'px' : 0
      },
      ...mapActions([
        'insertSong'
      ])
    },
    components: {
      Switches,
      SongList,
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
