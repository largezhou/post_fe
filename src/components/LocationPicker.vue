<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="500px"
      :fullscreen="mobile"
      @keydown.esc="onClose"
      scrollable
    >
      <template v-slot:activator="{ on }">
        <v-btn
          flat
          v-on="on"
          class="pl-0 ma-0"
        >
          <mdi-icon
            :color="value ? 'primary' : 'grey'"
            icon="map-marker"
            style="font-size: 36px;"
          />
          <span>{{ value ? value.name : '选择地址' }}</span>
        </v-btn>
      </template>

      <v-card>
        <v-toolbar
          card
          color="white"
        >
          <v-btn
            icon
            @click="onClose"
            color="grey lighten-5"
          >
            <mdi-icon icon="close"/>
          </v-btn>
        </v-toolbar>
        <v-card-text style="height: 100%;">
          <v-list three-line>
            <v-list-tile
              :class="{ 'grey lighten-4': !value || !value.id }"
              @click="onPick(null)"
            >
              <v-list-tile-content>
                <v-list-tile-title>不显示位置</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile v-show="loading">
              <v-list-tile-content>
                <v-list-tile-title
                  class="grey--text"
                  style="text-align: center;"
                >别急，，，
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile
              v-for="item of data"
              :class="{ 'grey lighten-4': value && value.id === item.id }"
              :key="item.id"
              @click="onPick(item)"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ fullDistrict + item.address }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { MAP_SEARCH_TYPE_ALL } from '@/libs/constants'

const PAGE_SIZE = 15

export default {
  name: 'LocationPicker',
  data: () => ({
    dialog: false,
    page: 1,
    data: [],
    loc: null,
    loading: false,
  }),
  computed: {
    ...mapState({
      mobile: (state) => state.app.mobile,
    }),
    fullDistrict() {
      if (!this.loc) {
        return ''
      } else {
        const l = this.loc
        return l.province + l.city + l.district
      }
    },
  },
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  created() {
    window.t = this
  },
  methods: {
    onClose() {
      this.dialog = false
    },
    getList(page = this.page) {
      /* eslint-disable */
      this.loading = true
      AMap.plugin('AMap.Geolocation', () => {
        const geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,
        })
        geolocation.getCurrentPosition((status, result) => {
          if (status === 'complete') {
            this.onLocateComplete(result, page)
          } else {
            this.$snackbar(`定位失败 (${result.message})`)
            this.loading = false
          }
        })
      })
      /* eslint-enable */
    },
    onLocateComplete(result, page) {
      /* eslint-disable */
      this.loc = result.addressComponent
      const p = result.position
      this.loc.lng = p.lng
      this.loc.lat = p.lat
      const center = [p.lng, p.lat]

      AMap.service(['AMap.PlaceSearch'], () => {
        //构造地点查询类
        const placeSearch = new AMap.PlaceSearch({
          type: MAP_SEARCH_TYPE_ALL,
          pageSize: PAGE_SIZE,
          pageIndex: page,
        })

        placeSearch.searchNearBy('', center, 100, (status, result) => {
          if (status === 'complete') {
            const l = result.poiList
            this.page = l.currentIndex
            this.data = l.pois
          }

          this.loading = false
        })
      })
      /* eslint-enable */
    },
    onPick(poi) {
      if (poi) {
        poi.loc = this.loc
      }
      this.$emit('input', poi)
      this.onClose()
    },
  },
  watch: {
    dialog(newVal) {
      if (newVal) {
        this.getList()
      } else {
        this.page = 1
        this.data = []
        this.loc = null
      }
    },
  },
}
</script>
