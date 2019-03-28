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
    ],
  }),
  computed: {
    ...mapState({
      sliderBar: (state) => state.app.sliderBar,
    }),
  },
  methods: {
    onSliderBarChange(val) {
      this.$store.commit('CHANGE_SLIDER_BAR', val)
    },
  },
}
</script>
