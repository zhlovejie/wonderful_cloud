<template>
  <a-modal
    :title="modalTitle"
    :width="750"
    :visible="visible"
    :destroyOnClose="true"
    @cancel="handleCancel"
    :maskClosable="false"
    :class="{'ant-modal_no_footer':isView}"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button key="back" icon="close" @click="noPassAction">不通过</a-button>
        <a-button
          key="submit"
          type="primary"
          icon="check"
          :loading="spinning"
          @click="passAction"
        >通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleSubmit">确定</a-button>
      </template>
    </template>
    <a-spin :spinning="spinning">
      <a-form :form="form" layout="inline" class="wdf-custom-add-form-wrapper">
        <a-form-item hidden>
          <a-input v-decorator="['id',{initialValue:detail.id}]" />
        </a-form-item>
        <a-form-item hidden>
          <a-input v-decorator="['instanceId',{initialValue:detail.instanceId}]" />
        </a-form-item>

        <table class="custom-table custom-table-border">
          <tr>
            <td style="width:150px;">编号</td>
            <td style="width:220px;">
              <span v-if="!isDisabled" style="color:#999;">系统自动生成</span>
              <span v-else>{{detail.txNum}}</span>
            </td>
            <td style="width:150px;">部门</td>
            <td style="width:220px;">{{detail.departmentName || userInfo.departmentName}}</td>
          </tr>
          <tr>
            <td>岗位</td>
            <td>{{detail.stationName || userInfo.stationName}}</td>
            <td>姓名</td>
            <td>{{detail.createdName || userInfo.trueName}}</td>
          </tr>

          <tr>
            <td>申请事项</td>
            <td>
              <a-form-item>
                <a-select 
                  v-if="!isDisabled"
                  placeholder="申请事项"
                  :allowClear="true" 
                  v-decorator="[`itemType`,{initialValue:detail.itemType,rules: [{required: true,message: '请选择申请事项'}]}]"
                >
                  <a-select-option :value="1">初次申请</a-select-option>
                  <a-select-option :value="2">调整申请</a-select-option>
                  <a-select-option :value="3">其他申请</a-select-option>
                </a-select>
                <span v-else>{{ {1:'初次申请',2:'调整申请',3:'其他申请'}[detail.itemType] || '未知' }}</span>
              </a-form-item>
            </td>
            <td>补贴金(元/月)</td>
            <td colspan="3">
              <a-form-item>
                <a-input-number 
                  v-if="!isDisabled"
                  style="width:100%;"
                  :min="0"
                  :max="99999"
                  :step="1"
                  :precision="2"
                  v-decorator="['amount', {initialValue:detail['amount'], rules: [{ required: true, message: '请输入补贴金' }]}]"
                />
                <span v-else>{{detail['amount'] | moneyFormatNumber}}</span>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td>申请原因</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  v-if="!isDisabled"
                  style="width: 100%"
                  placeholder="申请原因"
                  :rows="2"
                  v-decorator="[
                    'reason',
                    { initialValue: detail.reason, rules: [{ required: true, message: '请输入申请原因' }] },
                  ]"
                />
                <span v-else>{{ detail.reason }}</span>
              </a-form-item>
            </td>
          </tr>

          <tr>
            <td>备注</td>
            <td colspan="3">
              <a-form-item>
                <a-textarea
                  v-if="!isDisabled"
                  style="width: 100%"
                  placeholder="备注"
                  :rows="2"
                  v-decorator="[
                    'remark',
                    { initialValue: detail.remark, rules: [{ required: false, message: '请输入备注' }] },
                  ]"
                />
                <span v-else>{{ detail.remark }}</span>
              </a-form-item>
            </td>
          </tr>
        </table>
      </a-form>
    </a-spin>

    <Approval ref="approval" @opinionChange="opinionChange" />
  </a-modal>
</template>
<script>

import {
  ComApplyApproval,
  ComApplyAddOrUpdate
} from '@/api/salaryManagement'
import {queryStationLevel} from '@/api/common'
import {levelRulePageList } from '@/api/salaryManagement'
import Approval from './Approval'
import moment from 'moment'

let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name: 'addForm',
  components: { Approval },
  data() {
    return {
      form: this.$form.createForm(this),
      visible: false,
      spinning: false,
      actionType: 'view',
      detail: {},
      record: {},
      spinning: false,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      festivalDetails:[]
    }
  },
  computed: {
    modalTitle() {
      let obj = { view: '查看', add: '新增', edit: '修改', approval: '审批' }
      return `${obj[this.actionType]}`
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
  watch: {},
  methods: {
    moment,
    init() {
      let that = this
      let queue = []
      return Promise.all(queue)
    },
    async query(type, record) {
      //debugger
      let that = this
      await that.form.resetFields()
      that.actionType = type
      that.record = Object.assign({}, record)
      that.detail = {}
      await that.init()
      that.visible = true
      // if (that.isAdd) {
      //   that.detail = {}
      //   return
      // }
      let money = +that.record.amount || 0
      try{
        if(money === 0){
          let stationLevel = await queryStationLevel({id:that.userInfo.stationId}).then(res => res && res.data && res.data.level ? res.data.level : null)
          let records = await levelRulePageList({current:1,size:10,levelType:stationLevel}).then(res => res.data.records)
          if(Array.isArray(records) && records.length > 0){
            money = +records[0].comAmount || 0
          }
        }
      }catch(err){
        console.log(err)
      }
      that.detail = { ...that.record,amount:money }
    },
    handleSubmit() {
      let that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          
          values.createdId = that.userInfo.id
          if (that.isEdit) {
            values.id = that.record.id
          }
          console.log('Received values of form: ', values)
          
          that.spinning = true
          ComApplyAddOrUpdate(values)
            .then(res => {
              that.spinning = false
              if (res.code === 200) {
                that.visible = false
                that.$message.success('操作成功')
                that.$emit('finish')
              } else {
                that.$message.warning(res.msg)
              }
            })
            .catch(err => {
              that.spinning = false
              that.$message.error('操作失败')
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => (this.visible = false))
    },
    submitAction(opt) {
      let that = this
      let values = Object.assign({}, opt || {}, { approveId: that.record.id })
      that.spinning = true
      ComApplyApproval(values)
        .then((res) => {
          that.spinning = false
          console.log(res)
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch((err) => (that.spinning = false))
    },
    passAction(opt = {}) {
      this.submitAction(Object.assign({}, { isAdopt: 0, opinion: '通过' }, opt || {}))
    },
    noPassAction() {
      let that = this
      that.$refs.approval.query()
    },
    opinionChange(opinion) {
      //审批意见
      this.submitAction({
        isAdopt: 1,
        opinion: opinion,
      })
    },
  },
}
</script>
<style>
.ant-upload-list-picture-card .ant-upload-list-item-info::before{
  left: 0;
}
</style>
<style scoped>
.wdf-custom-add-form-wrapper >>> .ant-form-item {
  display: flex;
  margin: 0;
}

.ant-form-item >>> .ant-form-item-label {
  width: 80px;
}
.ant-form-item >>> .ant-form-item-control-wrapper {
  flex: 1;
}
.custom-table-border th,
.custom-table-border td {
  padding: 10px;
}

.custom-table >>> .custom-table {
  margin-bottom: 0;
  margin: -1px;
}
</style>