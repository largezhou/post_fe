<template>
  <span ref="span">
    <span
      v-if="share"
      v-html="htmlContent"
    />
  </span>
</template>

<script>
import Vue from 'vue'
import router from '@/router'

export default {
  name: 'PostContent',
  props: {
    content: String,
    /**
     * 如果是分享的话，标签不转为 router-link，值转成普通链接，并不能点击
     */
    share: Boolean,
  },
  computed: {
    htmlContent() {
      const c = this.linkToLink(this.nToBr(this.content))
      if (this.share) {
        return this.doubleSharpToLink(c)
      } else {
        return c
      }
    },
  },
  mounted() {
    !this.share && this.doubleSharpToLink(this.htmlContent)
  },
  methods: {
    nToBr(str) {
      return str.replace(/\n/g, '<br>')
    },
    linkToLink(str) {
      return str.replace(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/, (match) => {
        return `<a href="${match}" target="_blank">${match}</a>`
      })
    },
    doubleSharpToLink(str) {
      const regExp = /#(\s*[^\s#][^#]*)#/g

      if (this.share) {
        return str.replace(regExp, (match) => {
          return `<a href="javascript:void(0)">${match}</a>`
        })
      }

      const span = this.$refs.span
      const matches = str.matchAll(regExp)
      let lastStrIndex = 0

      Array
        .from(matches)
        .forEach((m) => {
          const match = m[0]
          const p1 = m[1]
          const index = m['index']

          const text = str.slice(lastStrIndex, index)
          if (text) {
            span.insertAdjacentHTML('beforeend', text)
          }
          const Comp = Vue.extend({
            router,
            render: (h) => h('router-link', {
              props: {
                to: `/tags/${p1.trim()}/posts`,
              },
            }, match),
          })
          const vm = new Comp()
          span.appendChild(vm.$mount().$el)
          lastStrIndex = index + match.length
        })

      // 补上最后部分文字
      if (lastStrIndex !== str.length) {
        span.insertAdjacentHTML('beforeend', str.slice(lastStrIndex))
      }
    },
  },
}
</script>
