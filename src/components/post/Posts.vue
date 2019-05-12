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
        class="post-wrap"
        px-0
        py-5
        v-for="(p, i) of posts"
        :key="p.id"
        xs12
      >
        <post
          ref="post"
          :post="p"
          @post-destroyed="() => onPostDestroyed(i)"
        />
      </v-flex>
    </v-layout>

    <div ref="loadMore" class="load-more">
      <span v-show="loading">来咯...</span>
      <span v-show="theEnd">没有了...</span>
    </div>

    <preview-dialog/>
  </v-container>
</template>

<script>
import PreviewDialog from '@/components/post/PreviewDialog'
import Post from '@/components/post/Post'

export default {
  name: 'Posts',
  components: {
    Post,
    PreviewDialog,
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
      this.loadMoreObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.theEnd) {
            this.onLoadMore()
          } else if (this.theEnd) {
            this.loadMoreObserver.unobserve(this.$refs.loadMore)
          }
        })
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
    onPostDestroyed(index) {
      this.posts.splice(index, 1)
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

.post-wrap {
  overflow: hidden;
}
</style>
