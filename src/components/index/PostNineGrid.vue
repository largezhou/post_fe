<template>
  <v-container
    grid-list-sm
    fluid
    pa-2
  >
    <v-layout
      row
      wrap
    >
      <v-flex
        v-for="(src, i) in images"
        :key="i"
        :xs6="images.length === 4"
        :xs4="images.length !== 4"
        d-flex
      >
        <v-img
          :src="src"
          aspect-ratio="1"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'PostNineGrid',
  props: {
    images: Array,
  },
}
</script>
