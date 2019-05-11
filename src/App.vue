<template>
  <div v-resize="onResize">
    <router-view/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getConfigs } from '@/api/configs'

export default {
  computed: {
    ...mapState({
      widescreen: (state) => state.app.widescreen,
    }),
  },
  created() {
    // this.getConfigs()
  },
  methods: {
    onResize() {
      const width = window.innerWidth

      // 更新是不是宽屏的状态
      const widescreen = width >= 600
      if (widescreen !== this.widescreen) {
        this.$store.commit('CHANGE_WIDESCREEN', widescreen)
      }
    },
    async getConfigs() {
      const { data } = await getConfigs()
      this.$store.commit('SET_CONFIGS', data)
    },
  },
}
</script>
