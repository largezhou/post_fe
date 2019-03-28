export default {
  state: {
    sliderBar: false,
  },
  mutations: {
    CHANGE_SLIDER_BAR(state, status) {
      state.sliderBar = status
    },
    TOGGLE_SLIDER_BAR(state) {
      state.sliderBar = !state.sliderBar
    },
  },
}
