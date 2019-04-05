<template>
  <v-icon v-bind="$attrs">mdi-{{ icon }}</v-icon>
</template>

<script>
export default {
  name: 'MdiIcon',
  props: {
    icon: String,
  },
}
</script>
