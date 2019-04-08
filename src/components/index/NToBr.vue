<template>
  <v-card-text
    class="post-content"
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

<style scoped lang="scss">
.post-content {
  font-size: 24px;
  font-weight: 400;
  line-height: 40px;
}
</style>
