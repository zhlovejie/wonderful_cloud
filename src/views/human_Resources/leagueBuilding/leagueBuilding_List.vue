<template>
  <!--公告管理 -->
  <div class="adjust-apply-list-wrapper">
    <div class="search-wrapper">
      <a-select
        placeholder="团建类别"
        v-model="queryParam.leagueType"
        :allowClear="true"
        style="width: 200px; margin-right: 10px"
      >
        <a-select-option :value="1">部门团建</a-select-option>
        <a-select-option :value="2">公司团建</a-select-option>
        <a-select-option :value="3">管理层团建</a-select-option>
      </a-select>
      <a-select
        style="width: 200px; margin-right: 10px"
        v-model="queryParam.departmentId"
        :allowClear="true"
        placeholder="选择部门"
      >
        <!-- <a-select-option :value="undefined">请选择部门</a-select-option> -->
        <a-select-option v-for="item in departmentList" :key="item.id" :value="item.id">{{
          item.departmentName
        }}</a-select-option>
      </a-select>

      <a-select
        placeholder="状态"
        v-if="activeKey === 0"
        v-model="queryParam.status"
        :allowClear="true"
        style="width: 200px; margin-right: 10px"
      >
        <a-select-option :value="1">待审批</a-select-option>
        <a-select-option :value="2">审批通过</a-select-option>
        <a-select-option :value="3">审批不通过</a-select-option>
        <a-select-option :value="4">已撤回</a-select-option>
        <a-select-option :value="5">已完结</a-select-option>
      </a-select>
      <a-button
        class="a-button"
        type="primary"
        style="position: relative; top: -1px"
        icon="search"
        @click="searchAction"
        >查询</a-button
      >

      <a-dropdown style="float: right" v-if="$auth('leagueBuilding:add')">
        <a-button type="primary" @click="doAction('add', null)"> <a-icon type="plus" />新增 </a-button>
      </a-dropdown>
      <div style="float: right"></div>
    </div>
    <div class="main-wrapper">
      <a-tabs :activeKey="String(activeKey)" defaultActiveKey="0" @change="tabChange">
        <a-tab-pane tab="全部" key="0" />
        <template v-if="$auth('leagueBuilding:jurisdiction')">
          <a-tab-pane tab="待审批" key="1" />
          <a-tab-pane tab="已审批" key="2" />
        </template>
      </a-tabs>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        v-if="$auth('leagueBuilding:list')"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="leagueType" slot-scope="text">
          <span>{{ getleagueTypeText(text) }}</span>
        </div>
        <div slot="status" slot-scope="text, record">
          <a @click="approvalPreview(record)">{{ getStateText(text) }}</a>
        </div>
        <div slot="operationStatus" slot-scope="text">
          <a href="javascript:void(0)">{{ getOperationStatus(text) }}</a>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <!-- 公告审批状态：0 待审批，1 审批通过，2 审批驳回 -->
          <template v-if="activeKey === 0">
            <template v-if="record.status === 5">
              <a type="primary" @click="doAction('view5', record)">查看</a>
            </template>
            <template v-else>
              <a type="primary" @click="doAction('view', record)">查看</a>
            </template>
            <template v-if="$auth('leagueBuilding:add') && record.status === 1 && +record.createdId === +userInfo.id">
              <a-divider type="vertical" />
              <a-popconfirm title="是否确定撤回" ok-text="确定" cancel-text="取消" @confirm="confirmWithdraw(record)">
                <a type="primary">撤回</a>
              </a-popconfirm>
            </template>
            <template v-if="$auth('leagueBuilding:add') && record.status === 2 && +record.createdId === +userInfo.id">
              <a-divider type="vertical" />
              <a type="primary" @click="uploadImg(record)">上传</a>
            </template>
            <template
              v-if="
                ($auth('leagueBuilding:add') && record.status === 3) ||
                (record.status === 4 && +record.createdId === +userInfo.id)
              "
            >
              <a-divider type="vertical" />
              <a type="primary" @click="doAction('edit-salary', record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否确定删除" ok-text="确定" cancel-text="取消" @confirm="confirmDelete(record)">
                <a type="primary">删除</a>
              </a-popconfirm>
            </template>
          </template>

          <template v-if="activeKey === 1 && record.status === 1">
            <a type="primary" @click="doAction('edit', record)">审核</a>
          </template>

          <template v-if="activeKey === 2">
            <a type="primary" @click="doAction('view', record)">查看</a>
          </template>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction()" />
    <ApproveInfo ref="approveInfoCard" />
    <UploadImgs ref="uploadImgs" @finish="searchAction()" />
  </div>
