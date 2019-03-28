<template>
  <component :is="toolbarComponent">
    <v-toolbar-side-icon
      @click.stop="$store.commit('TOGGLE_SLIDER_BAR')"
    />
    <v-toolbar-items>
      <v-btn flat to="/" active-class="no-class">
        <v-toolbar-title>
          <mdi-icon>home</mdi-icon>
        </v-toolbar-title>
      </v-btn>
    </v-toolbar-items>
  </component>
</template>

<script>
import IndexToolbar from './IndexToolbar'
import OtherToolbar from './OtherToolbar'

export default {
  name: 'Navbar',
  components: {
    IndexToolbar,
    OtherToolbar,
  },
  computed: {
    toolbarComponent() {
      return this.$route.name == 'index' ? 'index-toolbar' : 'other-toolbar'
    },
  },
}
</script>
