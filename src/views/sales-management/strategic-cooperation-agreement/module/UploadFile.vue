<template>
  <a-modal
    :title="modalTitle"
    :width="750"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <a-upload
        name="file"
        :action="uploadUrl"
        :multiple="false"
        :beforeUpload="beforeUpload"
        :fileList="fileList"
        @change="handleChange"
      >
        <a-button>
          <a-icon type="upload" />
          {{ this.$attrs.txt || '上传' }}
        </a-button>
      </a-upload>
    </a-spin>
  </a-modal>
</template>

<script>
import { getUploadPath2 } from '@/api/common'
import { cooperationProtocolAddAccessory } from '@/api/qualificationsBorrowManagement'

import {
  cooperationProtocolDetail
} from '@/api/qualificationsBorrowManagement'

export default {
  name: 'uploadFile',
  data() {
    return {
      modalTitle: '上传文件',
      visible: false,
      uploadUrl: getUploadPath2(),
      fileList: [],
      aceptFileTypes: [
        '.doc',
        '.docx',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      record: {},
      spinning: false,
    }
  },
  methods: {
    async query(type, record) {
      const that = this
      that.visible = true
      that.fileList = []
      that.record = record || {}
      that.record = await cooperationProtocolDetail({id:that.record.id}).then(res =>res.data)
      if(that.record.accessory){
        let accessory = that.record.accessory
        that.fileList = [
          {
            uid:1,
            name:accessory.slice(accessory.lastIndexOf('/')+1),
            status:'done',
            url:that.record.accessory
          }
        ]
      }
    },
    handleOk() {
      let that = this
      let id = that.record.id
      let files = that.getFiles()
      if (files.length === 0) {
        that.handleCancel()
        return
      }
      let accessoryUrl = files[0].url
      that.spinning = true
      cooperationProtocolAddAccessory(`id=${id}&accessoryUrl=${accessoryUrl}`)
        .then((res) => {
          that.spinning = false
          that.$message.info(res.msg)
          if (+res.code === 200) {
            that.handleCancel()
          }
        })
        .catch((err) => {
          that.spinning = false
          that.$message.info(err.message)
        })
    },
    handleCancel() {
      this.visible = false
    },
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 100
      if (!isLt10M) {
        this.$message.error('上传文件必须小于100M!')
      }
      return isLt10M
    },
    handleChange(info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      fileList = fileList.map((file) => {
        if (file.response && file.response.code === 200) {
          file.url = file.response.data
        }
        return file
      })
      this.fileList = fileList.filter((f) => this.checkFile(f))
    },
    checkFile(file) {
      //const isDocType = this.aceptFileTypes.includes(file.type)
      const isLt10M = file.size / 1024 / 1024 < 100
      return isLt10M
    },
    getFiles() {
      return [...this.fileList]
    },
    setFiles(files) {
      this.fileList = files.map((f) => {
        return {
          uid: Math.random().toString(16).slice(-10),
          name: f.fileName || f.url,
          status: 'done',
          url: f.url,
        }
      })
    },
  },
}
</script>

<style scoped>
</style>