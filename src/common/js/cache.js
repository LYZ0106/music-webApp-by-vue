/**
 * 本地储存搜索历史，利用了good-storage封装库
 */

import storage from 'good-storage'

// 设置一个内部变量值:搜索历史
const SEARCH_KEY = '__search__'
// 显示最大搜索记录数量
const MAX_SEARCH_NUM = 16

// 初始化搜索历史为空数组，并暴露方法给state.js
export function initSaveSearch() {
  return storage.get(SEARCH_KEY, [])
}

function insertQuery(val, arr, valCopy, maxNum) {
  let index = arr.findIndex(valCopy)
  if (index === 0) return
  // 将已存在的数据删除
  if (index > 0) arr.splice(index, 1)
  // 新数据总是第一行添加
  arr.unshift(val)
  // 旧数据总是最后一行删除
  if (maxNum && arr.length > maxNum) arr.pop()
}

export function saveSearch(query) {
  let getters = storage.get(SEARCH_KEY, [])
  insertQuery(query, getters, (item) => {
    return item === query     // 相当于query的副本
  }, MAX_SEARCH_NUM)
  storage.set(SEARCH_KEY, getters)
  return getters
}

function deleteQuery(arr, valCopy) {
  let index = arr.findIndex(valCopy)
  if (index > -1) arr.splice(index, 1)
}

export function deleteSearch(query) {
  let getters = storage.get(SEARCH_KEY, [])
  deleteQuery(getters, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, getters)
  return getters
}

export function deleteAllSearch() {
  storage.remove(SEARCH_KEY)
  // 重置2为初始值，返回空数组
  return []
}

// ------------------------------ 搜索历史 ------------------------------
// 设置一个内部变量值:搜索历史
const PLAY_KEY = '__play__'
const MAX_PLAY_NUM = 120

// 初始化为播放歌曲空数组，并暴露方法给state.js
export function initSavePlay() {
  return storage.get(PLAY_KEY, [])
}

function insertPlay(val, arr, valCopy, maxNum) {
  let index = arr.findIndex(valCopy)
  if (index === 0) return

  // 将已存在的数据删除
  if (index > 0) arr.splice(index, 1)

  // 新数据总是第一行添加
  arr.unshift(val)

  // 旧数据总是最后一行删除
  if (maxNum && arr.length > maxNum) arr.pop()
}

export function savePlay(song) {
  let getters = storage.get(PLAY_KEY, [])
  insertPlay(song, getters, (item) => {
    return item === song
  }, MAX_PLAY_NUM)
  storage.set(PLAY_KEY, getters)
  return getters
}
