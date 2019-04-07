<template>
  <v-content class="pa-0">
    <v-container
      fluid
      pahidebanner-0
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
                ref="postWraps"
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

                  <n-to-br :content="p.content"/>

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
import NToBr from '@/components/index/NToBr'

export default {
  components: {
    NToBr,
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
      let t = this.$refs.postImages

      this.posts.unshift(data)

      // 由于加在前面的元素，在 refs 中，也是往后排的
      // 所以，这里手动把前面的新元素，放到 refs 中的前面
      // 用来与 posts 中的索引对应
      this.$nextTick(() => {
        t = [
          t[t.length - 1],
          ...t.slice(0, t.length - 1),
        ]
        this.$refs.postImages = t
        this.lazyLoadObserver.observe(this.$refs.postWraps[t.length - 1])
      })
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
          const postImage = this.$refs.postImages[index]
          if (entry.isIntersecting) {
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
          .postWraps
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
    },
    nlToBr(content) {
      log(1)
      return content.replace(/\n/g, '<br>')
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
