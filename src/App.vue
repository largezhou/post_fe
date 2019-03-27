<template>
  <v-app id="sandbox">
    <v-navigation-drawer
      v-model="drawer"
      temporary
      absolute
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
    <v-toolbar app fixed>
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
    <v-content>
      <v-container fluid>
        <v-layout align-center justify-center>
          <router-view/>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer>
      <span class="px-3">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
  }),
}
</script>
