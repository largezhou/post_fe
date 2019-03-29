import { Random } from 'mockjs'
import images from '../data/images'

export default {
  images: () => Random.shuffle(images).slice(0, Random.integer(0, 9)),
  content: () => Random.cparagraph(1, 8),
  layout: () => Random.pick(['nine_grid', 'nine_grid', 'carousel']),
  created_at: '@datetime',
}
