<template>
  <v-flex class="content">
    <v-container
      pa-0
      fluid
      grid-list-md
    >
      <v-layout
        row
        wrap
        ma-0
      >
        <v-flex
          px-0
          py-5
          v-for="card in cards"
          :key="card.title"
          v-bind="{ [`xs${card.flex}`]: true }"
        >
          <v-card>
            <v-img :src="card.src"/>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn icon>
                <mdi-icon>heart-outline</mdi-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-flex>
</template>

<script>
export default {
  data: () => ({
    cards: [
      { title: 'Pre-fab homes', src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg', flex: 12 },
      { title: 'Favorite road trips', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg', flex: 12 },
      { title: 'Best airlines', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg', flex: 12 },
    ],
  }),
}
</script>

<style scoped lang="scss">
.content {
  max-width: 600px;
}
</style>
