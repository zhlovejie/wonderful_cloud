<template>
  <div class="clearfix">
    <template v-if="this.typeNameId==='view'">
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
    </template>
    <template v-else>
      <a-upload
        :action="uploadUrl"
        list-type="picture-card"
        :file-list="fileList"
        @preview="handlePreview"
        @change="handleChange"
      >
        <div v-if="fileList.length < 8">
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
      typeNameId: '',
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
      return [...(this.fileList || [])]
    },
  },
}
</script>
<style scoped>
/*自定义table样式*/
.custom-table {
  margin-bottom: 0;
}

.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.custom-table >>> .custom-table {
  position: relative;
  top: 0;
  left: 0;
  width: calc(100% + 2px);
  margin-bottom: -2px;
}
.custom-table >>> .custom-table td {
  text-align: left;
}
.becoming-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.bank-card-list-wrapper {
  display: flex;
}
.bank-card-list-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0 7px;
}
</style>