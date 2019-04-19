import mock from '../mock'
import { Random } from 'mockjs'
import images from '../data/images'

mock('/configs', 'get', {
  data: {
    bg_image: () => Random.pick(images),
  },
})
