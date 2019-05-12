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
          @click="onOk"
        >删掉</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'
import DynamicDialog from '@/mixins/DynamicDialog'

export default Vue.extend({
  name: 'PostDeleteConfirmDialog',
  mixins: [DynamicDialog],
})
</script>
