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

export function getEmojiCats(config) {
  return axios({
    url: 'emoji-cats',
    method: 'get',
    ...config,
  })
}
