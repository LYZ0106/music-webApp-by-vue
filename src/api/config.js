/**
 * Created by 刘彦佐 on 2017/6/14.
 */
export const commonParam = {
  g_tk: 5381,
  format: 'jsonp',
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0
}

export const options = {
  param: 'jsonpCallback'
}

// 重置回调函数getHotSongList 的名称
export const getHotSongListCbName = {
  param: 'jsonpCallback',
  name: 'playlistinfoCallback'
}

export const ERR_OK = 0
