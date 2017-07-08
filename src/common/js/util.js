function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 洗牌
export function shuffle(arr) {
  // 建立副本，避免修改原歌单playlist顺序
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let temp = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = temp
  }
  return _arr
}

// 节流函数
export function debounce(fun, delay) {
  // 建立一个闭包
  let timer
  // 函数柯里化，调用一个函数返回另一个函数
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fun.apply(this, args)
    }, delay)
  }
}

// 定义一个只执行一次的函数
export function runOnce(fn) {
  return function () {
    if (fn) {
      try { // 用arguments来把所有的参数传递给被调用对象
        fn.apply(this, arguments)
      } catch (e) {
        throw new Error(e)
      } finally {
        fn = null
      }
    }
  }
}
