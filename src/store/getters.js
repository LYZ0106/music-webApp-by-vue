/**
 * Created by 刘彦佐 on 2017/6/21.
 */

  // 取 state.js 的数据
export const singer = state => state.singer

export const playing = state => state.playing
export const fullScreen = state => state.fullScreen
export const playlist = state => state.playlist
export const sequenceList = state => state.sequenceList
export const mode = state => state.mode
export const currentIndex = state => state.currentIndex

export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}

export const disc = state => state.disc

export const rank = state => state.rank

export const searchHistory = state => state.searchHistory

export const playHistory = state => state.playHistory
