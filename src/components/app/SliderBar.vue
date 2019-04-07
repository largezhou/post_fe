<template>
  <v-navigation-drawer
    temporary
    fixed
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
          <mdi-icon :icon="menu.icon"/>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ menu.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <!--<v-divider/>-->
    <v-list-tile
      v-if="loggedIn"
      active-class=""
      @click="onLogout"
    >
      <v-list-tile-action>
        <mdi-icon icon="exit-to-app"/>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>退出</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-list-tile
      v-else
      active-class=""
      @click="onLogin"
    >
      <v-list-tile-action>
        <mdi-icon icon="account"/>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>登录</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
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
      this.close()

      try {
        await this.$store.dispatch('logout')
        this.$snackbar('已退出')
      } catch (e) {

      }
    },
    onLogin() {
      this.$bus.$emit('let-me-login', () => {
        this.$store.dispatch('getInfo')
      })
    },
    close() {
      this.$store.commit('CHANGE_SLIDER_BAR', false)
    },
  },
}
</script>
