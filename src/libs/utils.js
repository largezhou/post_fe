import Snackbar from '@/components/modals/Snackbar'
import store from '@/store'
import Compressor from 'compressorjs'

const utils = {}

export default utils

utils.snackbar = (msg) => {
  return new Promise((resolve) => {
    const callback = () => {
      resolve()
    }

    const ins = new Snackbar({
      propsData: {
        callback,
        text: msg,
      },
      store,
    })

    document.body.appendChild(ins.$mount().$el)
  })
}

utils.needAuth = (route) => {
  return route.matched.some(r => (r.meta && r.meta.auth))
}

/**
 * 压缩图片
 *
 * @param file
 * @returns {Promise<any>}
 */
utils.compressImage = (file) => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.8,
      success(res) {
        resolve(res)
      },
      error(err) {
        reject(err)
      },
    })
  })
}

/**
 * 生成缩略图
 *
 * @param file
 * @param maxDimensions 最大长宽，默认为 600
 * @return {Promise<any>}
 */
utils.makeThumb = (file, maxDimensions = 1200) => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6,
      maxWidth: maxDimensions,
      maxHeight: maxDimensions,
      success(res) {
        resolve(res)
      },
      error(err) {
        reject(err)
      },
    })
  })
}

/**
 * 从url创建一个a标签并返回，用来获取url中的各种属性，比如host，path，hash等
 *
 * @param url
 * @returns {HTMLElement}
 */
utils.getUrlObj = (url) => {
  const a = document.createElement('a')
  a.href = url

  return a
}

/**
 * 获取 url 中的 query
 *
 * @param url
 * @return {Object}
 */
utils.queryFromUrl = (url) => {
  url = utils.getUrlObj(url).search

  const query = {}
  let pairs = (url[0] === '?' ? url.substr(1) : url).split('&')
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=')
    if (pair[0]) {
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
    }
  }

  return query
}

/**
 * 获取输入框元素中，光标所在位置前一个字符
 *
 * @param el 输入框元素
 * @param end 光标位置
 * @returns {String}
 */
utils.getCharBeforeCursor = (el, end) => {
  end = end || el.selectionEnd
  return el.value[end - 1]
}

/**
 * 获取 el 输入框元素中，光标所在位置（相对于屏幕的 x y 坐标）
 *
 * @param el 输入框元素
 * @param end 当时输入框中光标处于文字中的位置，默认自动从 el 中获取
 * @returns {ClientRect | DOMRect}
 */
utils.getCursorPosition = (el, end) => {
  end = end || el.selectionEnd
  // 光标前的内容
  const beforeText = el.value.slice(0, end)
  // 光标后的内容
  const afterText = el.value.slice(end)
  // 对影响 UI 的特殊元素编码
  const escape = function (text) {
    return text.replace(/[<>`"&]/g, '?')
      .replace(/\r\n|\r|\n/g, '<br>')
      .replace(/\s/g, '&nbsp;')
  }
  // 创建镜像内容，复制样式
  let mirror =
    '<div class="content-editor-cursor">' +
    escape(beforeText) +
    '<span>|</span>' +
    escape(afterText) +
    '</div>'

  // 添加到 输入框 的同级，注意设置定位及 zIndex，使两个元素重合
  el.insertAdjacentHTML('afterend', mirror)
  mirror = document.querySelector('.content-editor-cursor')

  // 复制 输入框 的样式
  Object.assign(
    mirror.style,
    document.defaultView.getComputedStyle(el, null),
  )
  // 同步滚动条
  mirror.scrollTop = el.scrollTop
  // 通过镜像元素中的假光标占位元素获取像素位置
  const pos = mirror.querySelector('span').getBoundingClientRect()
  // 用完就扔，很残忍，，，
  mirror.parentNode.removeChild(mirror)

  return pos
}

/**
 * 检测鼠标是否点击到 el 元素区域内
 *
 * @param el
 * @param x
 * @param y
 * @returns {boolean}
 */
utils.clickedInEl = (el, x, y) => {
  const b = el.getBoundingClientRect()
  return x >= b.left && x <= b.right && y >= b.top && y <= b.bottom
}
