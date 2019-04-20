<template>
  <v-content
    ref="main"
    class="pahidebanner-0 index-main"
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

const STYLE_EL_ID = 'index-main-bg-style'

export default {
  name: 'Index',
  components: {
    Banner,
    Posts,
  },
  data: () => ({
    styleElId: Math.random(),
  }),
  computed: {
    ...mapState({
      configs: (state) => state.app.configs,
    }),
    getPosts() {
      return getPosts
    },
    // 黑魔法，，，
    bgStyleEl() {
      if (this.configs && this.configs.bg_image) {
        return `
<style id="${STYLE_EL_ID}">
.index-main:before {
  background-image: url(${this.configs.bg_image});
}
</style>
        `
      } else {
        return ''
      }
    },
  },
  watch: {
    bgStyleEl: {
      async handler(newVal) {
        // 先移除原来的
        const t = document.querySelector(`#${STYLE_EL_ID}`)
        if (t) {
          t.parentElement.removeChild(t)
        }
        if (newVal) {
          await this.$nextTick()
          this.$refs.main.$el.insertAdjacentHTML('beforebegin', newVal)
        }
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

.index-main:before {
  content: ' ';
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
