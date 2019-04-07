import mock from '../mock'
import postTmpl from '../templates/posts'
import dayjs from 'dayjs'
import utils from '@/libs/utils'

mock(/\/posts\/?(\?.*)?/, 'get', {
  data: {
    'data|10': [postTmpl],
    meta: {
      per_page: 10,
    },
  },
}, (tmpl, options) => {
  const { last_id } = utils.queryFromUrl(options.url)
  if (last_id > 10) {
    return {
      data: {
        'data|1-9': tmpl.data['data|10'],
        meta: tmpl.data.meta,
      },
    }
  }
})

mock('/posts', 'post', {
  data: postTmpl,
}, (tmpl, options) => {
  // 按请求中的数据，来生成接近真实的返回数据
  const body = options.body

  const images = []
  for (let k of body.keys()) {
    if (k.indexOf('images[') === 0) {
      images.push(URL.createObjectURL(body.get(k)))
    }
  }

  return {
    data: {
      id: '@integer',
      content: body.get('content'),
      layout: body.get('layout'),
      images,
      created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    },
  }
})
