<template>
  <div class="content-edit">
    <v-textarea
      :value="value"
      @input="(val) => $emit('input', val)"
      @keydown="onKeyDown"
      @mouseup="onMouseUp"
      @focus="onFocus"
      @blur="onBlur"
      ref="content"
      v-bind="$props"
    />

    <emoji-picker @pick="onEmojiPicked"/>

    <v-card
      v-click-outside="onClickOutside"
      ref="tagsList"
      v-show="tagsList.show"
      class="tags-card elevation-8"
      :style="{ left: tagsList.x + 'px', top: tagsList.y + 'px' }"
    >
      <v-card-text class="tags-wrap">
        <div
          v-show="tagsList.loading"
          class="tags-empty"
        >
          加载中，，，
        </div>
        <div>
          <template v-show="tagsList.data.length > 0">
          <span
            class="tag-item"
            :class="{ 'tag-item-active': tagsList.curIndex === index }"
            v-for="(t, index) of tagsList.data"
            :key="t.id"
            @click="onSelectTag(index)"
            :title="t.name"
          >{{ t.name }}</span>
          </template>
          <span
            v-show="!tagsList.loading && tagsList.data.length === 0"
            class="tags-empty"
          >啥都没有诶，，，</span>
        </div>
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
import ClickOutside from '@/directives/ClickOutside'

export default {
  name: 'PdContentEdit',
  extends: VTextarea,
  components: {
    EmojiPicker,
  },
  directives: {
    ClickOutside,
  },
  data: () => ({
    tagsList: {
      x: 0,
      y: 0,
      show: false,
      q: '',
      curIndex: -1, // 当前聚焦的选项
      data: [],
      loading: false,
    },
  }),
  created() {
    // 备份该数据，用来隐藏标签列表时，重置数据用
    this.tagsListBak = JSON.stringify(this.tagsList)
    const _t = _debounce(this.getTags, 500)
    this.debounceGetTags = () => {
      this.tagsList.loading = true
      _t()
    }
    // 由于多个事件会触发显示列表，比如失焦后用鼠标点击，会同时触发点击和聚焦，所以防抖一下
    this.debounceShowTagsList = _debounce(this.showTagsList, 100)
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
      this.setCursorPos(emoji.length + index)
    },
    showTagsList() {
      const input = this.input
      const end = input.selectionEnd

      if (end === 0) {
        this.hideTagsList()
        return
      }

      // 光标前最近的 井号 位置
      const sharpPos = this.value.lastIndexOf('#', end - 1)
      if (sharpPos === -1) {
        this.hideTagsList()
        return
      }
      // 搜索标签的值，即井号到光标中间的值
      const q = this.value.slice(sharpPos + 1, end)
      // 如果有空格或者换行，则取消
      if (q.indexOf(' ') !== -1 || q.indexOf('\n') !== -1) {
        this.hideTagsList()
        return
      }
      log('open it: ', q)
      this.tagsList.q = q

      // 获取光标相对于屏幕的 x y 坐标
      const pos = utils.getCursorPosition(input, end)
      this.tagsList.x = pos.x
      this.tagsList.y = pos.y + 25
      this.tagsList.show = true
    },
    hideTagsList() {
      this.tagsList = JSON.parse(this.tagsListBak)
      this.debounceGetTags.cancel()
    },
    onFocus() {
      this.debounceShowTagsList()
    },
    onMouseUp() {
      this.debounceShowTagsList()
    },
    onKeyDown(e) {
      const k = e.key
      const t = this.tagsList
      // 选择标签
      if (k === 'ArrowUp' || k === 'ArrowDown') {
        if (t.show) {
          e.preventDefault()
          // 切换标签
          if (t.data.length > 0) {
            if (k === 'ArrowUp') {
              t.curIndex--
              if (t.curIndex < 0) {
                t.curIndex = t.data.length - 1
              }
            } else {
              t.curIndex++
              if (t.curIndex > t.data.length - 1) {
                t.curIndex = 0
              }
            }
          }

          return
        }
      }

      // 确认选择标签
      if (k === 'Enter' && this.tagsList.show) {
        e.preventDefault()
        // 选择一个标签
        const t = this.tagsList
        if (t.data.length > 0) {
          this.onSelectTag(t.curIndex === -1 ? 0 : t.curIndex)
        }
        return
      }

      if (k === 'Escape' || k === 'Tab') {
        this.hideTagsList()
        return
      }

      this.debounceShowTagsList()
    },
    async getTags() {
      if (!this.tagsList.show) {
        this.debounceGetTags.cancel()
        return
      }

      const t = this.tagsList
      const q = t.q

      try {
        const { data } = await getTags({
          q,
          hot: 1,
        })
        t.data = data
      } finally {
        this.tagsList.loading = false
      }
    },
    onSelectTag(index) {
      const tagName = this.tagsList.data[index].name
      const end = this.input.selectionEnd
      const v = this.value
      const sharpPos = v.lastIndexOf('#', end - 1)

      const part1 = v.slice(0, sharpPos) + '#' + tagName + '# '
      const part2 = v.slice(end)

      this.$emit('input', part1 + part2)
      this.hideTagsList()
      this.setCursorPos(part1.length + sharpPos)
    },
    focus() {
      this.input.focus()
    },
    /**
     * 定位光标到指定位置
     *
     * @param pos
     */
    setCursorPos(pos) {
      this.$nextTick(() => {
        this.focus()
        this.input.setSelectionRange(pos, pos)
      })
    },
    onClickOutside(e) {
      // 如果不是点击的 输入框，则隐藏
      if (!utils.clickedInEl(this.$refs.content.$el, e.clientX, e.clientY)) {
        this.hideTagsList()
      }
    },
  },
  watch: {
    'tagsList.q'() {
      this.debounceGetTags()
    },
    'tagsList.show'(newVal) {
      newVal && this.debounceGetTags()
    },
  },
}
</script>

<style scoped lang="scss">
.tags-card {
  z-index: 1;
  position: fixed;
  transition: none;
  min-width: 100px;
  max-width: 300px;
}

.tags-wrap {
  padding: 10px 0;
}

.tags-empty,
.tag-item {
  height: 30px;
  padding: 5px 10px;
}

.tag-item {
  display: block;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    background: #f5f5f5;
  }
}

.tag-item-active {
  background: #f5f5f5;
}
</style>
