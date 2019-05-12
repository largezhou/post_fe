<template>
  <v-app>
    <v-layout
      ref="main"
      class="index-main"
      align-center
      justify-center
      wrap
      ma-0
    >
      <v-flex
        v-if="post"
        px-0
        py-5
        class="content"
      >
        <post
          :post="post"
          share
        />
        <v-tooltip
          top
          v-if="share.expired_at"
        >
          <div
            slot="activator"
            class="mt-5 text-xs-center grey--text"
          >
            <h1>{{ expiredAt }}就没得看了</h1>
          </div>
          <span>{{ share.expired_at }} 后就没得看了</span>
        </v-tooltip>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
import { getShare } from '@/api/shares'
import Post from '@/components/post/Post'
import dayjs from 'dayjs'
import SetBackgroundImage from '@/mixins/SetBackgroundImage'

export default {
  name: 'ShowShare',
  components: {
    Post,
  },
  mixins: [
    SetBackgroundImage,
  ],
  data: () => ({
    post: null,
    share: null,
  }),
  computed: {
    expiredAt() {
      return dayjs(this.share.expired_at).fromNow().replace('内', '后')
    },
  },
  created() {
    this.getShare()
  },
  methods: {
    async getShare() {
      try {
        const { data } = await getShare(this.$route.params.shareKey)
        this.post = data.post
        this.share = data.share
      } catch ({ response: res }) {
        if (res && res.status === 404) {
          this.$router.push({
            name: 'page404',
          })
        }
      }
    },
  },
}
</script>
