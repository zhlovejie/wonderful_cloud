<template>
  <a-modal
    :title="modalTitle"
    :width="700"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <a-spin :spinning="spinning">
      <!-- <h3 style="text-align:center;font-weight:blod;">补卡规则</h3> -->
      <a-form :form="form" layout="inline" class="wdf-custom-add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id', { initialValue: detail.id }]" />
        </a-form-item>
        <table class="custom-table custom-table-border">
          <tr>
            <td>是否可以为负数</td>
            <td>
              <a-form-item>
                <a-radio-group v-decorator="['negative', { initialValue: detail.negative }]">
                  <a-radio :value="1"> 是 </a-radio>
                  <a-radio :value="2"> 否 </a-radio>
                </a-radio-group>
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>允许负小时数</td>
            <td style="text-align: left">
              <a-form-item>
                <a-input-number
                  style="width: 100%"
                  :min="0"
                  :step="1"
                  v-decorator="[
                    'negativeHours',
                    { initialValue: detail.negativeHours, rules: [{ required: true, message: '请输入允许负小时数' }] },
                  ]"
                />
              </a-form-item>
            </td>
          </tr>
          <tr>
            <td>抵扣时限（多少天内可以抵消）</td>
            <td style="text-align: left">
              <a-form-item>
                <a-input-number
                  style="width: 100%"
                  :min="0"
                  :step="1"
                  v-decorator="[
                    'timeLimit',
                    { initialValue: detail.timeLimit, rules: [{ required: true, message: '请输入抵扣时限' }] },
                  ]"
                />
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { attenceRestRuleAddOrUpdate } from '@/api/attendanceManagement'
export default {
  name: 'attenceRestRule-add',
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      actionType: 'view',
      detail: {},
    }
  },
  computed: {
    modalTitle() {
      return `${this.isView ? '查看' : this.isAdd ? '新增' : '修改'}调休记录`
    },
    isView() {
      return this.actionType === 'view'
    },
    isAdd() {
      return this.actionType === 'add'
    },
    isEdit() {
      return this.actionType === 'edit'
    },
    isApproval() {
      return this.actionType === 'approval'
    },
    isDisabled() {
      //此状态下表单元素被禁用
      return this.isView || this.isApproval
    },
  },
  methods: {
    query(type, record) {
      this.actionType = type
      this.form.resetFields()
      this.$nextTick(() => (this.visible = true))
      if (this.isAdd) {
        this.detail = {}
        return
      }
      this.detail = Object.assign({}, record)
    },
    handleSubmit() {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          that.spinning = true
          attenceRestRuleAddOrUpdate(values)
            .then((res) => {
              that.$message.info(res.msg)
              that.spinning = false
              that.handleCancel()
              that.$emit('finish')
            })
            .catch((err) => {
              that.spinning = false
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    }
  }
}
</script>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item {
  display: flex;
}

.ant-form-item >>> .ant-form-item-label {
  width: 80px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 5px 10px;
}

.wdf-custom-add-form-wrapper >>> .ant-form-item {
  margin-bottom: 0;
}

.wdf-custom-add-form-wrapper >>> .custom-table {
  margin-bottom: 0;
}
</style>