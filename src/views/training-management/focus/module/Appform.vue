<template>
  <a-modal
    title="新增培训文件"
    :width="700"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <table class="custom-table custom-table-border">
          <tr>
            <td>名称</td>
            <td colspan="3">
              <a-form-item>
                <a-input
                  style="width: 300px"
                  placeholder="输入培训文件名称"
                  v-decorator="['fileName', { rules: [{ required: true, message: '请输入培训文件!' }] }]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>文件</td>
            <td colspan="3">
              <a-form-item>
                <a-upload
                  v-decorator="[
                    'trainUrl',
                    { rules: [{ required: true, message: '请上传文件' }] },
                    { valuePropName: 'fileList', getValueFromEvent: normFile },
                  ]"
                  name="file"
                  accept=".pdf, .doc, .docx"
                  :before-upload="beforeUpload"
                  :fileList="fileList"
                  @change="handleChange"
                  :action="uploadUrl"
                >
                  <a-button style="width: 300px">
                    <a-icon type="upload" />
                  </a-button>
                </a-upload>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { getUploadPath2 } from '@/api/common'

export default {
  name: 'BecomingForm',
  components: {
    // Approval: Approval,
  },
  data() {
    return {
      visible: false,
      spinning: false,
      form: this.$form.createForm(this),
      uploadUrl: getUploadPath2(),
      //   上传文件
      fileList: [],
    }
  },

  created() {},
  methods: {
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('上传文件不能超过10M')
      }
      return isLt2M
    },

    query() {
      this.visible = true
    },

    handleOk() {
      let that = this
      that.form.validateFields((err, values) => {
        values.trainUrl = values.trainUrl.fileList[0].response.data
        this.$emit('msgId', values)
        this.fileList = []
        this.form.resetFields()
        this.visible = false
      })
    },
    //上传
    normFile(e) {
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    handleChange(info) {
      this.fileList = []
      let fileList = [...info.fileList]
      fileList = fileList.map((file) => {
        if (file.response && file.response.code === 200) {
          file.url = file.response.data
        }
        return file
      })
      this.fileList = fileList
    },
    handleCancel() {
      this.fileList = []
      this.form.resetFields() // 清空表
      this.visible = false
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