</template>
<script>
import { getDevisionList } from '../../../api/systemSetting'
import { leagueBuilding_List, leagueBuilding_Apply, leagueBuildingRemove } from '@/api/humanResources'
import AddForm from './module/FormAdd'
import UploadImgs from './module/uploadImgs'
import ApproveInfo from '@/components/CustomerList/ApproveInfo'
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
    title: '团建类别',
    dataIndex: 'leagueType',
    key: 'leagueType',
    scopedSlots: { customRender: 'leagueType' },
  },
  {
    align: 'center',
    title: '部门',
    dataIndex: 'departmentNames',
    key: 'departmentNames',
  },
  {
    align: 'center',
    title: '开始时间',
    dataIndex: 'beginTime',
    key: 'beginTime',
  },
  {
    align: 'center',
    title: '结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
  },
  {
    align: 'center',
    title: '时长',
    dataIndex: 'timeSpace',
    key: 'timeSpacer ',
  },
  {
    align: 'center',
    title: '地点',
    dataIndex: 'address',
    key: 'address',
  },
  {
    align: 'center',
    title: '团建费用',
    dataIndex: 'expense',
    key: 'expense',
  },
  {
    align: 'center',
    title: '审核状态',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    align: 'center',
    title: '提交人',
    key: 'createdUserName',
    dataIndex: 'createdUserName',
  },
  {
    align: 'center',
    title: '提交人日期',
    dataIndex: 'createdTime',
    key: 'createdTime',
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'NoticeList',
  components: {
    AddForm: AddForm,
    ApproveInfo: ApproveInfo,
    UploadImgs: UploadImgs,
  },
  data() {
    return {
      queryParam: {},
      activeKey: 0,
      departmentList: [],
      operation_status: undefined,
      person_name: undefined,
      approval_status: undefined,
      depSelectDataSource: [],
      columns: columns,
      dataSource: [],
      userInfo: this.$store.getters.userInfo, // 当前登录人
      pagination: {
        current: 1,
      },
      loading: false,
      whole: true,
    }
  },
  computed: {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'human_Resources_leagueBuilding') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      let that = this
      this.searchAction()
      this.department()
    },

    // 删除
    confirmDelete(record) {
      let that = this
      leagueBuildingRemove(`id=${record.id}`).then((res) => {
        if (res.code === 200) {
          this.searchAction()
          that.$message.info(res.msg)
        } else {
          _this.$message.error(res.msg)
        }
      })
    },

    department() {
      getDevisionList().then((res) => {
        this.departmentList = res.data
      })
    },
    getleagueTypeText(state) {
      let stateMap = {
        1: '部门团建',
        2: '公司团建',
        3: '管理层团建',
      }
      return stateMap[state] || `未知状态:${state}`
    },
    getStateText(state) {
      let stateMap = {
        1: '待审批',
        2: '审核通过',
        3: '审核未通过',
        4: '已撤回',
        5: '已完结',
      }
      return stateMap[state] || `未知状态:${state}`
    },
    //审批流组件
    approvalPreview(record) {
      this.$refs.approveInfoCard.init(record.instanceId)
    },
    uploadImg(record) {
      let that = this
      that.$refs.uploadImgs.query(record.id)
    },
    // 发布
    confirmRelease(record) {
      let that = this
      NoticeRelease({ id: record.id }).then((res) => {
        if (res.code === 200) {
          this.searchAction()
          that.$message.info(res.msg)
        } else {
          _this.$message.error(res.msg)
        }
      })
    },
    // 撤回
    confirmWithdraw(record) {
      let that = this
      leagueBuilding_Apply(`id=${record.id}`).then((res) => {
        this.searchAction()
        that.$message.info(res.msg)
      })
    },
    searchAction(opt) {
      let that = this
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination }, opt || {}, {
        searchStatus: that.activeKey,
      })
      that.loading = true
      leagueBuilding_List(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          // pagination.total = res.data.total
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction()
    },

    doAction(type, record) {
      this.$refs.addForm.query(type, record)
      //this.$message.info('功能尚未实现...')
    },
    tabChange(tagKey) {
      this.activeKey = parseInt(tagKey)
      if (this.activeKey !== 0) {
        this.approval_status = undefined
      }
      //this.$message.info('全部，待审批，审批尚未实现')
      this.searchAction({ current: 1, searchStatus: this.activeKey })
    },
  },
}
</script>
<style scoped>
.adjust-apply-list-wrapper {
  background-color: #fff;
  padding: 10px 20px;
}

.main-wrapper {
  margin-top: 20px;
}
</style>
