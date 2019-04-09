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
      return this.doubleSharpToLink(this.nToBr(this.content))
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
      return str.replace(/(#([^#]+)#)/g, '<a href="/tags/$2/posts" data-to="go-to-tag">$1</a>')
    },
  },
}
</script>
