<template>
  <v-card class="post-card">
    <post-image
      ref="postImages"
      :post="post"
    />

    <v-card-text class="post-content">
      <post-content
        :share="share"
        :content="post.content"
      />
    </v-card-text>

    <v-card-actions>
      <v-card-text class="py-0 px-2">
        <human-time
          prefix="发布于 "
          :time="post.created_at"
        />
        <span
          v-if="post.addr"
          class="ml-2"
        >
          <span>发布于 </span>
          <v-tooltip top>
            <a
              :href="'https://www.amap.com/search?query=' + post.addr.full_addr"
              target="_blank"
              slot="activator"
            >{{ post.addr.name }}</a>
            <span>{{ post.addr.full_addr }}</span>
          </v-tooltip>
        </span>
      </v-card-text>
      <v-spacer/>
      <loading-action
        v-if="name && !share"
        icon
        :action="storeShare"
      >
        <mdi-icon
          icon="share"
          class="grey--text"
        />
      </loading-action>
      <loading-action
        v-if="name && !share"
        icon
        :action="destroyPost"
      >
        <mdi-icon
          icon="delete"
          class="red--text"
        />
      </loading-action>
      <v-tooltip
        v-if="name && share"
        top
      >
        <loading-action
          slot="activator"
          icon
        >
          <mdi-icon
            icon="cancel"
            class="grey--text"
          />
        </loading-action>
        <span>取消分享</span>
      </v-tooltip>
      <!--<v-btn icon>
        <mdi-icon icon="heart-outline"/>
      </v-btn>-->
    </v-card-actions>
  </v-card>
</template>

<script>
import PostContent from '@/components/post/PostContent'
import LoadingAction from '@/components/LoadingAction'
import PostImage from '@/components/post/PostImage'
import HumanTime from '@/components/HumanTime'
import { mapState } from 'vuex'
import { storeShare } from '@/api/shares'

export default {
  name: 'Post',
  components: {
    PostContent,
    LoadingAction,
    PostImage,
    HumanTime,
  },
  props: {
    post: Object,
    share: Boolean,
    destroyPost: Function,
  },
  computed: {
    ...mapState({
      name: (state) => state.user.name,
    }),
  },
  methods: {
    async storeShare() {
      try {
        const { data } = await storeShare({
          post_id: this.post.id,
          expired_in: 1,
        })
        this.$snackbar(data.url)
      } catch (e) {
      }
    },
  },
}
</script>

<style scoped lang="scss">
.post-card {
  background: rgba(255, 255, 255, 0.50);
}

.post-content {
  font-size: 24px;
  font-weight: 400;
  line-height: 40px;
  word-break: break-all;
}
</style>
