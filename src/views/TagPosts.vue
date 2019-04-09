<template>
  <v-flex class="content">
    <h1 class="grey--text text--darken-2 mt-4">#{{ $route.params.tagName }}#</h1>
    <posts :get-posts-function="getPosts"/>
  </v-flex>
</template>

<script>
import { getTagPosts } from '@/api/tags'
import Posts from '@/components/post/Posts'

export default {
  name: 'TagPosts',
  components: {
    Posts,
  },
  computed: {
    tagName() {
      return this.$route.params.tagName
    },
  },
  methods: {
    getPosts(params) {
      return getTagPosts(this.tagName, params)
    },
  },
  watch: {
    $route() {
      this.$bus.$emit('reload-posts')
    },
  },
}
</script>

<style scoped lang="scss">
.content {
  max-width: 600px;
}
</style>
