<template>
  <!--单张图片 强制直接显示-->
  <a
    v-if="images.length === 1"
    :href="images[0].src"
    target="_blank"
  >
    <img
      class="post-single-image"
      :class="{ loading: isLoading(images[0]) }"
      :src="src(images[0])"
    />
  </a>

  <!--轮播-->
  <v-carousel
    v-else-if="images.length > 1 && post.layout === LAYOUT_CAROUSEL"
    class="elevation-0"
    height="auto"
    style="min-height: 300px;"
    :cycle="false"
  >
    <v-carousel-item
      v-for="(img, i) of images"
      class="pointer"
      :class="{ loading: isLoading(img) }"
      :key="i"
      @click.stop="onPreviewImage(i)"
    >
      <v-img
        :src="src(img)"
        aspect-ratio="1"
      />
    </v-carousel-item>
  </v-carousel>

  <!--九宫格-->
  <v-container
    v-else-if="images.length > 1 && post.layout === LAYOUT_NINE_GRID"
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
          :class="{ loading: isLoading(img) }"
          :src="src(img)"
          aspect-ratio="1"
          @click.stop="onPreviewImage(i)"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapConstants } from '@/libs/constants'

export default {
  name: 'PostImage',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapConstants([
      'IMAGE_LOAD_STATE_INIT',
      'IMAGE_LOAD_STATE_LOADING',
      'IMAGE_LOAD_STATE_DONE',

      'LAYOUT_NINE_GRID',
      'LAYOUT_CAROUSEL',
    ]),
    images() {
      return this.post.images
    },
  },
  methods: {
    isLoading(img) {
      return img.loadState === this.IMAGE_LOAD_STATE_LOADING
    },
    onPreviewImage(index) {
      this.$bus.$emit('preview-image', this.images, index)
    },
    src(img) {
      switch (img.loadState) {
        case this.IMAGE_LOAD_STATE_LOADING:
          return require('@/assets/empty_grey_512.png')
        case this.IMAGE_LOAD_STATE_DONE:
          return img.thumb
        default:
          return ''
      }
    },
  },
}
</script>

<style scoped lang="scss">
@keyframes loading {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

.loading {
  animation-name: loading;
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.post-single-image {
  width: 100%;
}
</style>
