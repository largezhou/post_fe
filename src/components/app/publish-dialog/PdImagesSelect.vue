<template>
  <div>
    <draggable
      class="layout wrap images-select-wrap"
      :value="value"
      @input="onDraggableInput"
      group="pd-image"
      draggable=".image-preview-wrap"
    >
      <pd-image
        v-for="(img, i) of value"
        :src="img.src"
        :key="img.src"
        @clear="onClear(i)"
        class="pointer"
        @click.native="$bus.$emit('image-edit', img)"
      />
      <v-flex
        slot="footer"
        v-show="!countMax"
        class="file-picker-wrap pointer"
        @click="onClickPicker"
        :disabled="countMax"
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
            v-for="(err, i) of errorMessages"
            :key="i"
            class="v-messages__message"
          >{{ err }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PdImage from './PdImage'
import { mapConstants } from '@/libs/constants'
import Draggable from 'vuedraggable'
import utils from '@/libs/utils'

export default {
  name: 'PdImagesSelect',
  components: {
    PdImage,
    Draggable,
  },
  props: {
    value: Array,
    errorMessages: Array,
  },
  computed: {
    ...mapConstants([
      'MAX_IMAGES_COUNT',
    ]),
    countMax() {
      return this.value.length === this.MAX_IMAGES_COUNT
    },
  },
  methods: {
    async onFileSelect(e) {
      const images = [...this.value]

      let files = Array.from(e.target.files)
        .slice(0, this.MAX_IMAGES_COUNT - images.length)
      // 这个 mock 会处理所有请求，但是不能正确处理 blob 返回格式
      // 使用了 mockjs 会出问题，
      // 所以使用了 mock 就不处理旋转问题
      if (!process.env.VUE_APP_USE_MOCK) {
        files = await this.handleFiles(files)
      }

      files.forEach((f) => {
        images.push({
          file: f,
          src: URL.createObjectURL(f),
          naked: false,
        })
      })
      // 清除文件 input 的值，这样就可以重复选择同一张图片
      e.target.value = ''

      this.$emit('input', images)
    },
    // 处理旋转问题
    handleFiles(files) {
      const promises = files.map((f) => {
        return utils.fixImageOrientation(f)
      })
      return Promise.all(promises)
    },
    onClear(index) {
      const images = [...this.value]
      images.splice(index, 1)
      this.$emit('input', images)
    },
    onClickPicker() {
      if (this.countMax) {
        return
      }
      this.$refs.fileInput.click()
    },
    onDraggableInput(value) {
      this.$emit('input', value)
    },
  },
}
</script>

<style scoped lang="scss">
.images-select-wrap {
  margin-bottom: 8px !important;
}

.file-picker-wrap {
  height: 100px;
  width: 100px;
  max-width: 100px;
}

.file-picker-wrap {
  border: 2px dashed #ccc;
  display: flex;
  justify-content: center;

  .picker-icon {
    align-items: center;
  }
}
</style>
