<template>
  <!-- 门闸信息列表 -->
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 20px">
      <a-button-group style="margin-right: 10px">
        <a-button type="primary" :class="{ currentDayWeekMonth: +queryParam.statusTime === 1 }" @click="simpleSearch(1)"
          >今天</a-button
        >
        <a-button type="primary" :class="{ currentDayWeekMonth: +queryParam.statusTime === 2 }" @click="simpleSearch(2)"
          >全部</a-button
        >
      </a-button-group>
      <a-date-picker v-if="queryParam.statusTime === 2" style="width: 200px; margin-right: 10px" v-model="date1" />
      <a-input
        class="main-items"
        style="width: 200px; margin-right: 10px"
        placeholder="姓名"
        allowClear
        v-model="queryParam.name"
      />
      <!-- <a-select
        placeholder="方向"
        v-model="queryParam.direction"
        :allowClear="true"
        style="width: 100px; margin-right: 10px"
      >
        <a-select-option :value="1">进</a-select-option>
        <a-select-option :value="2">出</a-select-option>
      </a-select> -->
      <a-range-picker
        v-if="queryParam.statusTime === 2"
        v-model="sDate"
        format="YYYY-MM-DD"
        :placeholder="['开始日期', '结束日期']"
        @change="rangePickerChange"
      />
      <a-button style="margin-left: 10px" type="primary" @click="searchAction({ current: 1 })">查询</a-button>
      <template v-if="$auth('GateInformation:download')">
        <a-button style="margin-left: 10px" type="primary" @click="downloadAction">下载</a-button>
      </template>
    </div>
    <a-layout>
      <!--  此处编写表单中的功能按钮    -->
      <a-layout-content>
        <a-table
          :columns="columns"
          :data-source="this.dataSource"
          :pagination="pagination"
          @change="handleTableChange"
          v-if="$auth('GateInformation:list')"
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
        </a-table>
      </a-layout-content>
    </a-layout>
    <!-- <AddForm ref="addForm" @finish="init()" /> -->
  </a-card>
</template>

<script>
import { personnelRecords, personnelexportExcel } from '@/api/accessControl'

export default {
  name: 'RoleManagement',
  components: {
    // AddForm,
  },
  data() {
    return {
      sDate: [undefined, undefined],
      openKeys: ['id'],
      date1: undefined,
      parentId: 0,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      hiddenBoolean: false,
      stationId: undefined,
      queryParam: { current: 1 },
      searchParam: {
        isToday: 1,
      },
      recordResult: {},
      queryRecord: {},
      pagination1: {},
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      // 表头
      columns: [
        {
          align: 'center',
          title: '序号',
          key: 'order',
          width: '70px',
          scopedSlots: { customRender: 'order' },
        },
        {
          align: 'center',
          title: '日期',
          key: 'date',
          dataIndex: 'date',
        },
        {
          align: 'center',
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          align: 'center',
          title: '部门',
          dataIndex: 'departmentName',
          key: 'departmentName',
        },
        {
          align: 'center',
          title: '岗位',
          dataIndex: 'stationName',
          key: 'stationName',
        },
        {
          align: 'center',
          title: '时间',
          dataIndex: 'createdTime',
          key: 'createdTime',
        },
        {
          align: 'center',
          title: '门闸设备名称',
          dataIndex: 'gateName',
          key: 'gateName',
        },
      ],
      //列表数据
      dataSource: [],
    }
  },
  // 初始化搜索条件钩子函数
  created() {},
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'access_office_information') {
          this.queryParam.statusTime = 1
          this.init()
        }
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      this.searchAction()
    },
    rangePickerChange(arrMoment, arrStrs) {
      if (Array.isArray(arrMoment)) {
        if (arrMoment.length === 2) {
          this.queryParam.startDate = arrMoment[0].format('YYYY-MM-DD')
          this.queryParam.endDate = arrMoment[1].format('YYYY-MM-DD')
        } else {
          this.queryParam.startDate = undefined
          this.queryParam.endDate = undefined
        }
      }
    },
    downloadAction() {
      let that = this
      that.spinning = true
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination1 })
      personnelexportExcel(_searchParam)
        .then((res) => {
          that.spinning = false
          console.log(res)
          if (res instanceof Blob) {
            const isFile = res.type === 'application/vnd.ms-excel'
            const isJson = res.type === 'application/json'
            if (isFile) {
              //返回文件 则下载
              const objectUrl = URL.createObjectURL(res)
              const a = document.createElement('a')
              document.body.appendChild(a)
              a.style = 'display: none'
              a.href = objectUrl
              a.download = `门阀信息.xls`
              a.click()
              document.body.removeChild(a)
              that.$message.info('下载成功')
              return
            } else if (isJson) {
              //返回json处理
              var reader = new FileReader()
              reader.onload = function (e) {
                let _res = null
                try {
                  _res = JSON.parse(e.target.result)
                } catch (err) {
                  _res = null
                }
                if (_res !== null) {
                  if (_res.code !== 0) {
                    that.$message.info(_res.message)
                  } else {
                    that.$message.info('下载成功')
                  }
                } else {
                  that.$message.info('json解析出错 e.target.result：' + e.target.result)
                  return
                }
              }
              reader.readAsText(res)
            } else {
              that.$message.info('不支持的类型:' + res)
            }
          }
        })
        .catch((err) => (that.spinning = true))
    },
    simpleSearch(type) {
      this.queryParam = Object.assign({}, this.queryParam, { statusTime: type })
      this.searchAction()
    },
    // 获取列表
    searchAction() {
      let that = this
      that.loading = true
      if (that.date1) {
        that.queryParam.date = that.date1.format('YYYY-MM-DD')
      } else {
        that.queryParam.date = undefined
      }
      let _searchParam = Object.assign({}, { ...this.queryParam }, { ...this.pagination1 })
      personnelRecords(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          //设置数据总条数
          const pagination = { ...that.pagination }
          pagination.total = res.data.total
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current

      this.searchAction()
    },

    // 清空、重置
    emptyQueryParam() {
      this.queryParam = {}
      this.roleList = {}
    },
  },
}
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}

.fold {
  width: calc(100% - 216px);
  display: inline-block;
}

.operator {
  margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}

.left-tree {
  display: flex;
}

.treewrap {
  margin-right: 24px;
}

.righttab {
  width: 100%;
}
.currentDayWeekMonth {
  opacity: 0.7;
}
</style>
