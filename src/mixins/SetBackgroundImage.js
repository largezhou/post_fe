import { mapState } from 'vuex'

const STYLE_EL_ID = 'index-main-bg-style'

export default {
  computed: {
    ...mapState({
      configs: (state) => state.app.configs,
    }),
    // 黑魔法，，，
    bgStyleEl() {
      if (this.configs && this.configs.bg_image) {
        return `
<style id="${STYLE_EL_ID}">
.index-main:before {
  background-image: url(${this.configs.bg_image});
}
</style>
        `
      } else {
        return ''
      }
    },
  },
  watch: {
    bgStyleEl: {
      async handler(newVal) {
        // 先移除原来的
        const t = document.querySelector(`#${STYLE_EL_ID}`)
        if (t) {
          t.parentElement.removeChild(t)
        }
        if (newVal) {
          await this.$nextTick()
          this.$refs.main.insertAdjacentHTML('beforebegin', newVal)
        }
      },
      immediate: true,
    },
  },
}
