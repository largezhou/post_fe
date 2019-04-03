<template>
  <v-flex xs12>
    <!--之所以用 v-for 这样，是懒得处理在 images 为空数组时，images[0].src 报错的问题-->
    <v-img
      v-for="(img, i) of images.slice(0, 1)"
      v-show="single"
      :key="i"
      :src="img.src"
    />
    <v-carousel
      style="max-width: 500px;"
      height="auto"
      v-show="carousel"
      class="elevation-0"
      :cycle="false"
    >
      <v-carousel-item
        v-for="(img, i) of images"
        :key="i"
      >
        <v-img
          :src="img.src"
          aspect-ratio="1"
        />
      </v-carousel-item>
    </v-carousel>
    <draggable
      v-show="nineGrid"
      class="layout wrap"
      style="max-width: 500px;"
      :value="images"
      @input="$emit('update:images', arguments[0])"
      group="pd-preview-layout"
    >
      <v-flex
        :xs6="images.length === 4"
        :xs4="images.length !== 4"
        v-for="img of images"
        :key="img.src"
      >
        <v-img
          :src="img.src"
          aspect-ratio="1"
        />
      </v-flex>
    </draggable>
  </v-flex>
</template>

<script>
import { mapConstants } from '@/libs/constants'
import Draggable from 'vuedraggable'

export default {
  name: 'PdPreviewLayout',
  components: {
    Draggable,
  },
  props: {
    images: Array,
    layout: String,
  },
  computed: {
    ...mapConstants([
      'LAYOUT_CAROUSEL',
      'LAYOUT_NINE_GRID',
    ]),
    single() {
      return this.images.length <= 1
    },
    carousel() {
      return this.layout === this.LAYOUT_CAROUSEL && !this.single
    },
    nineGrid() {
      return this.layout === this.LAYOUT_NINE_GRID && !this.single
    },
  },
}
</script>
