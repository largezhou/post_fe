<template>
  <v-content class="pa-0">
    <v-container
      fluid
      pa-0
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
                v-for="(p, i) of posts"
                :key="i"
                xs12
              >
                <v-card>

                  <v-img
                    v-if="p.images.length === 1"
                    :src="p.images[0]"
                  />
                  <post-carousel
                    v-else-if="p.layout === 'carousel'"
                    :images="p.images"
                  />
                  <post-nine-grid
                    v-else
                    :images="p.images"
                  />

                  <v-card-text class="headline">{{ p.content }}</v-card-text>

                  <v-card-actions>
                    <v-card-text class="py-0 px-2">
                      <human-time
                        prefix="发布于 "
                        :time="p.created_at"
                      />
                    </v-card-text>
                    <v-spacer/>
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

    <v-dialog
      v-model="dialog"
      hide-overlay
      class="lalalala"
    >
      <v-card>
        <v-carousel
          class="elevation-0"
          :cycle="false"
        >
          <v-carousel-item
            v-for="(src, i) of (posts[0] ? posts[0].images : [])"
            :key="i"
            :src="src"
          />
        </v-carousel>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script>
import Banner from '@/components/index/Banner'
import { getPosts } from '@/api/posts'
import PostCarousel from '@/components/index/PostCarousel'
import PostNineGrid from '@/components/index/PostNineGrid'
import HumanTime from '@/components/HumanTime'

export default {
  components: { HumanTime, PostNineGrid, PostCarousel, Banner },
  data: () => ({
    posts: [],
    dialog: true,
    height: window.innerHeight,
  }),
  methods: {
    async getPosts() {
      const { data } = await getPosts()
      this.posts = data.data
      log(this.posts)
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

.v-dialog__content--active {
  background: black;
}

/deep/ {
  .v-dialog {
    margin: 0;
  }
}
</style>
