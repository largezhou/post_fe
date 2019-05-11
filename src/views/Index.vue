<template>
  <v-container
    ref="main"
    class="pahidebanner-0 index-main"
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
</template>

<script>
import Banner from '@/components/index/Banner'
import Posts from '@/components/post/Posts'
import { getPosts } from '@/api/posts'
import SetBackgroundImage from '@/mixins/SetBackgroundImage'

export default {
  name: 'Index',
  components: {
    Banner,
    Posts,
  },
  mixins: [
    SetBackgroundImage,
  ],
  data: () => ({
    styleElId: Math.random(),
  }),
  computed: {
    getPosts() {
      return getPosts
    },
  },
}
</script>
