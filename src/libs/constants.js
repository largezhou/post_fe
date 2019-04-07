export const LAYOUT_NINE_GRID = 'nine_grid'
export const LAYOUT_CAROUSEL = 'carousel'

export const MAX_IMAGES_COUNT = 9

export const IMAGE_LOAD_STATE_INIT = 'init'
export const IMAGE_LOAD_STATE_LOADING = 'loading'
export const IMAGE_LOAD_STATE_DONE = 'done'

export const mapConstants = (names) => {
  const mapped = {}
  names.forEach((n) => {
    mapped[n] = () => {
      return eval(n)
    }
  })
  return mapped
}
