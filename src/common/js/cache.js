/**
 * 本地储存搜索历史，利用了good-storage封装库
 */

import storage from 'good-storage'

function insertArr(val, arr, valCopy, maxNum) {
  let index = arr.findIndex(valCopy)
  if (index === 0) return

  // 将已存在的数据删除
  if (index > 0) arr.splice(index, 1)

  // 新数据总是第一行添加
  arr.unshift(val)

  // 旧数据总是最后一行删除
  if (maxNum && arr.length > maxNum) arr.pop()
}

function removeFormArr(arr, valCopy) {
  let index = arr.findIndex(valCopy)
  if (index > -1) arr.splice(index, 1)
}

// 设置一个内部变量值:搜索历史
const SEARCH_KEY = '__search__'
// 显示最大搜索记录数量
const MAX_SEARCH_NUM = 16

// 初始化搜索历史为空数组，并暴露方法给state.js
export function initSaveSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function saveSearch(query) {
  let getters = storage.get(SEARCH_KEY, [])
  insertArr(query, getters, (item) => {
    return item === query     // 相当于query的副本
  }, MAX_SEARCH_NUM)
  storage.set(SEARCH_KEY, getters)
  return getters
}

export function deleteSearch(query) {
  let getters = storage.get(SEARCH_KEY, [])
  removeFormArr(getters, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, getters)
  return getters
}

export function deleteAllSearch() {
  storage.remove(SEARCH_KEY)
  // 重置为初始值，返回空数组
  return []
}

// ------------------------------ 播放历史 ------------------------------
const PLAY_KEY = '__play__'
const MAX_PLAY_NUM = 120

export function initSavePlay() {
  return storage.get(PLAY_KEY, [])
}

export function savePlay(song) {
  let getters = storage.get(PLAY_KEY, [])
  insertArr(song, getters, (item) => {
    return item === song
  }, MAX_PLAY_NUM)
  storage.set(PLAY_KEY, getters)
  return getters
}

// ------------------------------ 喜欢的歌曲 ------------------------------
const FAVOUR_KEY = '__favour__'
const MAX_FAVOUR_NUM = 200

export function initFavouriteSong() {
  return storage.get(FAVOUR_KEY, [])
}

export function saveFavour(song) {
  let getters = storage.get(FAVOUR_KEY, [])
  insertArr(song, getters, (item) => {
    return item.id === song.id
  }, MAX_FAVOUR_NUM)
  storage.set(FAVOUR_KEY, getters)
  return getters
}

export function cancelFavour(song) {
  let getters = storage.get(FAVOUR_KEY, [])
  removeFormArr(getters, (item) => {
    return song.id === item.id
  })
  storage.set(FAVOUR_KEY, getters)
  return getters
}
