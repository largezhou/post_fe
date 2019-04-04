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
                  <draggable
                    v-validate="rules.images"
                    data-vv-name="images"
                    ref="images"
                    class="layout wrap images-select-wrap"
                    v-model="form.images"
                    group="pd-image"
                    draggable=".image-preview-wrap"
                  >
                    <pd-image
                      v-for="(img, i) of form.images"
                      :src="img.src"
                      :key="img.src"
                      @clear="onClear(i)"
                      class="pointer"
                      @click.native="$bus.$emit('image-edit', img)"
                    />
                    <v-flex
                      slot="footer"
                      v-show="!maxed"
                      class="file-picker-wrap"
                      @click="onClickPicker"
                      :disabled="maxed"
                    >
                      <mdi-icon class="picker-icon">plus</mdi-icon>
                      <input
                        ref="fileInput"
                        hidden
                        type="file"
                        readonly
                        accept=".png, .jpg, .jpeg, .gif, .bmp"
                        multiple
                        @change="onFileSelect"
                      />
                    </v-flex>
                  </draggable>
                  <div class="v-text-field__details">
                    <div class="v-messages theme--light error--text">
                      <div class="v-messages__wrapper">
                        <div
                          v-for="(err, i) of errors.collect('images')"
                          :key="i"
                          class="v-messages__message"
                        >{{ err }}
                        </div>
                      </div>
                    </div>
                  </div>
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
import PdImage from '@/components/app/publish-dialog/PdImage'
import {
  LAYOUT_CAROUSEL,
  LAYOUT_NINE_GRID,
  mapConstants,
} from '@/libs/constants'
import PdPreviewLayout from '@/components/app/publish-dialog/PdPreviewLayout'
import PdImageEdit from '@/components/app/publish-dialog/PdImageEdit'
import { storePost } from '@/api/posts'
import Draggable from 'vuedraggable'
import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'

Vue.use(VeeValidate)

// 如果没有传图片，则必须填文字内容
Validator.extend('required_if_no_image', (content, [images]) => {
  return {
    valid: !!content,
    data: {
      required: images.length === 0,
    },
  }
}, {
  hasTarget: true,
  computesRequired: true,
})

// 如果没有填文字内容，则必须至少上传一张图片
Validator.extend('not_empty_if_no_content', (images, [content]) => {
  return {
    valid: images.length > 0,
    data: {
      required: !content,
    },
  }
}, {
  hasTarget: true,
  computesRequired: true,
})

const MAX_IMAGES_COUNT = 9

export default {
  name: 'PublishDialog',
  components: {
    PdImageEdit,
    PdPreviewLayout,
    PdImage,
    Draggable,
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
        // 应该跟 draggable 有关
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
    ]),
    MAX_IMAGES_COUNT() {
      return MAX_IMAGES_COUNT
    },
    maxed() {
      return this.MAX_IMAGES_COUNT === this.form.images.length
    },
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
    onClickPicker() {
      if (this.maxed) {
        return
      }

      this.$refs.fileInput.click()
    },
    onFileSelect(e) {
      const files = Array.from(e.target.files)
        .slice(0, this.MAX_IMAGES_COUNT - this.form.images.length)
        .map((f) => {
          return {
            file: f,
            src: URL.createObjectURL(f),
            naked: false,
          }
        })
      this.form.images.push(...files)
      // 清除文件 input 的值，这样就可以重复选择同一张图片
      e.target.value = ''
    },
    onClear(index) {
      this.form.images.splice(index, 1)
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

      const { data } = await storePost(fd)
      this.$bus.$emit('new-post', data)
      this.onClose()
    },
  },
}
</script>

<style scoped lang="scss">
.image-preview-wrap,
.file-picker-wrap {
  height: 100px;
  width: 100px;
  max-width: 100px;
}

.image-preview-wrap {
  position: relative;
}

.file-picker-wrap {
  border: 2px dashed #ccc;
  display: flex;
  justify-content: center;
  cursor: pointer;

  .picker-icon {
    align-items: center;
  }
}

.disabled {
  cursor: not-allowed;
}

/deep/ {
  .clear {
    position: absolute;
    top: 2px;
    right: 2px;
    z-index: 2;
    width: 26px;
    height: 26px;
    margin: 0;
  }
}

.images-select-wrap {
  margin-bottom: 8px !important;
}
</style>
