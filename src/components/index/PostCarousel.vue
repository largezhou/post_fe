<template>
  <v-carousel
    class="elevation-0"
    :height="widescreen ? 600 : 400"
    :cycle="false"
  >
    <v-carousel-item
      v-for="(src, i) in images"
      :key="i"
      :src="src"
    />
  </v-carousel>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'PostCarousel',
  props: {
    images: Array,
  },
  computed: {
    ...mapState({
      widescreen: (state) => state.app.widescreen,
    }),
  },
}
</script>

<style scoped lang="scss">
/deep/ {
  .v-carousel__controls {
    .v-btn {
      width: 25px;
      height: 25px;
      margin: 0 !important;
    }

    .v-icon {
      font-size: 16px !important;
    }
  }
}
</style>
