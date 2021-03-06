<template>
  <div class="software-contract-list-wrapper">
    <div class="search-wrapper">
      <a-input :allowClear="true" class="a-input" style="width: 180px" placeholder="合同编号" v-model="contractNum" />
      <!-- <CustomerSelect
        ref="customerSelect"
        :options="customerSelectOptions"
        @selected="handleCustomerSelected"
        @inputClear="handleCustomerClear"
      /> -->
      <a-input
        :allowClear="true"
        class="a-select"
        style="width: 180px"
        placeholder="客户名称模糊查询"
        v-model="customerName"
      />
      <a-select placeholder="合同状态" v-model="contractStatus" style="width: 150px">
        <a-select-option :value="-1">合同状态</a-select-option>
        <a-select-option :value="0">未启动</a-select-option>
        <a-select-option :value="1">已启动</a-select-option>
        <a-select-option :value="2">已作废</a-select-option>
      </a-select>

      <a-select
        class="a-select"
        placeholder="审批状态"
        v-model="approveStatus"
        style="width: 150px"
        v-show="this.status === 0"
      >
        <a-select-option :value="-1">合同审批状态</a-select-option>
        <a-select-option :value="0">待审批</a-select-option>
        <a-select-option :value="1">通过</a-select-option>
        <a-select-option :value="2">不通过</a-select-option>
      </a-select>

      <template v-if="$auth('softwareContract:list')">
        <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
      </template>
      <template v-if="$auth('softwareContract:add')">
        <a-button style="float: right" type="primary" icon="plus" @click="addContact">新增</a-button>
      </template>
    </div>
    <div class="list-wrap">
      <a-spin :spinning="loading">
        <a-tabs :activeKey="String(status)" defaultActiveKey="0" @change="tabChange">
          <a-tab-pane tab="我的" key="0" />
          <template v-if="$auth('softwareContract:approval')">
            <a-tab-pane tab="待我审批" key="1" />
            <a-tab-pane tab="我已审批" key="2" />
          </template>
        </a-tabs>
        <a-table
          :columns="columns"
          :dataSource="contractListDataSource"
          :pagination="pagination"
          @change="handleTableChange"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <a slot="customerName" slot-scope="text, record" @click="consumerInfoShow(record)">{{ text }}</a>
          <div slot="approvalStatus" slot-scope="text, record">
            <!-- {{ {'-1':'待提交',0:'待审批',1:'通过',2:'不通过',9:'已撤回'} }} -->
            <span v-if="text === -1">待提交</span>
            <a v-else @click="approvalPreview(record)">
              <span v-if="text === 0">待审批</span>
              <span v-else-if="text === 1">通过</span>
              <span v-else-if="text === 2">不通过</span>
              <span v-else-if="text === 9">已撤回</span>
              <span v-else>未知</span>
            </a>
          </div>
          <div slot="contractStatus" slot-scope="text">
            <span v-if="text === 0">未启动</span>
            <span v-if="text === 1">已启动</span>
            <span v-if="text === 2">已作废</span>
          </div>
          <span slot="isDisabled" slot-scope="text, record">
            <template v-if="$auth('softwareContract:edit') && record.createdId === userInfo.id">
              <a-switch
                :defaultChecked="record.contractStatus === 0 || record.contractStatus === 1 ? true : false"
                checkedChildren="启用"
                unCheckedChildren="禁用"
                @change="changeDisabled($event, record)"
              />
            </template>
            <template v-else>
              <span v-if="record.contractStatus === 0 || record.contractStatus === 1">启用</span>
              <span v-else>禁用</span>
            </template>
          </span>
          <div class="action-btns" slot="action" v-if="record.contractStatus !== 2" slot-scope="text, record">
            <!-- 按钮的显示 参考以下要求
              全部一栏：通过状态按钮：查看、修改、申请延迟付款单、附件、短信记录
              待审批状态按钮：查看
              驳回状态按钮：查看、重新提交

              条件搜索：合同编号、客户名称、合同状态（下拉列表）、审批状态（下拉列表）

              待审批一栏：按钮：查看、审批、短信记录
                    条件搜索：合同编号、客户名称、合同状态（下拉列表）

              已审批一栏：按钮：查看、短信记录
                条件搜索：合同编号、客户名称、合同状态（下拉列表）
             -->
            <template>
              <a type="primary" v-if="$auth('softwareContract:one')" @click="SeeAction(record)">查看</a>

              <template v-if="parseInt(status) === 0">
                <a-divider type="vertical" />
                <a-dropdown :trigger="['click']">
                  <a class="ant-dropdown-link" @click="(e) => e.preventDefault()"> 更多 <a-icon type="down" /> </a>
                  <a-menu slot="overlay">
                    <a-menu-item key="0" v-if="$auth('softwareContract:add')">
                      <a type="primary" @click="copySoftContract(record.id)">复制合同</a>
                    </a-menu-item>
                    <a-menu-item key="1" v-if="$auth('softwareContract:edit') && record.approvalStatus === 1">
                      <a type="primary" @click="addDelayedPayment(record)">申请延迟付款单</a>
                    </a-menu-item>
                    <a-menu-item key="2" v-if="$auth('softwareContract:edit') && record.approvalStatus === 1">
                      <a type="primary" @click="uploadPhoto(record)">上传附件</a>
                    </a-menu-item>
                    <a-menu-item key="3" v-if="$auth('softwareContract:one')">
                      <a type="primary" @click="showSms(record)">短信记录</a>
                    </a-menu-item>
                    <a-menu-item
                      key="4"
                      v-if="
                        $auth('softwareContract:edit') &&
                        record.approvalStatus !== 0 &&
                        record.createdId === userInfo.id
                      "
                    >
                      <a type="primary" @click="editAction(record)">修改</a>
                    </a-menu-item>
                    <a-menu-item
                      key="5"
                      v-if="
                        $auth('softwareContract:edit') && (record.approvalStatus === -1 || record.approvalStatus === 9)
                      "
                    >
                      <a type="primary" @click="startProcess(record.id)">提交审批</a>
                    </a-menu-item>
                    <a-menu-item key="6" v-if="$auth('softwareContract:del')">
                      <a type="primary" @click="deleteCurrentContract(record.id)">删除</a>
                    </a-menu-item>
                    <a-menu-item key="7" v-if="record.approvalStatus === 0">
                      <a-popconfirm title="确认撤回该条数据吗?" @confirm="() => doAction('reback', record)">
                        <a type="primary" href="javascript:;">撤回</a>
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </template>

              <template v-if="$auth('softwareContract:approval') && parseInt(status) === 1">
                <a-divider type="vertical" />
                <a type="primary" @click="viewAction('approval', record)">审批</a>
              </template>
              <template v-if="(parseInt(status) === 2 || parseInt(status) === 1) && $auth('softwareContract:one')">
                <a-divider type="vertical" />
                <a type="primary" @click="showSms(record)">短信记录</a>
              </template>
            </template>
          </div>
        </a-table>
      </a-spin>
    </div>
    <CustomerInfo ref="customerInfoCard" />
    <ApproveInfo ref="approveInfoCard" />
    <CustomerSms ref="customerSmsCard" />
    <UploadPhoto ref="uploadPhoto" @ok="handleSaveOk" />
  </div>
