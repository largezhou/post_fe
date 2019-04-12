<template>
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

          <v-card-text class="post-content">
            <post-content :content="p.content"/>
          </v-card-text>

          <v-card-actions>
            <v-card-text class="py-0 px-2">
              <human-time
                prefix="发布于 "
                :time="p.created_at"
              />
            </v-card-text>
            <v-spacer/>
            <loading-action
              v-if="name"
              icon
              :action="() => destroyPost(i)"
            >
              <mdi-icon
                icon="delete"
                class="red--text"
              />
            </loading-action>
            <!--<v-btn icon>
              <mdi-icon icon="heart-outline"/>
            </v-btn>-->
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

    <div ref="loadMore" class="load-more">
      <span v-show="loading">来咯...</span>
      <span v-show="theEnd">没有了...</span>
    </div>

    <preview-dialog/>

    <delete-confirm-dialog
      @confirmed="onDeleteConfirmed"
      @closed="onDeleteCanceled"
    />
  </v-container>
</template>

<script>
import { destroyPost } from '@/api/posts'
import HumanTime from '@/components/HumanTime'
import PostImage from '@/components/post/PostImage'
import PreviewDialog from '@/components/post/PreviewDialog'
import { mapConstants } from '@/libs/constants'
import { mapState } from 'vuex'
import DeleteConfirmDialog from '@/components/post/DeleteConfirmDialog'
import LoadingAction from '@/components/LoadingAction'
import PostContent from '@/components/post/PostContent'

export default {
  name: 'Posts',
  components: {
    PostContent,
    LoadingAction,
    DeleteConfirmDialog,
    PreviewDialog,
    PostImage,
    HumanTime,
  },
  data: () => ({
    posts: [],
    height: window.innerHeight,
    theEnd: false,
    loading: false,
  }),
  props: {
    getPostsFunction: Function,
  },
  computed: {
    ...mapConstants([
      'IMAGE_LOAD_STATE_LOADING',
      'IMAGE_LOAD_STATE_DONE',
      'IMAGE_LOAD_STATE_ERROR',
    ]),
    ...mapState({
      name: (state) => state.user.name,
    }),
  },
  async created() {
    this.$bus.$on('new-post', this.onNewPost)
    this.$bus.$on('reload-posts', this.onReloadPosts)
    this.initIntersectionObserver()
    await this.getPosts()
    this.$nextTick(() => {
      this.loadMoreObserver.observe(this.$refs.loadMore)
    })
  },
  beforeDestroy() {
    this.$bus.$off('new-post', this.onNewPost)
    this.$bus.$off('reload-posts', this.onReloadPosts)
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

        const { data: { data, meta } } = await this.getPostsFunction(params)
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

      // 由于加在前面的元素，在 refs 中，也是往后排的
      // 所以，这里手动把前面的新元素，放到 refs 中的前面
      // 用来与 posts 中的索引对应
      this.$nextTick(() => {
        let t = this.$refs.postImages
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
    initIntersectionObserver() {
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
        const postWraps = this.$refs.postWraps || []
        postWraps
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
        el.onerror = () => {
          this.$set(img, 'loadState', this.IMAGE_LOAD_STATE_ERROR)
          log('图片没了')
        }
      })
    },
    async onReloadPosts() {
      // 清空原有数据
      this.posts = []
      this.theEnd = false
      this.loading = false

      // 清空数据后，先解绑监视器，等重新获取的数据渲染完，再重新绑定
      // 避免少数情况下，这里和监视器里都同时获取数据
      this.loadMoreObserver.unobserve(this.$refs.loadMore)
      await this.getPosts()
      this.$nextTick(() => {
        this.loadMoreObserver.observe(this.$refs.loadMore)
      })
    },
    destroyPost(index) {
      return new Promise((resolve) => {
        this.destroyResolve = resolve
        this.$bus.$emit('post-delete')
      })
        .then(async (confirmed) => {
          if (confirmed) {
            try {
              await destroyPost(this.posts[index].id)
              this.posts.splice(index, 1)
              this.$snackbar('删掉了')
            } catch (e) {}
          }
        })
    },
    onDeleteConfirmed() {
      this.destroyResolve(true)
    },
    onDeleteCanceled() {
      this.destroyResolve(false)
    },
  },
}
</script>

<style scoped lang="scss">
.load-more {
  width: 100%;
  background: none;
  font-size: 20px;
  text-align: center;
  padding: 20px 0;
  color: #BDBDBD;
}

.post {
  overflow: hidden;
}

.post-content {
  font-size: 24px;
  font-weight: 400;
  line-height: 40px;
  word-break: break-all;
}
</style>
