// Action 提交的是 mutation，而不是直接变更状态,为了处理异步操作
import * as types from './mutations-types.js'
import {playMode} from '../common/js/config.js'
import {shuffle} from 'common/js/util'
import {saveSearch, deleteSearch, deleteAllSearch, savePlay} from '../common/js/cache.js'

function getIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = getIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 乱序播放
export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, shuffle(list))
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 插入一首歌曲播放
export const insertSong = function ({commit, state}, song) {
  // ----------------------改变 playlist ------------------------
  // 不能接修改state应该缓存个副本.slice()
  let playlist = state.playlist.slice()
  let currentIndex = state.currentIndex

  // 这句必须在 currentIndex++ 前面
  let currentSong = playlist[currentIndex]
  currentIndex++

  // 返回已经添加过的歌曲的索引
  let hasSongIndex = getIndex(playlist, song)

  // 把将要插入的歌曲添加到当前歌曲的后面
  playlist.splice(currentIndex, 0, song)
  if (hasSongIndex > -1) {
    if (currentIndex > hasSongIndex) { // 新插入的歌曲在已经存在的歌曲的后面
      // 删除前面的歌曲
      playlist.splice(hasSongIndex, 1)
      currentIndex--
    } else {
      playlist.splice(hasSongIndex + 1, 1)
    }
  }

  // ----------------------改变 sequenceList ------------------------
  let sequenceList = state.sequenceList.slice()

  // 将要插入的位置
  let insertSongIndex = getIndex(sequenceList, currentSong) + 1

  // 返回已经添加过的歌曲的索引
  let hasSequenceIndex = getIndex(sequenceList, song)
  sequenceList.splice(insertSongIndex, 0, song)
  if (hasSequenceIndex > -1) {
    if (insertSongIndex > hasSequenceIndex) {
      // 删除前面的歌曲
      sequenceList.splice(hasSequenceIndex, 1)
    } else {
      sequenceList.splice(hasSequenceIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 搜索结果与localstore结合使用
export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const deleteAllSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, deleteAllSearch())
}

// 删除自己列表的一首歌曲
export const deleteSong = function ({commit, state}, song) {
  // ----------------------改变 playlist ------------------------
  let playlist = state.playlist.slice()
  // 移除歌曲列表的索引
  let deleteSongIndex = getIndex(playlist, song)
  playlist.splice(deleteSongIndex, 1)

  // ----------------------改变 sequenceList ------------------------
  let currentIndex = state.currentIndex
  let sequenceList = state.sequenceList.slice()
  // 返回已经添加过的歌曲的索引
  let hasSequenceIndex = getIndex(sequenceList, song)
  sequenceList.splice(hasSequenceIndex, 1)

  if (deleteSongIndex < currentIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playlist.length > 0
  commit(types.SET_PLAYING_STATE, playingState)
}

// 删除自己列表的全部歌曲
export const deleteAllSong = function ({commit, state}, song) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

// ---------------------------- 播放列表中的最近播放 ---------------------------
// 最近播放
export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}
