import Snackbar from '@/components/modals/Snackbar'
import store from '@/store'
import EXIF from 'exif-js'

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
 * 处理手机照片旋转问题
 *
 * @param file
 * @returns {Promise<any>}
 */
utils.fixImageOrientation = (file) => {
  return new Promise((resolve) => {
    // 获取图片
    const img = new Image()
    img.src = window.URL.createObjectURL(file)
    img.onerror = () => resolve(file)
    img.onload = () => {
      // 获取图片元数据（EXIF 变量是引入的 exif-js 库暴露的全局变量）
      EXIF.getData(img, function () {
        const self = this
        // 获取图片旋转标志位
        const orientation = EXIF.getTag(self, 'Orientation')
        // 根据旋转角度，在画布上对图片进行旋转
        if (orientation === 3 || orientation === 6 || orientation === 8) {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          switch (orientation) {
            case 3: // 旋转180°
              canvas.width = img.width
              canvas.height = img.height
              ctx.rotate((180 * Math.PI) / 180)
              ctx.drawImage(img, -img.width, -img.height, img.width, img.height)
              break
            case 6: // 旋转90°
              canvas.width = img.height
              canvas.height = img.width
              ctx.rotate((90 * Math.PI) / 180)
              ctx.drawImage(img, 0, -img.height, img.width, img.height)
              break
            case 8: // 旋转-90°
              canvas.width = img.height
              canvas.height = img.width
              ctx.rotate((-90 * Math.PI) / 180)
              ctx.drawImage(img, -img.width, 0, img.width, img.height)
              break
          }
          // 返回新图片
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name))
          }, file.type, 0.92)
        } else {
          return resolve(file)
        }
      })
    }
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
 * 生成缩略图
 *
 * @param file
 * @param maxDimensions 最大长宽，默认为 600
 * @return {Promise<any>}
 */
utils.makeThumb = (file, maxDimensions = 1200) => {
  return new Promise((resolve, reject) => {
    // 500 KB 以下不压缩
    if (file.size < 500 * 1024) {
      return resolve(file)
    }
    // 获取图片（加载图片是为了获取图片的宽高）
    const img = new Image()
    img.src = window.URL.createObjectURL(file)
    img.onerror = () => reject(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let w = img.width
      let h = img.height

      if (w <= maxDimensions && h <= maxDimensions) {
        return resolve(file)
      }

      const ratio = maxDimensions / (w > h ? w : h)
      w *= ratio
      h *= ratio

      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      document.body.appendChild(canvas)

      canvas.toBlob((blob) => {
        resolve(new File([blob], file.name))
      }, file.type, 0.92)
    }
  })
}
