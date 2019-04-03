<template>
  <v-dialog
    v-model="dialog"
    hide-overlay
    fullscreen
    @keydown.esc="dialog = false"
    dark
  >
    <v-carousel
      class="elevation-0"
      :cycle="false"
      :value="cur"
      height="100%"
    >
      <v-carousel-item
        v-for="(src, i) of images"
        :key="i"
      >
        <v-layout
          class="align-center justify-center h100"
          @click.self="onClickOtherArea"
        >
          <a
            :href="src"
            target="_blank"
          >
            <img :src="src"/>
          </a>
        </v-layout>
      </v-carousel-item>
    </v-carousel>

    <v-btn
      class="clear"
      dark
      fab
      absolute
      right
      small
      color="pink"
      @click="dialog = false"
    >
      <mdi-icon>close</mdi-icon>
    </v-btn>
  </v-dialog>
</template>

<script>
export default {
  name: 'PreviewDialog',
  data: () => ({
    dialog: false,
    images: [],
    cur: 0,
  }),
  created() {
    this.$bus.$on('preview-image', this.onPreviewImage)
  },
  beforeDestroy() {
    this.$bus.$off('preview-image', this.onPreviewImage)
  },
  methods: {
    onPreviewImage(images, cur) {
      this.images = images
      this.cur = cur

      this.dialog = true
    },

    /**
     * 点击轮播图其他空白区域，关闭弹窗
     * @param e
     */
    onClickOtherArea(e) {
      this.dialog = false
    },
  },
  watch: {
    dialog(newVal) {
      if (!newVal) {
        this.images = []
        this.cur = 0
      }
    },
  },
}
</script>

<style scoped lang="scss">
.v-dialog__content--active {
  background: black;
  pointer-events: initial;
}

/deep/ {
  .v-dialog {
    margin: 0;
  }

  .v-carousel {
    .v-window__container,
    .v-window-item,
    .v-carousel__item {
      height: 100% !important;
    }

    img {
      max-height: 100%;
      max-width: 100%;
    }
  }
}

.clear {
  top: 16px;
}
</style>
