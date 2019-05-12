<template>
  <div>
    <span>分享好了，点击链接可复制</span>
    <br>
    <a
      :href="url"
      target="_blank"
      class="url"
      :data-clipboard-text="url"
    >{{ url }}</a>
  </div>
</template>

<script>
import Vue from 'vue'
import Clipboard from 'clipboard'

export default Vue.extend({
  name: 'SharedMsg',
  data: () => ({
    copied: false,
  }),
  props: {
    url: String,
  },
  mounted() {
    this.clipboard = new Clipboard('.url', {
      container: this.$el,
    })
  },
  beforeDestroy() {
    this.clipboard.destroy()
  },
})
</script>
