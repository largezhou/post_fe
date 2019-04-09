import { Random } from 'mockjs'
import images from '../data/images'
import { LAYOUT_CAROUSEL, LAYOUT_NINE_GRID } from '@/libs/constants'

export default {
  'id|+1': 1,
  images: () => {
    return Random
      .shuffle(images)
      .slice(0, Random.integer(0, 9))
      .map((src) => ({
        thumb: postImage(),
        src,
      }))
  },
  content: () => '#标签1# ' + Random.cparagraph(1, 8) + ' #标签2#',
  layout: () => Random.pick([LAYOUT_NINE_GRID, LAYOUT_NINE_GRID, LAYOUT_CAROUSEL]),
  created_at: '@datetime',
}

export const postImage = () => Random.image(
  '600x600',
  Random.pick([
    '#8D6E63',
    '#FFEE58',
    '#D81B60',
    '#FF6600',
    '#4A7BF7',
    '#50B347',
    '#894FC4',
  ]),
  '#FFF',
  'thumb',
)
