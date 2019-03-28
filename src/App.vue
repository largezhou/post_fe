<template>
  <v-app>
    <slider-bar/>

    <navbar/>

    <router-view/>

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
import Navbar from '@/components/app/Navbar'
import SliderBar from '@/components/app/SliderBar'

export default {
  components: {
    SliderBar,
    Navbar,
  },
}
</script>