</template>
<script>
import {
  getSoftwareContractList,
  deleteSoftwareContract,
  updateSoftwareContract,
  startProcess,
  copySoftContract,
  revocationSoftwareContract,
} from '@/api/contractListManagement'
import CustomerSelect from '@/components/CustomerList/CustomerSelect'
import CustomerInfo from '@/components/CustomerList/CustomerInfo'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
import CustomerSms from '@/components/CustomerList/CustomerSms'
import UploadPhoto from './UploadPhoto'

const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    align: 'center',
    title: '合同编号',
    dataIndex: 'contractNum',
    key: 'contractNum',
  },
  {
    align: 'center',
    title: '客户名称',
    dataIndex: 'saleCustomerName',
    key: 'saleCustomerName',
    scopedSlots: { customRender: 'customerName' },
  },
  {
    align: 'center',
    title: '对应销售',
    key: 'saleUserTrueName',
    dataIndex: 'saleUserTrueName',
    scopedSlots: { customRender: 'saleUserTrueName' },
  },
  {
    align: 'center',
    title: '审批状态',
    dataIndex: 'approvalStatus',
    key: 'approvalStatus',
    scopedSlots: { customRender: 'approvalStatus' },
  },
  {
    align: 'center',
    title: '合同状态',
    key: 'contractStatus',
    dataIndex: 'contractStatus',
    scopedSlots: { customRender: 'contractStatus' },
  },
  {
    align: 'center',
    width: '100px',
    title: '使用状态',
    key: 'isDisabled',
    dataIndex: 'isDisabled',
    scopedSlots: { customRender: 'isDisabled' },
  },
  {
    align: 'center',
    title: '创建人',
    key: 'createdName',
    dataIndex: 'createdName',
  },
  {
    align: 'center',
    title: '创建时间',
    key: 'createdTime',
    dataIndex: 'createdTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'softwareContractList',
  components: {
    CustomerSelect,
    CustomerInfo,
    ApproveInfo,
    CustomerSms,
    UploadPhoto,
  },
  data() {
    return {
      userInfo: this.$store.getters.userInfo,
      contractNum: '', //合同编号
      customerId: '', //客户名称编号
      customerName: undefined,
      contractStatus: -1, //合同状态 0 未启动  1已启动 2已作废
      status: 0, //审批状态 0全部 1待审批 2已审批
      approveStatus: -1, //审批状态 -1 全部，0待审批，1通过， 2不通过
      customerSelectOptions: {
        showInputLabel: false,
        wrapperStyle: {
          width: '260px',
          display: 'inline-block',
          position: 'relative',
          top: '0',
        },
        formLayout: 'horizontal',
        formItemLayout: {
          labelCol: { span: '' },
          wrapperCol: { span: '' },
        },
        inputRequired: false,
        inputAllowClear: true,
      },
      columns: columns,
      contractListDataSource: [],
      pagination1: { current: 1 },
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      loading: false,
      current: 1,
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'softwareContractList') {
          this.searchAction()
        }
      },
      immediate: true,
    },
  },
  computed: {
    searchParam() {
      //组合搜索参数
      return {
        contractNum: this.contractNum,
        customerName: this.customerName,
        customerId: this.customerId,
        contractStatus: this.contractStatus,
        status: this.status,
        approveStatus: this.approveStatus,
      }
    },
  },
  methods: {
    //复制合同
    copySoftContract(id) {
      let that = this
      that.loading = true
      copySoftContract(id)
        .then((res) => {
          that.loading = false
          if (res.code === 200) {
            this.$message.success('复制合同成功')
            this.searchAction({ current: 1 })
          } else {
            this.$message.error('复制合同失败')
          }
        })
        .catch((err) => {
          that.loading = false
        })
    },
    //提交审批（启动软件审批流程）
    startProcess(id) {
      let that = this
      that.loading = true
      startProcess(id)
        .then((res) => {
          that.loading = false
          if (res.code === 200) {
            this.$message.success('提交审批成功')
            this.searchAction({ current: 1 })
          } else {
            this.$message.error('提交审批失败')
          }
        })
        .catch((err) => {
          that.loading = false
        })
    },
    deleteCurrentContract(id) {
      const _this = this
      const param = { contractId: id }
      //console.log(_this)
      //return

      this.$confirm({
        title: '提示',
        content: `确认删除合同？`,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          // 在这里调用删除接口
          deleteSoftwareContract(param)
            .then((res) => {
              if (res.code === 200) {
                _this.$message.success('删除成功')
                //console.log(_this)
                //_this.$refs.table.refresh(true)
                _this.searchAction()
              } else {
                _this.$message.error(res.msg)
              }
            })
            .catch((err) => {})
        },
      })
    },
    searchAction(opt = {}) {
      this.loading = true
      let _searchParam = Object.assign({}, { ...this.searchParam }, { ...this.pagination1 }, opt)
      getSoftwareContractList(_searchParam)
        .then((res) => {
          const pagination = { ...this.pagination }
          pagination.total = res.data.total || 0
          this.loading = false
          this.contractListDataSource = res.data.records.map((item, index) => {
            item.key = `${item.id}${index}`
            return item
          })
          this.pagination = pagination
        })
        .catch((error) => {
          this.loading = false
          console.error(error)
        })
    },
    handleCustomerSelected(item) {
      this.customerId = item.id
    },
    handleCustomerClear() {
      this.customerId = ''
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      this.searchAction()
    },
    tabChange(tagKey) {
      this.status = parseInt(tagKey)
      this.searchAction({ current: 1 })
    },
    addContact() {
      this.$router.push({
        name: 'softwareContractModel',
        params: { id: null, action: 'add', from: 'softwareContractList' },
      })
    },
    consumerInfoShow(record) {
      this.$refs.customerInfoCard.init(record.id)
    },
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    changeDisabled(text, record) {
      console.log(text)
      let arr = text === true ? 1 : 2
      let params = {
        id: record.id,
        contractModifyFlag: 0,
        contractStatus: arr,
      }
      let that = this
      that.loading = true
      updateSoftwareContract(params)
        .then((res) => {
          if (res.code === 200) {
            that.loading = false
            this.$message.success('修改成功')

            that.$nextTick(() => that.searchAction({ current: that.pagination.current || 1 }))
            // let dataSource = this.contractListDataSource.map(item =>Object.assign({},item))
            // let target = dataSource.find(item => item.key === record.key)
            // if(target){
            //   target.contractStatus = 2
            //   this.contractListDataSource = dataSource
            // }
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(function (err) {
          that.loading = false
          console.log(err)
        })
    },
    viewAction(action, record) {
      this.$router.push({
        name: 'previewSoftwareContract',
        params: { id: record.id, action: action, from: 'softwareContractList' },
      })
    },
    //查看
    SeeAction(record) {
      this.$router.push({
        name: 'softwareContractModel',
        params: { id: record.id, idx: record, action: 'see', from: 'softwareContractList' },
      })
    },
    editAction(record) {
      this.$router.push({
        name: 'softwareContractModel',
        params: { id: record.id, action: 'edit', from: 'softwareContractList' },
      })
    },
    addDelayedPayment(record) {
      // 跳转到申请延迟付款单界面
      this.$router.push({
        name: 'addSoftDelayedPayment',
        params: { id: record.id, contractType: '2', from: 'softwareContractList' },
      })
    },
    showSms(record) {
      this.$refs.customerSmsCard.init(record)
    },
    uploadPhoto(record) {
      this.$refs.uploadPhoto.showForm(record)
    },
    handleSaveOk() {
      this.searchAction()
    },
    doAction(type, record) {
      let that = this
      if (type === 'reback') {
        revocationSoftwareContract({ id: record.id }).then((res) => {
          that.$message.info(res.msg)
          that.searchAction()
        })
        return
      }
    },
  },
}
</script>
<style scoped>
.software-contract-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}
.software-contract-list-wrapper .search-wrapper * {
  margin: 10px 15px 0 0;
}
</style>
