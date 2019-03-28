<template>
  <v-carousel
    hide-delimiters
    :height="bannerHeight"
    class="banner"
  >
    <v-carousel-item
      class="pointer"
      v-for="(src, i) of items"
      :key="i"
      :src="src"
      @click.stop="test(src)"
    />
  </v-carousel>
</template>

<script>
export default {
  name: 'Banner',
  data: () => ({
    bannerHeight: window.innerHeight,
    items: [
      'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
      'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
      'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
    ],
  }),
  methods: {
    test(src) {
      log(src)
    },
  },
}
</script>

<style scoped lang="scss">
.banner {
  box-shadow: none;

  /deep/ {
    .v-carousel__prev,
    .v-carousel__next {
      width: 100px;
      height: 100%;
      transform: scaleX(0.7);
      top: 0;

      .v-btn {
        height: 100%;
        width: 100%;

        .v-icon {
          color: transparent;
        }

        .v-ripple__container * {
          background: transparent;
        }
      }
    }

    .v-carousel__prev {
      left: -52px;

      .v-btn {
        border-radius: 0 70% 70% 0;
      }
    }

    .v-carousel__next {
      right: -52px;

      .v-btn {
        border-radius: 70% 0 0 70%;
      }
    }
  }
}
</style>
