<template>
  <v-dialog
    v-model="dialog"
    @keydown.esc="dialog = false"
    max-width="290"
  >
    <v-card>
      <v-card-title class="headline">确认</v-card-title>
      <v-card-text class="red--text">删除后不能恢复的，，，</v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          flat="flat"
          @click="dialog = false"
        >留着</v-btn>

        <v-btn
          color="red"
          flat="flat"
          @click="onConfirm"
        >删掉</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DeleteConfirmDialog',
  data: () => ({
    dialog: false,
  }),
  created() {
    this.$bus.$on('post-delete', this.onPostDelete)
  },
  beforeDestroy() {
    this.$bus.$off('post-delete', this.onPostDelete)
  },
  methods: {
    onPostDelete() {
      this.dialog = true
    },
    onConfirm() {
      this.$emit('confirmed')
      this.dialog = false
    },
  },
  watch: {
    dialog(newVal) {
      if (!newVal) {
        this.$emit('closed')
      }
    },
  },
}
</script>
