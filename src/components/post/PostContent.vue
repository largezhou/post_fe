<template>
  <span v-html="htmlContent"/>
</template>

<script>
export default {
  name: 'PostContent',
  props: {
    content: String,
  },
  computed: {
    htmlContent() {
      return this.linkToLink(this.doubleSharpToLink(this.nToBr(this.content)))
    },
  },
  mounted() {
    document.querySelectorAll('[data-to=go-to-tag]').forEach((a) => {
      a.addEventListener('click', (e) => {
        this.$router.push(e.target.pathname)
        e.preventDefault()
      })
    })
  },
  methods: {
    nToBr(str) {
      return str.replace(/\n/g, '<br>')
    },
    doubleSharpToLink(str) {
      return str.replace(/#(\s*[^\s#][^#]*)#/g, (match, p1) => {
        return `<a href="/tags/${p1.trim()}/posts" data-to="go-to-tag">${match}</a>`
      })
    },
    linkToLink(str) {
      return str.replace(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/, (match) => {
        return `<a href="${match}" target="_blank">${match}</a>`
      })
    },
  },
}
</script>
