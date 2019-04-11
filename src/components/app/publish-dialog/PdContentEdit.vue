<template>
  <div>
    <v-textarea
      :value="value"
      @input="(val) => $emit('input', val)"
      ref="content"
      v-bind="$props"
    />

    <emoji-picker @pick="onEmojiPicked"/>
  </div>
</template>

<script>
import EmojiPicker from '@/components/EmojiPicker'
import { VTextarea } from 'vuetify/lib'

export default {
  name: 'PdContentEdit',
  extends: VTextarea,
  components: {
    EmojiPicker,
  },
  methods: {
    onEmojiPicked(emoji) {
      const input = this.$refs.content.$refs.input
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
  },
}
</script>
