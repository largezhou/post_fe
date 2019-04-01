<template>
  <v-flex class="image-preview-wrap">
    <v-img
      :src="src"
      aspect-ratio="1"
    />

    <v-scale-transition>
      <v-btn
        dark
        fab
        color="pink"
        @click="$emit('clear')"
        class="clear"
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
