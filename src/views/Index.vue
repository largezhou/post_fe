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
                class="post"
                ref="posts"
                px-0
                py-5
                v-for="(p, i) of posts"
                :key="p.id"
                xs12
                :data-index="i"
              >
                <v-card>

                  <post-image
                    ref="postImages"
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
import { mapConstants } from '@/libs/constants'

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
  computed: {
    ...mapConstants([
      'IMAGE_LOAD_STATE_LOADING',
      'IMAGE_LOAD_STATE_DONE',
    ]),
  },
  async created() {
    this.$bus.$on('new-post', this.onNewPost)
    this.$bus.$on('reload-index', this.onReloadIndex)
    this.InitIntersectionObserver()
    await this.getPosts()
    this.$nextTick(() => {
      this.loadMoreObserver.observe(this.$refs.loadMore)
    })
  },
  beforeDestroy() {
    this.$bus.$off('new-post', this.onNewPost)
    this.$bus.$off('reload-index', this.onReloadIndex)
  },
  methods: {
    async getPosts(lastId = 0) {
      if (this.theEnd && this.loading) {
        return false
      }

      this.loading = true
      try {
        const params = {
          last_id: lastId,
        }
        const naked = Number(!!this.$store.state.app.naked)
        if (naked) {
          params.naked = naked
        }

        const { data: { data, meta } } = await getPosts(params)
        const oldLength = this.posts.length
        this.posts.push(...data)
        this.initLazyLoad(oldLength)
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
    InitIntersectionObserver() {
      this.loadMoreObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.theEnd) {
            this.onLoadMore()
          } else if (this.theEnd) {
            this.loadMoreObserver.unobserve(this.$refs.loadMore)
          }
        })
      })

      this.lazyLoadObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const index = entry.target.dataset.index
          if (entry.isIntersecting) {
            const postImage = this.$refs.postImages[index]
            this.loadImages(postImage.images)
            this.lazyLoadObserver.unobserve(entry.target)
          }
        })
      })
    },
    initLazyLoad(oldPostLength) {
      this.$nextTick(() => {
        this
          .$refs
          .posts
          .slice(oldPostLength)
          .forEach((el) => {
            this.lazyLoadObserver.observe(el)
          })
      })
    },
    loadImages(images) {
      images.map((img) => {
        this.$set(img, 'loadState', this.IMAGE_LOAD_STATE_LOADING)

        const el = new Image()
        el.src = img.thumb
        el.onload = () => {
          this.$set(img, 'loadState', this.IMAGE_LOAD_STATE_DONE)
        }
      })
    },
    onReloadIndex() {
      this.posts = []
      this.theEnd = false
      this.loading = false
      // this.getPosts()
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

.post {
  overflow: hidden;
}
</style>
