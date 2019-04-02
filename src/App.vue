<template>
  <v-app
    v-resize="onResize"
  >
    <slider-bar/>

    <navbar/>

    <router-view/>

    <v-footer>
      <v-layout
        align-center
        justify-center
      >
        <span class="px-3"><strong>nobody</strong></span>
      </v-layout>
    </v-footer>

    <login-dialog/>

    <floating-actions/>

    <publish-dialog/>
  </v-app>
</template>

<script>
import Navbar from '@/components/app/Navbar'
import SliderBar from '@/components/app/SliderBar'
import { mapState } from 'vuex'
import LoginDialog from '@/components/app/LoginDialog'
import FloatingActions from '@/components/FloatingActions'
import PublishDialog from '@/components/app/publish-dialog/PublishDialog'

export default {
  components: {
    PublishDialog,
    FloatingActions,
    LoginDialog,
    SliderBar,
    Navbar,
  },
  computed: {
    ...mapState({
      widescreen: (state) => state.app.widescreen,
    }),
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
  },
}
</script>
