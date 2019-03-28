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
      :style="{ background: toolbarBackground }"
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
            class="banner"
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
      return `rgba(250, 250, 250, ${level / 10})`
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

<style scoped lang="scss">
/deep/ {
  .v-toolbar {
    transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 1ms;
  }

  .v-carousel {
    box-shadow: none;
  }
}

.banner {
  /deep/ {
    .v-carousel__prev,
    .v-carousel__next {
      width: 100px;
      height: 100%;
      transform: scaleX(0.7);
      top: 0;

      .v-btn {
        height: 100%;
        width: 100%;

        .v-icon {
          color: transparent;
        }

        .v-ripple__container * {
          background: transparent;
        }
      }
    }

    .v-carousel__prev {
      left: -52px;

      .v-btn {
        border-radius: 0 70% 70% 0;
      }
    }

    .v-carousel__next {
      right: -52px;

      .v-btn {
        border-radius: 70% 0 0 70%;
      }
    }
  }
}
</style>
