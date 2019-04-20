<template>
  <v-content
    class="pahidebanner-0 index-main"
    :style="mainStyles"
  >
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
import { mapState } from 'vuex'

export default {
  name: 'Index',
  components: {
    Banner,
    Posts,
  },
  computed: {
    ...mapState({
      configs: (state) => state.app.configs,
    }),
    bg() {
      return this.configs ? this.configs.bg_image : ''
    },
    getPosts() {
      return getPosts
    },
    mainStyles() {
      return {
        backgroundImage: `url(${this.bg})`,
      }
    },
  },
}
</script>

<style scoped lang="scss">
.content {
  max-width: 600px;
}

.index-main {
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}
</style>
