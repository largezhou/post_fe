<template>
  <v-snackbar
    v-model="shown"
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
      @click="shown = false"
    >
      <mdi-icon icon="close"/>
    </v-btn>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'
import { VSnackbar } from 'vuetify/lib'

import Vue from 'vue'

export default Vue.extend({
  name: 'Snackbar',
  extends: VSnackbar,
  data() {
    return {
      shown: false,
    }
  },
  props: {
    text: {
      type: [String, Object],
      required: true,
    },
    callback: Function,
  },
  mounted() {
    window.t = this
    this.shown = true
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
  watch: {
    shown(newValue) {
      if (!newValue) {
        if (typeof this.callback === 'function') {
          this.callback()
        }

        this.$nextTick(() => {
          this.$destroy()
        })
      }
    },
  },
})
</script>
