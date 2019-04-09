<template>
  <v-content class="pahidebanner-0">
    <v-container
      fluid
      pa-0
    >
      <v-layout>
        <!--<banner/>-->
      </v-layout>
      <v-layout
        align-center
        justify-center
        row
      >
        <v-flex class="content">
          <posts :get-posts-function="getPosts"/>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import Banner from '@/components/index/Banner'
import Posts from '@/components/post/Posts'
import { getPosts } from '@/api/posts'

export default {
  name: 'Index',
  components: {
    Banner,
    Posts,
  },
  computed: {
    getPosts() {
      return getPosts
    },
  },
}
</script>

<style scoped lang="scss">
.content {
  max-width: 600px;
}
</style>
