export const LAYOUT_NINE_GRID = 'nine_grid'
export const LAYOUT_CAROUSEL = 'carousel'

export const MAX_IMAGES_COUNT = 9

export const IMAGE_LOAD_STATE_INIT = 'init'
export const IMAGE_LOAD_STATE_LOADING = 'loading'
export const IMAGE_LOAD_STATE_DONE = 'done'
export const IMAGE_LOAD_STATE_ERROR = 'error'

export const EMOJI_CAT_PEOPLE = 'people'
export const EMOJI_CAT_NATURE = 'nature'
export const EMOJI_CAT_FOOD_DRINK = 'food-drink'
export const EMOJI_CAT_ACTIVITY = 'activity'
export const EMOJI_CAT_TRAVEL_PLACES = 'travel-places'
export const EMOJI_CAT_OBJECTS = 'objects'
export const EMOJI_CAT_SYMBOLS = 'symbols'
export const EMOJI_CAT_FLAGS = 'flags'

export const MAP_SEARCH_TYPE_ALL = '汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施'

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
