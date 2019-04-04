import VeeValidate, { Validator } from 'vee-validate'
import Vue from 'vue'

Vue.use(VeeValidate)

// 如果没有传图片，则必须填文字内容
Validator.extend('required_if_no_image', (content, [images]) => {
  return {
    valid: !!content,
    data: {
      required: images.length === 0,
    },
  }
}, {
  hasTarget: true,
  computesRequired: true,
})

// 如果没有填文字内容，则必须至少上传一张图片
Validator.extend('not_empty_if_no_content', (images, [content]) => {
  return {
    valid: images.length > 0,
    data: {
      required: !content,
    },
  }
}, {
  hasTarget: true,
  computesRequired: true,
})
