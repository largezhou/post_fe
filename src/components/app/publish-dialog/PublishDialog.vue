<template>
  <div class="publish-dialog">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="565px"
      :fullscreen="mobile"
    >
      <v-card>
        <v-toolbar
          card
          color="white"
        >
          <v-btn
            icon
            @click="onClose"
            color="grey lighten-5"
          >
            <mdi-icon>close</mdi-icon>
          </v-btn>
          <v-spacer/>
          <v-toolbar-items>
            <v-btn
              flat
              @click="onPublish"
            >
              <span class="icon-publish"/>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form">
            <v-container grid-list-xs>
              <v-layout wrap>
                <v-flex xs12>
                  <v-textarea
                    v-model="form.content"
                    v-validate="rules.content"
                    ref="content"
                    data-vv-name="content"
                    :error-messages="errors.collect('content')"
                    name="content"
                    label="说点啥呢，，，"
                    no-resize
                  />
                </v-flex>
                <v-flex xs12>
                  <v-layout>
                    <v-flex xs6>
                      <v-switch
                        v-validate="rules.layout"
                        data-vv-name="layout"
                        ref="layout"
                        :error-messages="errors.collect('layout')"
                        class="pick-switch"
                        v-model="form.layout"
                        :true-value="LAYOUT_CAROUSEL"
                        :false-value="LAYOUT_NINE_GRID"
                        :label="form.layout === LAYOUT_NINE_GRID ? '九宫' : '轮播'"
                      />
                    </v-flex>
                    <v-flex xs6>
                      <v-switch
                        :disabled="this.form.images.length === 0"
                        class="pick-switch"
                        v-model="previewLayout"
                        :label="previewLayout ? '排版预览' : '编辑中...'"
                      />
                    </v-flex>
                  </v-layout>
                </v-flex>

                <pd-preview-layout
                  :images.sync="form.images"
                  :layout="form.layout"
                  v-show="canPreviewLayout"
                />

                <v-flex
                  v-show="!canPreviewLayout"
                  xs12
                >
                  <pd-images-select
                    v-validate="rules.images"
                    data-vv-name="images"
                    ref="images"
                    v-model="form.images"
                    :error-messages="errors.collect('images')"
                  />
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <pd-image-edit/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  LAYOUT_CAROUSEL,
  LAYOUT_NINE_GRID,
  MAX_IMAGES_COUNT,
  mapConstants,
} from '@/libs/constants'
import PdPreviewLayout from './PdPreviewLayout'
import PdImageEdit from './PdImageEdit'
import PdImagesSelect from './PdImagesSelect'
import { storePost } from '@/api/posts'

export default {
  name: 'PublishDialog',
  components: {
    PdImagesSelect,
    PdImageEdit,
    PdPreviewLayout,
  },
  data: () => ({
    dialog: false,
    form: {
      content: '',
      images: [],
      layout: LAYOUT_NINE_GRID,
    },
    previewLayout: false,

    rules: {
      content: {
        required_if_no_image: 'images',
        max: 255,
      },
      images: {
        // 这个不知道为啥，每次验证的 content 都是上一次的值
        not_empty_if_no_content: 'content',
        length: [0, MAX_IMAGES_COUNT],
      },
      layout: {
        included: [LAYOUT_CAROUSEL, LAYOUT_NINE_GRID],
      },
    },
    dictionary: {
      custom: {
        content: {
          required_if_no_image: () => '总要说点什么吧，图片也没有',
          max: () => '内容太多了，没什么意义',
        },
        images: {
          not_empty_if_no_content: () => '什么都没说，总要来张图吧',
          length: () => `图片太多了吧，最多只能 ${MAX_IMAGES_COUNT} 张的`,
        },
        layout: {
          included: () => '选错了吧',
        },
      },
    },
  }),
  computed: {
    ...mapState({
      mobile: (state) => state.app.mobile,
    }),
    ...mapConstants([
      'LAYOUT_CAROUSEL',
      'LAYOUT_NINE_GRID',
      'MAX_IMAGES_COUNT',
    ]),

    canPreviewLayout() {
      return this.previewLayout && this.form.images.length > 0
    },
  },
  created() {
    // 备份初始 form 数据，用来重置表单
    this.formBak = JSON.stringify(this.form)
    this.$bus.$on('let-me-publish', this.onLetMePublish)
    this.$validator.localize('en', this.dictionary)
  },
  beforeDestroy() {
    this.$bus.$off('let-me-publish', this.onLetMePublish)
  },
  methods: {
    onReset() {
      this.form = JSON.parse(this.formBak)
      this.previewLayout = false
      this.$validator.reset()
    },
    onClose() {
      this.dialog = false
      this.onReset()
    },
    /**
     * 打开弹框
     */
    onLetMePublish() {
      this.dialog = true
    },
    /**
     * 请求发布
     */
    async onPublish() {
      if (!await this.$validator.validateAll()) {
        return false
      }

      const fd = this.makeFormData()

      const { data } = await storePost(fd)
      this.$bus.$emit('new-post', data)
      this.onClose()
    },
    makeFormData() {
      const form = this.form

      const fd = new FormData()
      fd.append('content', form.content)
      fd.append('layout', form.layout)

      // FormData 的值，只能是 string 或者 Blob
      // 所以 images 对象数组，使用这种方式
      form.images.forEach((img, i) => {
        fd.append(`images[${i}]`, img.file)
        fd.append(`naked[${i}]`, img.naked)
      })

      return fd
    },
  },
}
</script>
