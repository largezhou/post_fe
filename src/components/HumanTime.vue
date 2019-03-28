<template>
  <v-tooltip
    top
  >
    <span slot="activator">{{ human }}</span>
    <span>{{ prefix + time }}</span>
  </v-tooltip>
</template>

<script>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)

export default {
  name: 'HumanTime',
  props: {
    time: {
      type: String,
      required: true,
    },
    prefix: {
      type: String,
      default: '',
    },
  },
  computed: {
    human() {
      return dayjs(this.time).locale('zh-cn').fromNow()
    },
  },
}
</script>
