<template>
  <a-modal
    :title="modalTitle"
    :width="1000"
    :visible="visible"
    :destroyOnClose="true"
    @ok="handleCancel"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
  >
    <a-card :bordered="false">
      <div class="content">
        <step1
          v-if="currentTab === 0"
          ref="step1"
          key="step1"
          @nextStep="nextStep"
          :queryonedata="queryonedata"
          :type="type"
        />
        <step2
          v-if="currentTab === 1"
          ref="step2"
          key="step2"
          @nextStep="nextStep"
          @prevStep="prevStep"
          :queryonedata="queryonedata"
          :type="type"
        />
        <step3
          v-if="currentTab === 2"
          ref="step3"
          key="step3"
          @nextStep="nextStep"
          @prevStep="prevStep"
          :queryonedata="queryonedata"
          :type="type"
        />
        <step4
          v-if="currentTab === 3"
          ref="step4"
          key="step4"
          @nextStep="nextStep"
          @prevStep="prevStep"
          :queryonedata="queryonedata"
          :type="type"
        />
        <step5
          v-if="currentTab === 4 && type === 'view' && queryonedata.onlineFlag === 1"
          ref="step5"
          key="step5"
          @nextStep="nextStep"
          @prevStep="prevStep"
          :queryonedata="queryonedata"
          :type="type"
        />
      </div>
      <a-card :bordered="false">
        <a-steps class="steps" :current="currentTab">
          <a-step title="培训介绍" />
          <a-step title="课程安排" />
          <a-step title="受训人员" />
          <a-step title="培训资料" />
          <a-step v-if="type === 'view' && queryonedata.onlineFlag === 1" title="培训情况" />
        </a-steps>
      </a-card>
    </a-card>
  </a-modal>
</template>

<script>
import Step1 from '../../dispersed/module/CommonCustomerForm'
import Step2 from '../../dispersed/module/LinkmanForm'
import Step3 from '../../dispersed/module/Step3'
import Step4 from './Step4'
import Step5 from '../../dispersed/module/Training'

import { focusDetailVo } from '@/api/training-management'

export default {
  name: 'CommonStepForm',
  components: {
    Step1,
    Step2,
    Step3,
    Step4,
    Step5,
  },
  data() {
    return {
      visible: false, // 表单对话框是否可见
      title: '',
      currentTab: 0,
      customer: {},
      linkmans: [],
      type: '',
      record: {},
      routeParams: {},
      queryonedata: {}, // 这是获取到的单个节点所有返回数据，要通过父组件传给子组件
      subType: 'add', // 新增还是修改的标记
    }
  },
  computed: {
    modalTitle() {
      if (this.isEditSalary) {
        return '修改集中培训'
      }
      let txt = this.isView ? '查看' : this.Examine ? '审核' : '新增'
      return `${txt}集中培训`
    },
    isView() {
      //查看
      return this.type === 'view'
    },
    Examine() {
      return this.type === 'examine'
    },
    isEditSalary() {
      //修改
      return this.type === 'edit-salary'
    },
    isDisabled() {
      return this.isView
    },
  },
  mounted() {
    this.currentTab = 0
  },
  methods: {
    query(type, record) {
      this.currentTab = 0
      this.visible = true
      this.type = type
      this.record = record
      if (this.type === 'add') {
        this.queryonedata = {}
      }
      if (this.type != 'add') {
        focusDetailVo({ trainId: record.id }).then((res) => {
          this.queryonedata = { ...res.data }
        })
      }
    },

    nextStep(data) {
      this.queryonedata = { ...this.queryonedata, ...data }
      if (this.currentTab < 5) {
        this.currentTab = this.currentTab + 1
      }
      if (this.currentTab === 4 && this.type != 'view') {
        this.$emit('finish')
        this.visible = false
      }
      if (this.currentTab === 5 && this.type === 'view') {
        this.$emit('finish')
        this.visible = false
      }
      if (this.currentTab === 4 && this.type === 'view' && this.queryonedata.onlineFlag === 0) {
        this.$emit('finish')
        this.visible = false
      }
    },
    prevStep(e) {
      if (this.currentTab > 0) {
        this.currentTab -= 1
      }
    },
    finish() {
      this.currentTab = 0
    },

    handleCancel() {
      this.currentTab = 0
      this.visible = false
    },
  },
}
</script>

<style lang="less" scoped>
.steps {
  max-width: 750px;
  margin: 16px auto;
}
</style>
