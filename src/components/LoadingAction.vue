<template>
  <component
    :is="isComp"
    v-bind="$attrs"
    v-on="$listeners"
    @click="onAction"
    :loading="loading"
    :disabled="loading"
  >
    <slot/>
  </component>
</template>

<script>
import { VBtn } from 'vuetify/lib'

export default {
  name: 'LoadingAction',
  components: {
    VBtn,
  },
  data: () => ({
    loading: false,
  }),
  props: {
    action: Function,
    /**
     * 作为什么组件
     */
    isComp: {
      type: String,
      default: 'v-btn',
    },
  },
  methods: {
    async onAction() {
      if (this.loading) {
        return false
      }
      this.loading = true
      try {
        await this.action()
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
