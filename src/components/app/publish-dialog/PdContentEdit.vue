<template>
  <div class="content-edit">
    <v-textarea
      :value="value"
      @input="(val) => $emit('input', val)"
      @keyup="onKeyUp"
      @mouseup="onMouseUp"
      @focus="onFocus"
      @blur="onBlur"
      ref="content"
      v-bind="$props"
    />

    <emoji-picker @pick="onEmojiPicked"/>

    <v-card
      v-show="tagsList.show"
      class="tags elevation-8"
      :style="{ left: tagsList.x + 'px', top: tagsList.y + 'px' }"
    >
      <v-card-text>
        <div v-for="i of 5" :key="i">{{ i }}</div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import EmojiPicker from '@/components/EmojiPicker'
import { VTextarea } from 'vuetify/lib'
import utils from '@/libs/utils'
import { getTags } from '@/api/tags'
import _debounce from 'lodash/debounce'

export default {
  name: 'PdContentEdit',
  extends: VTextarea,
  components: {
    EmojiPicker,
  },
  data: () => ({
    tagsList: {
      x: 0,
      y: 0,
      show: false,
      q: '',
      hot: [], // 缓存搜索内容为空时的热门标签
    },
  }),
  created() {
    this.debounceGetTags = _debounce(this.getTags, 500)
  },
  mounted() {
    this.input = this.$refs.content.$refs.input
  },
  methods: {
    onEmojiPicked(emoji) {
      const input = this.input
      const index = input.selectionStart
      const c = this.value
      const newVal = c.slice(0, index) + emoji + c.slice(index)
      this.$emit('input', newVal)
      this.$nextTick(() => {
        const t = emoji.length + index
        // hack...
        input.focus()
        input.setSelectionRange(t, t)
      })
    },
    showTagsList() {
      const input = this.input
      const end = input.selectionEnd
      if (input.value[end - 1] === '#') {
        // 延迟一下，是为了兼容，当光标不在可视区，
        // 然后输入 # 号，要等输入框的滚动条滚到 光标 位置之后再获取位置
        setTimeout(() => {
          // 获取光标相对于屏幕的 x y 坐标
          const pos = utils.getCursorPosition(input, end)
          this.tagsList.x = pos.x
          this.tagsList.y = pos.y + 25
          this.tagsList.show = true
        }, 50)
      }
    },
    hideTagsList() {
      this.tagsList.show = false
      this.tagsList.q = ''
      this.debounceGetTags.cancel()
    },
    onBlur() {
      this.hideTagsList()
    },
    onFocus() {
      this.showTagsList()
    },
    onMouseUp() {
      this.showTagsList()
    },
    onKeyUp(e) {
      const c = utils.getCharBeforeCursor(e.target)
      if (e.key === 'Escape' || c === ' ' || c === '\n') {
        this.hideTagsList()
      } else {
        this.showTagsList()
      }
    },
    async getTags() {
      if (!this.tagsList.show) {
        this.debounceGetTags.cancel()
        return
      }

      const q = this.tagsList.q
      const { data } = await getTags({
        q,
        hot: q ? 0 : 1,
      })

      log(
        {
          q,
          hot: q ? 0 : 1,
        },
        data,
      )
    },
  },
  watch: {
    value(newVal) {
      // 没有内容，关闭标签列表
      if (!newVal) {
        this.hideTagsList()
      }

      // 如果当前光标往前有 # 号，且中间没有空格，则打开标签列表
      const end = this.input.selectionEnd
      let sharpPos = -1
      for (let i = end - 1; i >= 0; i--) {
        const c = newVal[i]
        if (c === ' ' || c === '\n') {
          this.hideTagsList()
          return
        }

        if (c === '#') {
          sharpPos = i
        }
      }

      if (sharpPos === -1) {
        this.hideTagsList()
        return
      }

      this.tagsList.q = newVal.slice(sharpPos + 1, end)
    },
    'tagsList.q'(newVal) {
      log(newVal)
      // newVal && this.debounceGetTags()
    },
    async 'tagsList.show'(newVal) {
      if (!newVal) {
        this.debounceGetTags.cancel()
        this.tagsList.q = ''
      } else {
        this.debounceGetTags()
      }
    },
  },
}
</script>

<style scoped lang="scss">
.tags {
  z-index: 1;
  position: fixed;
  transition: none;
}
</style>
