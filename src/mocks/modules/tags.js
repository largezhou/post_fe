import { getPostsArgs } from '@/mocks/modules/posts'
import mock from '../mock'

mock(/\/tags\/[^/]+\/posts/, 'get', ...getPostsArgs)

mock(/\/tags\/?(\?.*)?/, 'get', {
  'data|5': [
    {
      'id|+1': 1,
      name: '@cword(2,4)',
    },
  ],
})
