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
                v-for="p of posts"
                :key="p.id"
                xs12
              >
                <v-card>

                  <post-image
                    v-if="p.images.length > 0"
                    :post="p"
                  />

                  <v-card-text class="headline">{{ p.content }}</v-card-text>

                  <v-card-actions>
                    <v-card-text class="py-0 px-2">
                      <human-time
                        prefix="发布于 "
                        :time="p.created_at"
                      />
                    </v-card-text>
                    <!--<v-spacer/>
                    <v-btn icon>
                      <mdi-icon icon="heart-outline"/>
                    </v-btn>-->
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>

    <preview-dialog/>

    <div ref="loadMore" class="load-more">
      <span v-show="loading">来咯...</span>
      <span v-show="theEnd">没有了...</span>
    </div>
  </v-content>
</template>

<script>
import Banner from '@/components/index/Banner'
import { getPosts } from '@/api/posts'
import HumanTime from '@/components/HumanTime'
import PostImage from '@/components/index/PostImage'
import PreviewDialog from '@/components/index/PreviewDialog'

export default {
  components: {
    PreviewDialog,
    PostImage,
    HumanTime,
    Banner,
  },
  data: () => ({
    posts: [],
    height: window.innerHeight,
    theEnd: false,
    loading: false,
  }),
  async created() {
    this.$bus.$on('new-post', this.onNewPost)
    await this.getPosts()
    this.$nextTick(() => {
      this.initIntersectionObserver()
    })
  },
  beforeDestroy() {
    this.$bus.$off('new-post', this.onNewPost)
  },
  methods: {
    async getPosts(lastId = 0) {
      if (this.theEnd && this.loading) {
        return false
      }

      this.loading = true
      try {
        const { data: { data, meta } } = await getPosts({
          last_id: lastId,
        })
        this.posts.push(...data)
        this.theEnd = data.length < meta.per_page
      } finally {
        this.loading = false
      }
    },
    onNewPost(data) {
      this.posts.unshift(data)
    },
    onLoadMore() {
      const lastId = this.posts.length > 0
        ? this.posts[this.posts.length - 1].id
        : 0
      this.getPosts(lastId)
    },
    initIntersectionObserver() {
      this.ioIns = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !this.theEnd) {
          this.onLoadMore()
        } else if (this.theEnd) {
          this.ioIns.unobserve(this.$refs.loadMore)
        }
      })
      this.ioIns.observe(this.$refs.loadMore)
    },
  },
}
</script>

<style scoped lang="scss">
.content {
  max-width: 600px;
}

.load-more {
  width: 100%;
  background: none;
  font-size: 20px;
  text-align: center;
  padding-bottom: 20px;
  color: #BDBDBD;
}
</style>
