import axios from '@/plugins/axios'

export function getEmojis(category) {
  return axios({
    url: 'emojis',
    method: 'get',
    params: {
      c: category,
    },
  })
}
