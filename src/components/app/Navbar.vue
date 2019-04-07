<template>
  <v-toolbar
    v-scroll="onScroll"
    class="navbar"
    app
    :classhidebanner="[elevationLevel]"
    :stylehidebanner="{ background }"
  >
    <v-toolbar-side-icon
      @click.stop="$store.commit('TOGGLE_SLIDER_BAR')"
    />
    <v-toolbar-items>
      <v-btn flat to="/" active-class="no-class">
        <img
          height="30"
          width="30"
          src="@/assets/logo.png"
        />
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
export default {
  name: 'Navbar',
  data: () => ({
    offsetTop: 0,
  }),
  computed: {
    isIndex() {
      return this.$route.name === 'index'
    },
    background() {
      if (!this.isIndex) {
        return null
      }

      const level = this.offsetTop / 90
      return `rgba(250, 250, 250, ${(level / 10).toFixed(2)})`
    },
    elevationLevel() {
      if (!this.isIndex) {
        return null
      }

      const level = Math.floor(this.offsetTop / 200)
      return level > 3 ? '' : 'elevation-' + level
    },
  },
  methods: {
    onScroll() {
      this.offsetTop = window.scrollY
    },
  },
}
</script>

<style scoped lang="scss">
.navbar {
  transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 1ms;
}
</style>
