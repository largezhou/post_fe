import axios from '@/plugins/axios'

export function getPosts() {
  return axios({
    url: 'posts',
    method: 'get',
  })
}

export function storePost(data) {
  return axios({
    url: 'posts',
    method: 'post',
    data,
  })
}
