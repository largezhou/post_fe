export default {
  data: () => ({
    dialog: false,
  }),
  props: {
    resolve: {
      type: Function,
      default: () => () => {},
    },
    reject: {
      type: Function,
      default: () => () => {},
    },
    cancelAction: {
      type: String,
      default: 'reject',
    },
  },
  mounted() {
    this.dialog = true
  },
  methods: {
    onOk() {
      this.resolve()
      this.dialog = false
    },
  },
  watch: {
    dialog(newVal) {
      if (!newVal) {
        switch (this.cancelAction) {
          case 'resolve':
            this.resolve()
            break
          case 'reject':
            this.reject()
            break
          default:
          // do nothing
        }

        // 延迟删除元素，等待弹框消失动画
        setTimeout(() => {
          this.$destroy()
          const p = this.$el.parentElement
          p && p.removeChild(this.$el)
        }, 1000)
      }
    },
  },
}
