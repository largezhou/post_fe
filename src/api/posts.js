import axios from '@/plugins/axios'

export function getPosts(params = {}) {
  return axios({
    url: 'posts',
    method: 'get',
    params,
  })
}

export function storePost(data) {
  return axios({
    url: 'posts',
    method: 'post',
    data,
  })
}

export function destroyPost(id) {
  return axios({
    url: `posts/${id}`,
    method: 'delete',
  })
}
