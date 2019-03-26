<template>
  <v-icon v-bind="$attrs">mdi-{{ icon }}</v-icon>
</template>

<script>
export default {
  name: 'MdiIcon',
  computed: {
    icon() {
      if (this.$slots.default) {
        return this.$slots.default[0].text
      } else {
        return ''
      }
    },
  },
}
</script>
