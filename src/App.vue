<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab.vue'
  import Player from 'components/player/player'

  // 禁止用户拖动导航头放大页面
  document.addEventListener('touchmove', function (e) {
    e.preventDefault()
  }, false)

  export default {
    components: {
      MHeader,
      Tab,
      Player
    }
  }
</script>
