import { getPostsArgs } from '@/mocks/modules/posts'
import mock from '../mock'

mock(/\/tags\/[^/]+\/posts/, 'get', ...getPostsArgs)
