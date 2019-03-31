<template>
  <v-scale-transition>
    <v-speed-dial
      v-show="show"
      v-scroll="onScroll"
      v-model="open"
      fixed
      bottom
      right
      direction="top"
      transition="slide-y-reverse-transition"
    >
      <template v-slot:activator>
        <v-btn
          v-model="open"
          color="blue darken-2"
          dark
          fab
        >
          <mdi-icon>gesture-tap</mdi-icon>
          <mdi-icon>close</mdi-icon>
        </v-btn>
      </template>
      <v-btn
        fab
        dark
        small
        color="red"
      >
        <mdi-icon>plus</mdi-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="green"
        @click="onGotoTop"
      >
        <mdi-icon>arrow-collapse-up</mdi-icon>
      </v-btn>
    </v-speed-dial>
  </v-scale-transition>
</template>

<script>
export default {
  name: 'FloatingActions',
  data: () => ({
    open: false,
    oldY: 0,
    show: true,
  }),
  mounted() {
    this.oldY = window.scrollY
  },
  methods: {
    onGotoTop() {
      this.$vuetify.goTo(0)
    },
    onScroll() {
      const scrollYNow = window.scrollY
      this.show = scrollYNow < this.oldY

      this.oldY = scrollYNow
    },
  },
}
</script>
