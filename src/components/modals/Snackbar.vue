<template>
  <v-snackbar
    v-model="dialog"
    :top="widescreen"
    v-bind="$props"
  >
    <div
      v-if="isStringMsg"
      v-html="text"
    />
    <div
      v-else
      ref="renderNode"
    />
    <v-btn
      color="pink"
      flat
      @click="dialog = false"
    >
      <mdi-icon icon="close"/>
    </v-btn>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'
import { VSnackbar } from 'vuetify/lib'
import DynamicDialog from '@/mixins/DynamicDialog'

import Vue from 'vue'

export default Vue.extend({
  name: 'Snackbar',
  extends: VSnackbar,
  mixins: [DynamicDialog],
  props: {
    text: {
      type: [String, Object],
      required: true,
    },
  },
  mounted() {
    this.handleRenderContent()
  },
  computed: {
    ...mapState({
      widescreen: (state) => state.app.widescreen,
    }),
    isStringMsg() {
      return typeof this.text === 'string'
    },
  },
  methods: {
    handleRenderContent() {
      if (this.isStringMsg) {
        return
      }

      this.$nextTick(() => {
        this.$refs.renderNode.appendChild(this.text.$mount().$el)
      })
    },
  },
})
</script>
