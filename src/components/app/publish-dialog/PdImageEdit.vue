<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
    @keydown.esc="dialog = false"
  >
    <v-card v-if="image">
      <v-card-text>
        <v-img
          :src="image.src"
          aspect-ratio="1"
        />
        <v-checkbox v-model="image.naked" label="裸露"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          flat
          @click="dialog = false"
        >好的</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'PdImageEdit',
  data: () => ({
    dialog: false,
    image: null,
  }),
  created() {
    this.$bus.$on('image-edit', this.onImageEdit)
  },
  beforeDestroy() {
    this.$bus.$off('image-edit', this.onImageEdit)
  },
  methods: {
    onImageEdit(image) {
      this.image = image
      this.dialog = true
    },
  },
  watch: {
    dialog(newVal) {
      if (!newVal) {
        this.image = null
      }
    },
  },
}
</script>
