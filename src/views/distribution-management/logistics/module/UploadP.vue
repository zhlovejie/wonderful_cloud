<template>
  <div class="clearfix">
    <!-- <template>
      <a-upload
        list-type="picture-card"
        :file-list="fileList"
        @preview="handlePreview"
        @change="handleChange"
        :disabled="true"
      ></a-upload>
      <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
    </template>-->
    <template>
      <a-upload
        :action="uploadUrl"
        accept=".png, .jpg"
        :disabled="typeNameId"
        list-type="picture-card"
        :file-list="fileList"
        @preview="handlePreview"
        @change="handleChange"
      >
        <div v-if="fileList.length <3 &&typeNameId===false ">
          <a-icon type="plus" />
          <div class="ant-upload-text">证件</div>
        </div>
      </a-upload>
      <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
    </template>
  </div>
</template>
<script>
import { getUploadPath2 } from '@/api/common'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}
export default {
  name: 'BecomingForm',
  data() {
    return {
      uploadUrl: getUploadPath2(),
      id: this.msg,
      tempName: this.name,
      previewVisible: false,
      previewImage: '',
      fileList: [],
      fileUrl: [],
      typeNameId: false,
    }
  },
  props: ['msgId', 'name'],
  watch: {
    msgId: function (val, oldVal) {
      this.fileList = val || []
    },
    name: function (val, oldVal) {
      this.typeNameId = val || ''
    },
  },
  created() {
    this.fileList = this.msgId
    this.typeNameId = this.name
  },
  methods: {
    handleCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange({ fileList }) {
      let that = this
      that.fileList = fileList
    },
    getFiles() {
      return Object.assign([], this.fileList)
    },
  },
}
</script>
<style scoped>
/*自定义table样式*/
</style>