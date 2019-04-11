<template>
  <span ref="span"/>
</template>

<script>
import Vue from 'vue'
import router from '@/router'

export default {
  name: 'PostContent',
  props: {
    content: String,
  },
  computed: {
    htmlContent() {
      return this.linkToLink(this.nToBr(this.content))
    },
  },
  mounted() {
    this.doubleSharpToLink(this.htmlContent)
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
      const span = this.$refs.span
      const matches = str.matchAll(/#(\s*[^\s#][^#]*)#/g)
      let lastStrIndex = 0

      Array
        .from(matches)
        .forEach((m) => {
          const match = m[0]
          const p1 = m[1]
          const index = m['index']

          const text = str.slice(lastStrIndex, index)
          if (text) {
            span.appendChild(document.createTextNode(text))
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
        span.appendChild(document.createTextNode(str.slice(lastStrIndex)))
      }
    },
  },
}
</script>
