import axios from '@/plugins/axios'

export function getTagPosts(tagName, params) {
  return axios({
    url: `tags/${tagName}/posts`,
    method: 'get',
    params,
  })
}

export function getTags(params) {
  return axios({
    url: 'tags',
    method: 'get',
    params,
  })
}
