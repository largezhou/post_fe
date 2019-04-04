<template>
  <v-flex class="image-preview-wrap">
    <v-img
      :src="src"
      aspect-ratio="1"
    />

    <v-scale-transition>
      <v-btn
        class="clear"
        dark
        fab
        color="pink"
        @click.stop="$emit('clear')"
      >
        <mdi-icon>close</mdi-icon>
      </v-btn>
    </v-scale-transition>
  </v-flex>
</template>

<script>
export default {
  name: 'PdImage',
  props: {
    src: String,
  },
}
</script>

<style scoped lang="scss">
.image-preview-wrap {
  height: 100px;
  width: 100px;
  max-width: 100px;
  position: relative;
}

.clear {
  position: absolute;
  top: 2px;
  right: 2px;
  z-index: 2;
  width: 26px;
  height: 26px;
  margin: 0;
}
</style>
