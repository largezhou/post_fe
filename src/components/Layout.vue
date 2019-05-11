<template>
  <v-app>
    <slider-bar/>

    <navbar/>

    <v-content>
      <v-container
        fluid
        pa-0
      >
        <v-layout
          align-center
          justify-center
          row
        >
          <keep-alive>
            <router-view
              v-if="$route.meta.keepAlive"
              :key="$route.name"
            />
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"/>
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
    <login-dialog/>

    <floating-actions/>

    <publish-dialog/>
  </v-app>
</template>

<script>
import LoginDialog from '@/components/app/LoginDialog'
import FloatingActions from '@/components/FloatingActions'
import PublishDialog from '@/components/app/publish-dialog/PublishDialog'
import Navbar from '@/components/app/Navbar'
import SliderBar from '@/components/app/SliderBar'

export default {
  name: 'Layout',
  components: {
    PublishDialog,
    FloatingActions,
    LoginDialog,
    SliderBar,
    Navbar,
  },
}
</script>
