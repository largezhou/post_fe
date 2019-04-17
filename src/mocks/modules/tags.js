import { getPostsArgs } from '@/mocks/modules/posts'
import mock from '../mock'
import utils from '@/libs/utils'

mock(/\/tags\/[^/]+\/posts/, 'get', ...getPostsArgs)

mock(/\/tags\/?(\?.*)?/, 'get', {
  'data|5': [
    {
      'id|+1': 1,
      name: '@cword(2,4)',
    },
  ],
}, (tmpl, options) => {
  const { q } = utils.queryFromUrl(options.url)
  if (q) {
    return {
      'data|5': [
        {
          'id|+1': 1,
          name: q + '@cword(1,3)',
        },
      ],
    }
  }
})
