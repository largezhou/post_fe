<template>
  <v-navigation-drawer
    temporary
    fixed
    overflow
    app
    :value="sliderBar"
    @input="onSliderBarChange"
  >
    <v-list dense>
      <v-list-tile
        v-for="(menu, i) of menus"
        :to="menu.to"
        :key="i"
        active-class=""
      >
        <v-list-tile-action>
          <mdi-icon>{{ menu.icon }}</mdi-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ menu.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <template v-if="loggedIn">
      <v-divider/>
      <v-list-tile
        active-class=""
        @click="onLogout"
      >
        <v-list-tile-action>
          <mdi-icon>exit-to-app</mdi-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>退出</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SliderBar',
  data: () => ({
    menus: [
      {
        to: '/',
        icon: 'home',
        title: 'Home',
      },
      {
        to: '/about',
        icon: 'information',
        title: 'About',
      },
      {
        to: '/page-not-found',
        icon: 'flask-empty',
        title: 'Page not found',
      },
      {
        to: '/admin',
        icon: 'flask-empty',
        title: 'Admin',
      },
    ],
  }),
  computed: {
    ...mapState({
      sliderBar: (state) => state.app.sliderBar,
      username: (state) => state.user.name,
    }),
    loggedIn() {
      return !!this.username
    },
  },
  methods: {
    onSliderBarChange(val) {
      this.$store.commit('CHANGE_SLIDER_BAR', val)
    },
    async onLogout() {
      try {
        await this.$store.dispatch('logout')
        this.$snackbar('已退出')
        this.close()
      } catch (e) {

      }
    },
    close() {
      this.$store.commit('CHANGE_SLIDER_BAR', false)
    },
  },
}
</script>
