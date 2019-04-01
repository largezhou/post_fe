import { Random } from 'mockjs'
import images from '../data/images'
import { LAYOUT_CAROUSEL, LAYOUT_NINE_GRID } from '@/libs/constants'

export default {
  images: () => Random.shuffle(images).slice(0, Random.integer(0, 9)),
  content: () => Random.cparagraph(1, 8),
  layout: () => Random.pick([LAYOUT_NINE_GRID, LAYOUT_NINE_GRID, LAYOUT_CAROUSEL]),
  created_at: '@datetime',
}
