<template>
  <v-content class="pa-0">
    <v-container
      fluid
      class="pa-0"
    >
      <v-layout>
        <banner/>
      </v-layout>

      <v-layout
        align-center
        justify-center
        row
      >
        <v-flex class="content">
          <v-container
            pa-0
            fluid
            grid-list-md
          >
            <v-layout
              row
              wrap
              ma-0
            >
              <v-flex
                px-0
                py-5
                v-for="(src, i) of posts"
                :key="i"
                xs12
              >
                <v-card>
                  <v-img :src="src"/>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn icon>
                      <mdi-icon>heart-outline</mdi-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import Banner from '@/components/index/Banner'
import { getPosts } from '@/api/posts'

export default {
  components: { Banner },
  data: () => ({
    posts: [],
  }),
  methods: {
    test(src) {
      log(src)
    },
    async getPosts() {
      const { data } = await getPosts()
      this.posts = data
    },
  },
  watch: {
    $route: {
      handler() {
        this.getPosts()
      },
      immediate: true,
    },
  },
}
</script>

<style scoped lang="scss">
.content {
  max-width: 600px;
}
</style>
