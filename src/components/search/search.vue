<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <scroll class="shortcut" ref="shortcut" :data="dataWrap">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="item in hotkey" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @select="addQuery"
                         @deletes="deleteSearch"
                         :searches="searchHistory">
            </search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest
        :query="query"
        @select="saveSearch"
        @listScroll="blurInput"
        ref="suggest">
      </suggest>
    </div>
    <confirm :text="confirmText"
             ref="confirm"
             @confirm="deleteAllSearch"
             @cancel="hideConfirm"></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import Suggest from 'components/suggest/suggest'
  import {playListMixin, searchMixin} from 'common/js/mixin'
  import {mapActions} from 'vuex'
  import searchList from 'base/search-list/search-list'
  import Confirm from 'base/confirm/confirm'
  import Scroll from 'base/scroll/scroll'

  export default {
    mixins: [playListMixin, searchMixin],
    data() {
      return {
        hotkey: []
      }
    },
    created() {
      this._getHotKey()
    },
    computed: {
      confirmText() {
        return '确认删除吗？'
      },
      dataWrap() {
        return this.hotkey.concat(this.searchHistory)
      }
    },
    methods: {
      deleteAllSearch() {
        this.deleteAllSearchHistory()
        this.$refs.confirm.hide()
      },
      showConfirm() {
        this.$refs.confirm.show()
      },
      hideConfirm() {
        this.$refs.confirm.hide()
      },
      _getHotKey() {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotkey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? 60 + 'px' : 0
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
      },
      ...mapActions([
        'deleteAllSearchHistory'
      ])
    },
    // 页面从suggest切换到search时，query从有到无
    watch: {
      query(newVal) {
        if (!newVal) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    },
    components: {
      SearchBox,
      Suggest,
      searchList,
      Confirm,
      Scroll
    }
    // 并不比u容易
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
