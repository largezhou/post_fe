<template>
  <v-dialog
    v-model="dialog"
    width="290"
    @keydown.esc="dialog = false"
    class="lalala"
  >
    <v-card>
      <v-card-title class="headline">分享</v-card-title>

      <v-card-text>
        <v-form>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <div
                  class="grey--text"
                  style="font-size: 16px;"
                >给看几天？</div>
                <v-radio-group
                  v-model="expired_in"
                  row
                >
                  <v-radio
                    v-for="day of options"
                    :key="day"
                    :label="`${day} 天`"
                    :value="day"
                  />
                </v-radio-group>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer/>
        <v-btn
          flat="flat"
          @click="dialog = false"
        >
          取消
        </v-btn>
        <v-btn
          color="primary"
          flat="flat"
          @click="onOk"
        >
          分享
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'
import DynamicDialog from '@/mixins/DynamicDialog'

export default Vue.extend({
  name: 'ShareDialog',
  mixins: [DynamicDialog],
  data: () => ({
    expired_in: 1,
    options: [1, 7],
  }),
  methods: {
    onOk() {
      this.resolve(this.expired_in)
      this.dialog = false
    },
  },
})
</script>
