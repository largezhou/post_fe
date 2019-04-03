<template>
  <v-flex xs12>
    <v-img
      v-if="single"
      :src="images[0].src"
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
      return this.images.length === 1
    },
    carousel() {
      return this.layout === this.LAYOUT_CAROUSEL && this.images.length > 1
    },
    nineGrid() {
      return this.layout === this.LAYOUT_NINE_GRID && this.images.length > 1
    },
  },
}
</script>
