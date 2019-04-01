export const LAYOUT_NINE_GRID = 'nine_grid'
export const LAYOUT_CAROUSEL = 'carousel'

export const mapConstants = (names) => {
  const mapped = {}
  names.forEach((n) => {
    mapped[n] = () => {
      return eval(n)
    }
  })
  return mapped
}
