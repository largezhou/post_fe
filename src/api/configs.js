import axios from '@/plugins/axios'

export function getConfigs() {
  return axios({
    url: 'configs',
    method: 'get',
  })
}
