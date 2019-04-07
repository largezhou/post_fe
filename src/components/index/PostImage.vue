<template>
  <!--单张图片 强制直接显示-->
  <a
    v-if="images.length === 1"
    :href="images[0].thumb"
    target="_blank"
  >
    <v-img :src="images[0].thumb"/>
  </a>

  <!--轮播-->
  <v-carousel
    v-else-if="post.layout === 'carousel'"
    class="elevation-0"
    :height="widescreen ? 600 : 400"
    :cycle="false"
  >
    <v-carousel-item
      v-for="(img, i) of images"
      class="pointer"
      :key="i"
      :src="img.thumb"
      @click.stop="onPreviewImage(i)"
    />
  </v-carousel>

  <!--九宫格-->
  <v-container
    v-else
    grid-list-sm
    fluid
    pa-2
  >
    <v-layout
      row
      wrap
    >
      <v-flex
        v-for="(img, i) of images"
        :key="i"
        :xs6="images.length === 4"
        :xs4="images.length !== 4"
        d-flex
      >
        <v-img
          class="pointer"
          :src="img.thumb"
          aspect-ratio="1"
          @click.stop="onPreviewImage(i)"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PostImage',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState({
      widescreen: (state) => state.app.widescreen,
    }),
    images() {
      return this.post.images
    },
  },
  methods: {
    onPreviewImage(index) {
      this.$bus.$emit('preview-image', this.images, index)
    },
  },
}
</script>
