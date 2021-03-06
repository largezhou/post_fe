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

            <v-list-tile ref="loadMore">
              <v-list-tile-content>
                <v-list-tile-title
                  class="grey--text"
                  style="text-align: center;"
                >
                  {{ theEnd ? '没有了，，，' : '来了，，，' }}
                </v-list-tile-title>
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
    theEnd: false,
    idSet: new Set(),
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
  mounted() {
    this.loadMoreObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !this.theEnd) {
        this.getList(this.page + 1)
      } else if (this.theEnd) {
        this.loadMoreObserver.unobserve(entry.target)
      }
    })
  },
  methods: {
    onClose() {
      this.dialog = false
    },
    async getList(page = this.page) {
      if (this.loading) {
        return
      }

      this.loading = true

      let posRes
      try {
        posRes = await this.getCurrentPosition()
      } catch (e) {
        this.$snackbar(`定位失败 (${e.message})`)
        this.loading = false
        return
      }

      this.loc = posRes.addressComponent
      const p = posRes.position
      this.loc.lng = p.lng
      this.loc.lat = p.lat
      const center = [p.lng, p.lat]

      let searchRes
      try {
        searchRes = await this.placeSearch(center, page)
      } catch (e) {
        if (e === 'no_data') {
          this.theEnd = true
        } else {
          this.$snackbar('搜索失败')
        }
        this.loading = false
        return
      }

      this.loading = false

      const l = searchRes.poiList

      if (l.pois.length < PAGE_SIZE) {
        this.theEnd = true
      }

      this.page = l.pageIndex

      l.pois.forEach((p) => {
        if (!this.idSet.has(p.id)) {
          this.data.push(p)
          this.idSet.add(p.id)
        }
      })
    },
    getCurrentPosition() {
      return new Promise((resolve, reject) => {
        /* eslint-disable */
        AMap.plugin('AMap.Geolocation', () => {
          const geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,
          })
          geolocation.getCurrentPosition((status, result) => {
            if (status === 'complete') {
              resolve(result)
            } else {
              reject(result)
            }
          })
        })
        /* eslint-enable */
      })
    },
    placeSearch(center, page) {
      return new Promise((resolve, reject) => {
        /* eslint-disable */
        AMap.service(['AMap.PlaceSearch'], () => {
          const placeSearch = new AMap.PlaceSearch({
            type: MAP_SEARCH_TYPE_ALL,
            pageSize: PAGE_SIZE,
            pageIndex: page,
          })

          placeSearch.searchNearBy('', center, 100, (status, result) => {
            if (status === 'complete') {
              resolve(result)
            } else {
              reject(status)
            }
          })
        })
        /* eslint-enable */
      })
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
    async dialog(newVal) {
      if (newVal) {
        await this.getList()
        await this.$nextTick()
        this.loadMoreObserver.observe(this.$refs.loadMore.$el)
      } else {
        this.loadMoreObserver.unobserve(this.$refs.loadMore.$el)

        this.page = 1
        this.data = []
        this.loc = null
        this.theEnd = false
        this.idSet = new Set()
      }
    },
  },
}
</script>
