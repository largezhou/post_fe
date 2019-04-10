<template>
  <v-dialog
    v-model="dialog"
    width="500"
    scrollable
    @keydown.esc="dialog = false"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        style="font-size: 24px;"
        icon
        :ripple="false"
        class="ma-0"
        v-on="on"
      >😀</v-btn>
    </template>

    <v-card>
      <v-card-title class="headline pb-0">
        <span>Emoji</span>
        <v-btn
          flat
          icon
          @click="lock = !lock"
        >
          <mdi-icon :icon="lock ? 'lock' : 'lock-open-outline'"/>
        </v-btn>
      </v-card-title>

      <v-card-text class="pt-0">
        <v-tabs
          show-arrows
          v-model="curTab"
        >
          <v-tabs-slider color="blue darken-2"/>
          <v-tab
            v-for="cat of emojiCats"
            :key="cat"
          >
            {{ EMOJI_CAT_MAP[cat] }}
          </v-tab>
        </v-tabs>
        <div class="tabs-items">
          <div
            v-for="cat of emojiCats"
            :key="cat"
          >
            <v-card
              v-show="curCat === cat"
              flat
              class="emojis"
            >
              <div
                class="pa-1"
                v-for="emoji of emojisByCat(emojiCats[curTab])"
                :key="emoji"
                @click="onPick(emoji)"
              >{{ emoji }}
              </div>
            </v-card>
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer/>
        <v-btn
          color="primary"
          flat
          @click="dialog = false"
        >好的</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapConstants } from '@/libs/constants'
import { getEmojis } from '@/api/emojis'

export default {
  name: 'EmojiPicker',
  data: () => ({
    // 为 true 表示弹框已经显示过一次了，
    // 因为弹框隐藏时，如果渲染了所有 tags ，滚动会有问题
    firstShow: false,
    dialog: false,
    // 是否选择后不关闭弹框
    lock: false,
    curTab: 0,
    // 按分类存储 emoji
    catEmojis: {},
  }),
  computed: {
    ...mapConstants([
      'EMOJI_CAT_MAP',
    ]),
    emojiCats() {
      if (this.firstShow) {
        return Object.keys(this.EMOJI_CAT_MAP)
      } else {
        return []
      }
    },
    curCat() {
      return this.emojiCats[this.curTab]
    },
  },
  methods: {
    async getEmojisIfEmpty(cat) {
      if (!this.catEmojis[cat]) {
        try {
          const { data } = await getEmojis(cat)
          this.$set(this.catEmojis, cat, data)
        } catch (e) {}
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
  },
  watch: {
    dialog(newVal) {
      if (newVal) {
        this.firstShow = true
        this.getEmojisIfEmpty(this.curCat)
      }
    },
    curTab() {
      this.getEmojisIfEmpty(this.curCat)
    },
  },
}
</script>

<style scoped lang="scss">
.tabs-items {
  height: 250px;
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
