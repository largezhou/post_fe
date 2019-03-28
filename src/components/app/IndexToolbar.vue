<template>
  <v-toolbar
    v-scroll="onScroll"
    class="navbar"
    app
    :class="[elevationLevel]"
    :style="{ background }"
  >
    <slot/>
  </v-toolbar>
</template>

<script>
export default {
  name: 'IndexToolbar',
  data: () => ({
    offsetTop: 0,
  }),
  computed: {
    background() {
      const level = this.offsetTop / 90
      return `rgba(250, 250, 250, ${(level / 10).toFixed(2)})`
    },
    elevationLevel() {
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
