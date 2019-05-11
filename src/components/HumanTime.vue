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
      return dayjs(this.time).fromNow()
    },
  },
}
</script>
