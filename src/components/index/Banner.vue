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
import { getBanners } from '@/api/banners'

export default {
  name: 'Banner',
  data: () => ({
    bannerHeight: window.innerHeight,
    items: [],
  }),
  created() {
    this.getBanners()
  },
  methods: {
    test(src) {
      log(src)
    },
    async getBanners() {
      const { data } = await getBanners()
      this.items = data
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
