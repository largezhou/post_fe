export default {
  data: () => ({
    dialog: false,
  }),
  props: {
    resolve: Function,
    reject: Function,
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
        this.reject()
        // 延迟删除元素，等待弹框消失动画
        setTimeout(() => {
          this.$destroy()
          this.$el.parentElement.removeChild(this.$el)
        }, 1000)
      }
    },
  },
}
