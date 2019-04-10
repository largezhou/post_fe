export const LAYOUT_NINE_GRID = 'nine_grid'
export const LAYOUT_CAROUSEL = 'carousel'

export const MAX_IMAGES_COUNT = 9

export const IMAGE_LOAD_STATE_INIT = 'init'
export const IMAGE_LOAD_STATE_LOADING = 'loading'
export const IMAGE_LOAD_STATE_DONE = 'done'

export const EMOJI_CAT_PEOPLE = 'people'
export const EMOJI_CAT_NATURE = 'nature'
export const EMOJI_CAT_FOOD_DRINK = 'food-drink'
export const EMOJI_CAT_ACTIVITY = 'activity'
export const EMOJI_CAT_TRAVEL_PLACES = 'travel-places'
export const EMOJI_CAT_OBJECTS = 'objects'
export const EMOJI_CAT_SYMBOLS = 'symbols'
export const EMOJI_CAT_FLAGS = 'flags'

export const EMOJI_CAT_MAP = {
  people: '笑脸和人',
  nature: '动物和自然',
  'food-drink': '吃喝',
  activity: '活动',
  'travel-places': '旅行和地点',
  objects: '目标',
  symbols: '符号',
  flags: '标识',
}

export const mapConstants = (names) => {
  const mapped = {}
  names.forEach((n) => {
    mapped[n] = () => {
      return eval(n)
    }
  })
  return mapped
}
