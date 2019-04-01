<template>
  <v-flex xs12>
    <v-img
      v-show="images.length === 1"
      :src="images[0].src"
    />
    <v-carousel
      style="width: 500px;"
      v-show="carousel"
      class="elevation-0"
      :cycle="false"
    >
      <v-carousel-item
        v-for="img of images"
        :key="img.src"
        :src="img.src"
      />
    </v-carousel>
    <v-layout
      wrap
      style="width: 500px;"
      v-show="nineGrid"
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
    </v-layout>
  </v-flex>
</template>

<script>
import { mapConstants } from '@/libs/constants'

export default {
  name: 'PdPreviewLayout',
  props: {
    images: Array,
    layout: String,
  },
  computed: {
    ...mapConstants([
      'LAYOUT_CAROUSEL',
      'LAYOUT_NINE_GRID',
    ]),
    carousel() {
      return this.layout === this.LAYOUT_CAROUSEL && this.images.length > 1
    },
    nineGrid() {
      return this.layout === this.LAYOUT_NINE_GRID && this.images.length > 1
    },
  },
}
</script>
