<template>
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
        <router-view/>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: 'Layout',
}
</script>
