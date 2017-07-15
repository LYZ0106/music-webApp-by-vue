/**
 * Created by 刘彦佐 on 2017/6/15.
 */
export function addClass(el, className) {
  if (hasClass(el, className)) return

  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

/*
 * 获取 data- 属性
 * @param {string} el dom对象
 * @param｛string｝ val 有值时set，无值时get
 */
export function getData(el, name, val) {
  const prefix = `data-`
  if (val) return el.setAttribute(prefix + name, val)
  return el.getAttribute(prefix + name)
}

// 加css前缀
let elementStyle = document.createElement('div').style
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  // for...in 遍历（当前对象及其原型上的）每一个属性名称,而 for...of遍历（当前对象上的）每一个属性值:
  for (let key in transformNames) {
    if (transformNames.hasOwnProperty(key)) {
      if (typeof elementStyle[transformNames[key]] !== 'undefined') {
        return key
      }
    }
  }
  return false
})()

export function preStyle(style) {
  if (!vendor) return false
  if (vendor === 'standard') return style
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

