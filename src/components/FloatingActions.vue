<template>
  <div
    v-scroll="onScroll"
    class="floating-actions"
  >
    <v-layout
      column
      align-center
    >
      <v-scale-transition v-if="!mobile">
        <v-flex
          v-show="showTopBtn && oldY"
          xs12
        >
          <v-btn
            fab
            dark
            small
            color="red"
            @click="onGotoTop"
          >
            <mdi-icon>arrow-collapse-up</mdi-icon>
          </v-btn>
        </v-flex>
      </v-scale-transition>
      <v-flex
        v-if="loggedIn"
        xs12
      >
        <v-btn
          fab
          dark
          color="red"
          @click="$bus.$emit('let-me-publish')"
        >
          <span class="icon-publish"/>
        </v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'FloatingActions',
  data: () => ({
    open: false,
    oldY: 0,
    showTopBtn: true,
    hideOverY: 500,
  }),
  computed: {
    ...mapState({
      mobile: (state) => state.app.mobile,
    }),
    ...mapGetters([
      'loggedIn',
    ]),
  },
  mounted() {
    this.oldY = window.scrollY
  },
  methods: {
    onGotoTop() {
      this.$vuetify.goTo(0)
    },
    onScroll() {
      const scrollYNow = window.scrollY
      this.showTopBtn = (scrollYNow > this.hideOverY) && (scrollYNow < this.oldY)

      this.oldY = scrollYNow
    },
  },
}
</script>

<style scoped lang="scss">
.floating-actions {
  position: fixed;
  right: 10px;
  bottom: 10px;
  z-index: 1;
}
</style>
