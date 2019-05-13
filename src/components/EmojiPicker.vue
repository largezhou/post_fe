<template>
  <div>
    <v-btn
      v-show="!dialog"
      style="font-size: 24px;"
      icon
      :ripple="false"
      class="ma-0"
      @click="dialog = true"
    >😀</v-btn>
    <v-card
      v-show="dialog"
      flat
    >
      <v-card-actions class="pa-0">
        <v-btn
          flat
          icon
          @click="dialog = false"
        >
          <mdi-icon icon="close"/>
        </v-btn>
        <v-btn
          flat
          icon
          @click="lock = !lock"
        >
          <mdi-icon :icon="lock ? 'lock' : 'lock-open-outline'"/>
        </v-btn>
        <v-spacer/>
        <v-btn
          flat
          icon
          @click="forceReload"
        >
          <mdi-icon icon="refresh"/>
        </v-btn>
      </v-card-actions>

      <v-card-text class="pa-0">
        <v-tabs
          show-arrows
          v-model="curTab"
        >
          <v-tabs-slider color="blue darken-2"/>
          <v-tab
            v-for="(cat, index) of catKeys"
            :key="index"
          >
            {{ emojiCats[cat] }}
          </v-tab>
        </v-tabs>
        <div class="tabs-items">
          <div
            v-for="cat of catKeys"
            :key="cat"
          >
            <v-card
              v-show="curCat === cat"
              flat
              class="emojis"
            >
              <div
                class="pa-1"
                v-for="(emoji, index) of emojisByCat(cat)"
                :key="index"
                @click="onPick(emoji)"
              >{{ emoji }}
              </div>
            </v-card>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { getEmojiCats, getEmojis } from '@/api/emojis'

export default {
  name: 'EmojiPicker',
  data: () => ({
    // 为 true 表示已经显示过一次了，
    dialog: false,
    // 是否选择后不关闭弹框
    lock: true,
    curTab: -1,
    // 按分类存储 emoji
    catEmojis: {},
    emojiCats: [],
  }),
  computed: {
    curCat() {
      return this.catKeys[this.curTab]
    },
    catKeys() {
      return Object.keys(this.emojiCats)
    },
  },
  methods: {
    async getEmojisIfEmpty(cat) {
      if (!this.catEmojis[cat]) {
        try {
          const { data } = await getEmojis(cat)
          this.$set(this.catEmojis, cat, data)
        } catch (e) {
        }
      }
    },
    emojisByCat(cat) {
      return this.catEmojis[cat] || []
    },
    onPick(emoji) {
      this.$emit('pick', emoji)
      if (!this.lock) {
        this.dialog = false
      }
    },
    async getCatsIfEmpty() {
      if (this.emojiCats.length !== 0) {
        return
      }
      const { data } = await getEmojiCats()
      this.emojiCats = data
      this.curTab = 0
    },
    async forceReload() {
      const config = {
        headers: {
          'Cache-Control': 'no-cache',
        },
      }

      const oldCatsCount = this.catKeys.length
      const { data } = await getEmojiCats(config)
      this.emojiCats = data

      if (oldCatsCount !== this.catKeys.length) {
        this.$snackbar('表情分类变了')
        this.curTab = 0
      }

      const cat = this.curCat
      try {
        const { data } = await getEmojis(cat, config)
        this.$set(this.catEmojis, cat, data)
      } catch (e) {
      }
    },
  },
  watch: {
    async dialog(newVal) {
      if (newVal) {
        this.getCatsIfEmpty()
      }
    },
    curTab(newVal) {
      if (newVal > -1) {
        this.getEmojisIfEmpty(this.curCat)
      }
    },
  },
}
</script>

<style scoped lang="scss">
.tabs-items {
  height: 150px;
  overflow-y: auto;
}

.emojis {
  font-size: 20px;
  cursor: pointer;
  user-select: none;

  div {
    display: inline-block;
    width: 40px;
    height: 40px;
    text-align: center;
  }
}
</style>
