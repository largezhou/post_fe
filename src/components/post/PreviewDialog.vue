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
        v-for="(img, i) of images"
        :key="i"
      >
        <v-layout
          class="align-center justify-center h100"
          @click.self="onClickOtherArea"
        >
          <img :src="img.src" @click="openImgLink(i)"/>
          <a
            ref="imgLinks"
            :href="img.src"
            target="_blank"
          />
        </v-layout>
      </v-carousel-item>
    </v-carousel>

    <v-btn
      class="clear"
      dark
      fab
      absolute
      right
      color="pink"
      @click="dialog = false"
    >
      <mdi-icon icon="close"/>
    </v-btn>
  </v-dialog>
</template>

<script>
import Vue from 'vue'
import DynamicDialog from '@/mixins/DynamicDialog'

export default Vue.extend({
  name: 'PreviewDialog',
  mixins: [DynamicDialog],
  props: {
    images: Array,
    cur: Number,
  },
  methods: {
    /**
     * 点击轮播图其他空白区域，关闭弹窗
     * @param e
     */
    onClickOtherArea(e) {
      this.dialog = false
    },
    /**
     * 图片用 a 标签包住的话，样式不好调，暂时用这种方式，打开图片链接
     * @param index
     */
    openImgLink(index) {
      const t = this.$refs.imgLinks
      t && t[index].click()
    },
  },
})
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

$t: 30px;
.clear {
  top: 16px;
  width: $t;
  height: $t;
}
</style>
