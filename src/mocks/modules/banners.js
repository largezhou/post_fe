import mock from '../mock'
import images from '../data/images'
import _shuffle from 'lodash/shuffle'

mock('/banners', 'get', {
  data: _shuffle(images).slice(0, 3),
})
