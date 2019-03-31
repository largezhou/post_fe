<template>
  <v-dialog
    v-model="dialog"
    max-width="300"
    @keydown.esc="dialog = false"
    @keydown.enter="onLogin"
  >
    <v-card>
      <v-card-title>
        <span class="headline">登录吧</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                v-model="form.username"
                ref="username"
                name="username"
                label="用户名"
                autofocus
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="form.password"
                type="password"
                name="password"
                label="密码"
              />
            </v-flex>
          </v-layout>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          flat
          @click="dialog = false"
        >取消</v-btn>
        <v-btn
          color="blue darken-1"
          flat
          @click="onLogin"
        >登录</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'LoginDialog',
  data: () => ({
    dialog: false,
    form: {
      username: '',
      password: '',
    },
  }),
  created() {
    this.$bus.$on('let-us-login', this.onLetUsLogin)
  },
  beforeDestroy() {
    this.$bus.$off('let-us-login', this.onLetUsLogin)
  },
  methods: {
    onLetUsLogin() {
      this.dialog = true
    },
    async onLogin() {
      try {
        await this.$store.dispatch('login', this.form)
        this.$snackbar('登录咯')
        this.dialog = false
      } catch (e) {

      }
    },
  },
  watch: {
    dialog(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.$refs.username.$refs.input.focus()
        })
      } else {
        this.$refs.form.reset()
      }
    },
  },
}
</script>
