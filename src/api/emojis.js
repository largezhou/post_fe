import axios from '@/plugins/axios'

export function getEmojis(category, config) {
  return axios({
    url: 'emojis',
    method: 'get',
    params: {
      c: category,
    },
    ...config,
  })
}
