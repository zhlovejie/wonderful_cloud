<template>
  <a-modal
    :title="modalTitle"
    :width="1005"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :confirmLoading="spinning"
  >
    <template slot="footer">
      <template v-if="isApproval">
        <a-button class="a-button" type="primary" icon="close" @click="noPassAction(recordDetails)">不通过</a-button>
        <a-button class="a-button" type="primary" icon="check" @click="passAction()">通过</a-button>
      </template>
      <template v-else>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="spinning" @click="handleOk">确定</a-button>
      </template>
    </template>

    <a-spin :spinning="spinning">
      <a-form :form="form" class="becoming-form-wrapper">
        <h1 style="text-align: center">公司职工年终奖发放表</h1>
        <table class="custom-table custom-table-border">
          <tr>
            <th>序号</th>
            <th>部门</th>
            <th>职工姓名</th>
            <th>实发奖金</th>
            <th>一期奖金</th>
            <th>二期奖金</th>
            <th>三期奖金</th>
          </tr>
          <tr v-for="(item, index) in programme" :key="item.key">
            <td>
              {{ index + 1 }}
            </td>
            <td>{{ item.departmentName }}</td>
            <td>{{ item.trueName }}</td>
            <td>
              <a-form-item>
                <a-input
                  :disabled="isDisabled"
                  placeholder
                  @change="inputChange($event, item.userId, 'amount')"
                  v-decorator="[
                    `programme${index}.amount`,
                    { initialValue: item.amount, rules: [{ required: true, message: '请输入实发奖金' }] },
                  ]"
                />
              </a-form-item>
            </td>
            <td>{{ item.firAmount }}</td>
            <td>{{ item.secAmount }}</td>
            <td>{{ item.thrAmount }}</td>
          </tr>
          <tr>
            <td colspan="3">合计：</td>
            <td>{{ totalPrice }}</td>
            <td>{{ totalPhase }}</td>
            <td>{{ totalPhase1 }}</td>
            <td>{{ totalPhase2 }}</td>
          </tr>
        </table>
      </a-form>
      <Approval ref="approval" @opinionChange="opinionChange" />
    </a-spin>
  </a-modal>
</template>
<script>
import { queryList } from '@/api/humanResources'

import { year_send_rule, year_annual_addAndUpdate, year_send_getId, year_annual_approval } from '@/api/bonus_management'
import Approval from './Approval'

let uuid = () => Math.random().toString(32).slice(-10)

export default {
  name: 'BecomingForm',
  components: {
    Approval: Approval,
  },
  data() {
    return {
      programme: [],
      remark: '',
      visible: false,
      spinning: false,
      year_send: {},
      ment: false,
      form: this.$form.createForm(this, { name: 'do_becoming' }),
      type: 'view',
      record: {},
      isModified: false, //财务人员为 true
      previewVisible: false,
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改年终奖金'
      }
      let txt = this.isView ? '查看' : this.isEdit ? '审核' : this.isView5 ? '查看' : '新增'
      return `${txt}年终奖金`
    },
    isView() {
      //查看
      return this.type === 'view'
    },
    isView5() {
      //查看
      return this.type === 'view5'
    },
    isEdit() {
      //审核
      return this.type === 'edit'
    },
    isApproval() {
      //通过不通过
      return this.type === 'edit'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },
    isDisabled() {
      return this.isView || this.isEdit || this.isView5
    },
    totalPrice() {
      return this.programme.reduce((addr, item) => {
        addr = Number(addr) + Number(item.amount)
        return parseFloat(addr).toFixed(2)
      }, 0)
    },
    totalPhase() {
      return this.programme.reduce((addr, item) => {
        addr = Number(addr) + Number(item.firAmount || 0)
        return parseFloat(addr).toFixed(2)
      }, 0)
    },
    totalPhase1() {
      return this.programme.reduce((addr, item) => {
        addr = Number(addr) + Number(item.secAmount || 0)
        return parseFloat(addr).toFixed(2)
      }, 0)
    },
    totalPhase2() {
      return this.programme.reduce((addr, item) => {
        addr = Number(addr) + Number(item.thrAmount || 0)
        return parseFloat(addr).toFixed(2)
      }, 0)
    },
  },

  methods: {
    // moment,
    inputChange(event, keys, field) {
      let programme = [...this.programme]
      let target = programme.find((item, index) => item.userId === keys)
      if (target) {
        target[field] = event instanceof Event ? event.target.value : event
        target['firAmount'] = parseFloat(target[field] * this.year_send.firPart).toFixed(2)
        target['secAmount'] = parseFloat(target[field] * this.year_send.secPar).toFixed(2)
        target['thrAmount'] = parseFloat(target[field] * this.year_send.thrPar).toFixed(2)
        this.programme = programme
      }
    },
    query(type, record) {
      this.visible = true
      this.type = type
      this.record = record
      year_send_rule().then((res) => (this.year_send = res.data[0]))
      if (type === 'add') {
        console.log(record)
        return queryList({ departmentId: record.depId }).then((res) => {
          this.programme = res.data.map((res) => {
            return {
              departmentId: record.depId,
              departmentName: record.departmentName,
              amount: '',
              trueName: res.trueName,
              userId: res.id,
              firAmount: undefined,
              secAmount: undefined,
              thrAmount: undefined,
            }
          })
          console.log(res.data)
        })
      } else {
        this.fillData()
      }
    },
    // 详情
    fillData() {
      let that = this
      this.$nextTick(() => {
        year_send_getId({ id: this.record.id }).then((res) => {
          console.log(res.data)
          this.programme = res.data.oaSalaryBounsAnnulDetails
          this.record.depId = res.data.departmentId
        })
      })
    },

    handleOk() {
      // console.log('你是要提交')
      let that = this
      if (that.type === 'view') {
        this.visible = false
      } else {
        that.form.validateFields((err, values) => {
          if (!err) {
            let arr = {}
            if (that.type === 'edit-salary') {
              arr.id = that.record.id
            }

            arr.departmentId = that.record.depId
            arr.oaSalaryBounsAnnulDetails = this.programme

            if (that.type === 'add' || that.type === 'edit-salary') {
              that.spinning = true
              year_annual_addAndUpdate(arr)
                .then((res) => {
                  this.programme = []
                  this.visible = false
                  that.spinning = false
                  that.$message.info(res.msg)
                  that.$emit('finish')
                })
                .catch((err) => (that.spinning = false))
            }
          }
        })
      }
    },
    handleCancel() {
      this.programme = []
      this.remark = '' // 清空表
      this.visible = false
    },
    submitAction(opt) {
      let that = this
      let values = {
        approveId: this.record.id,
        isAdopt: opt.isAdopt,
        opinion: opt.opinion,
      }
      that.spinning = true
      year_annual_approval(values)
        .then((res) => {
          that.spinning = false
          that.form.resetFields() // 清空表
          that.visible = false
          that.$message.info(res.msg)
          that.$emit('finish')
        })
        .catch((err) => (that.spinning = false))
    },
    passAction() {
      this.submitAction({
        isAdopt: 0,
        // opinion: '通过',
      })
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