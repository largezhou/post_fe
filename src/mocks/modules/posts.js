import mock from '../mock'
import postTmpl from '../templates/posts'

mock('/posts', 'get', {
  data: {
    'data|10': [postTmpl],
  },
})

mock('/posts', 'post', {
  data: postTmpl,
})
