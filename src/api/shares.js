import axios from '@/plugins/axios'

export function storeShare(data) {
  return axios({
    url: 'shares',
    method: 'post',
    data,
  })
}

export function getShare($key) {
  return axios({
    url: `shares/${$key}`,
    method: 'get',
  })
}
