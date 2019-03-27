<template>
  <v-app
    v-scroll="onScroll"
  >
    <v-navigation-drawer
      v-model="drawer"
      temporary
      fixed
      overflow
      app
    >
      <v-list dense>
        <v-list-tile to="/" active-class="">
          <v-list-tile-action>
            <mdi-icon>home</mdi-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile to="/about" active-class="">
          <v-list-tile-action>
            <mdi-icon>information</mdi-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>About</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile to="/page-not-found" active-class="">
          <v-list-tile-action>
            <mdi-icon>flask-empty</mdi-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Page not found</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar
      app
      :class="[toolbarElevationLevel]"
      :style="{
        background: toolbarBackground
      }"
    >
      <v-toolbar-side-icon
        @click.stop="drawer = !drawer"
      />
      <v-toolbar-items>
        <v-btn flat to="/" active-class="no-class">
          <v-toolbar-title>
            <mdi-icon>home</mdi-icon>
          </v-toolbar-title>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content class="pa-0">
      <v-container
        fluid
        class="pa-0"
      >
        <v-layout>
          <v-carousel
            hide-delimiters
            :height="bannerHeight"
          >
            <v-carousel-item
              class="pointer"
              v-for="(src, i) of items"
              :key="i"
              :src="src"
              @click.stop="test(src)"
            />
          </v-carousel>
        </v-layout>
        <v-layout
          align-center
          justify-center
          row
        >
          <router-view/>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer>
      <v-layout
        align-center
        justify-center
      >
        <span class="px-3"><strong>nobody</strong></span>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    bannerHeight: window.innerHeight,
    items: [
      'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
      'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
      'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
      'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
    ],
    offsetTop: 0,
  }),
  computed: {
    toolbarBackground() {
      const level = this.offsetTop / 90
      return `rgba(255, 255, 255, ${level / 10})`
    },
    toolbarElevationLevel() {
      const level = Math.floor(this.offsetTop / 200)
      return level > 3 ? '' : 'elevation-' + level
    },
  },
  methods: {
    test(src) {
      log(src)
    },
    onScroll() {
      this.offsetTop = window.scrollY
    },
  },
}
</script>
