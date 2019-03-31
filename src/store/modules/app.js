export default {
  state: {
    sliderBar: false,
    widescreen: true,
    mobile: navigator.userAgent.indexOf('Mobile') !== -1,
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
