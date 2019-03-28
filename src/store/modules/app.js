export default {
  state: {
    sliderBar: false,
    widescreen: true,
  },
  mutations: {
    CHANGE_SLIDER_BAR(state, status) {
      state.sliderBar = status
    },
    TOGGLE_SLIDER_BAR(state) {
      state.sliderBar = !state.sliderBar
    },
    CHANGE_WIDESCREEN(state, status) {
      state.widescreen = status
    },
  },
}
