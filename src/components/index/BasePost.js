export default {
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
  methods: {
    onPreviewImage(index) {
      log(index, this.images)
    },
  },
}
