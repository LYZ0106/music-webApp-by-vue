<template>
  <transition name="slide">
    <music-list :songs="songList" :bg-image="bgImage" :title="title" :rank="rankState"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getTopSong} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'

  export default {
    data() {
      return {
        songList: [],
        rankState: true
      }
    },
    created() {
      this._getTopSong()
    },
    computed: {
      bgImage() {
        if (this.songList.length) {
          return this.songList[0].image
        }
        return ''
      },
      title() {
        return this.rank.topTitle
      },
      // Getters 可以认为是 store 的计算属性
      ...mapGetters([
        'rank'
      ])
    },
    methods: {
      _getTopSong() {
        if (!this.rank.id) {
          this.$router.push('/rank')
          return
        }

        getTopSong(this.rank.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songList = this._normalizeSongs(res.songlist)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach(({data}) => {
          if (data.songid && data.albummid) {
            ret.push(createSong(data))
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
