import mock from '../mock'
import postTmpl from '../templates/posts'
import dayjs from 'dayjs'

mock('/posts', 'get', {
  data: {
    'data|10': [postTmpl],
  },
})

mock('/posts', 'post', {
  data: postTmpl,
}, (tmpl, options) => {
  // 按请求中的数据，来生成接近真实的返回数据
  const body = options.body
  const data = tmpl.data

  data.content = body.get('content')
  data.layout = body.get('layout')

  const images = []
  for (let k of body.keys()) {
    if (k.indexOf('images[') === 0) {
      images.push(URL.createObjectURL(body.get(k)))
    }
  }
  data.images = images
  data.created_at = dayjs().format('YYYY-MM-DD HH:mm:ss')
})
