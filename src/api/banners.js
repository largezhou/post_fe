import axios from '@/plugins/axios'

export function getBanners() {
  return axios({
    url: 'banners',
    method: 'get',
  })
}
