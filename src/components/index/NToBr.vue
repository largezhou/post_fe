<template>
  <v-card-text
    class="headline"
    v-html="html"
  />
</template>

<script>
export default {
  name: 'NToBr',
  props: {
    content: String,
  },
  computed: {
    html() {
      return this.content.replace(/\n/g, '<br>')
    },
  },
}
</script>
