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
                v-validate="'required|length:6,20'"
                v-model="form.username"
                :error-messages="errors.collect('username')"
                ref="username"
                name="username"
                label="用户名"
                autofocus
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-validate="'required|length:6,20'"
                v-model="form.password"
                :error-messages="errors.collect('password')"
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
          flat
          @click="dialog = false"
        >取消</v-btn>
        <v-btn
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
    loggedInCallback: null,

    dictionary: {
      custom: {
        username: {
          required: () => '我怎么知道你是谁？',
          length: () => '别瞎试，只能是这么 6~20 这么长',
        },
        password: {
          required: () => '不能随便让你登录啊',
          length: () => '别瞎试，只能是这么 6~20 这么长',
        },
      },
    },
  }),
  created() {
    this.$bus.$on('let-me-login', this.onLetMeLogin)
    this.$validator.localize('en', this.dictionary)
  },
  beforeDestroy() {
    this.$bus.$off('let-me-login', this.onLetMeLogin)
  },
  methods: {
    onLetMeLogin(loggedInCallback = null) {
      this.loggedInCallback = loggedInCallback
      this.dialog = true
    },
    async onLogin() {
      if (!await this.$validator.validateAll()) {
        return false
      }

      try {
        await this.$store.dispatch('login', this.form)
        this.$snackbar('登录咯')
        this.dialog = false

        if (typeof this.loggedInCallback === 'function') {
          this.loggedInCallback()
        }
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
