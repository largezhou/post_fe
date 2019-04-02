<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="565px"
    :fullscreen="mobile"
  >
    <v-card>
      <v-toolbar
        card
        color="grey lighten-5"
      >
        <v-btn
          icon
          @click="onCancel"
          color="grey lighten-5"
        >
          <mdi-icon>close</mdi-icon>
        </v-btn>
        <v-spacer/>
        <v-toolbar-items>
          <v-btn flat>
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
                  name="content"
                  label="说点啥呢，，，"
                  no-resize
                />
              </v-flex>
              <v-flex xs12>
                <v-layout>
                  <v-flex xs6>
                    <v-switch
                      class="pick-switch"
                      v-model="form.layout"
                      :true-value="LAYOUT_CAROUSEL"
                      :false-value="LAYOUT_NINE_GRID"
                      :label="form.layout === LAYOUT_NINE_GRID ? '九宫' : '轮播'"
                    />
                  </v-flex>
                  <v-flex xs6>
                    <v-switch
                      class="pick-switch"
                      v-model="previewLayout"
                      :label="previewLayout ? '排版预览' : '编辑中...'"
                    />
                  </v-flex>
                </v-layout>
              </v-flex>

              <pd-preview-layout
                :images="form.images"
                :layout="form.layout"
                v-show="canPreviewLayout"
              />

              <v-flex
                v-show="!canPreviewLayout"
                xs12
              >
                <v-layout wrap>
                  <pd-image
                    v-for="(img, i) of form.images"
                    :src="img.src"
                    :key="img.src"
                    @clear="onClear(i)"
                  />
                  <v-flex
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
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import PdImage from '@/components/app/publish-dialog/PdImage'
import { LAYOUT_NINE_GRID, mapConstants } from '@/libs/constants'
import PdPreviewLayout from '@/components/app/publish-dialog/PdPreviewLayout'

const MAX_IMAGES_COUNT = 9

export default {
  name: 'PublishDialog',
  components: {
    PdPreviewLayout,
    PdImage,
  },
  data: () => ({
    dialog: false,
    form: {
      content: '',
      images: [],
      layout: LAYOUT_NINE_GRID,
    },
    previewLayout: false,
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
    this.$bus.$on('let-me-publish', this.onLetMePublish)
  },
  beforeDestroy() {
    this.$bus.$off('let-me-publish', this.onLetMePublish)
  },
  methods: {
    onReset() {
      this.$refs.form.reset()
      this.form.images = []
    },
    onCancel() {
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
      let files = Array.from(e.target.files)
      files = files.slice(0, this.MAX_IMAGES_COUNT - this.form.images.length)
      files.forEach((f) => {
        f.src = URL.createObjectURL(f)
      })
      this.form.images.push(...files)
      e.target.value = ''
    },
    onClear(index) {
      this.form.images.splice(index, 1)
    },
    onLetMePublish() {
      this.dialog = true
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
    top: -8px;
    right: -8px;
    z-index: 2;
    width: 26px;
    height: 26px;
    margin: 0;
  }
}
</style>
