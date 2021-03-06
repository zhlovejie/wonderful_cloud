<template>
  <a-card :bordered="false">
    <a-row>
      <a-col :span="24">
        <a-form layout="inline">
          <a-form-item>
            <a-month-picker placeholder="开始日期" v-model="startTime" @openChange="handleStartOpenChange" />
          </a-form-item>
          <a-form-item>
            <span>~</span>
          </a-form-item>
          <a-form-item>
            <a-month-picker
              style="margin-bottom: 20px"
              placeholder="结束日期"
              v-model="endTime"
              :open="endOpen"
              @openChange="handleEndOpenChange"
            />
          </a-form-item>
          <a-form-item>
            <a-button class="a-button" type="primary" icon="search" @click="actionHandler('search')">查询</a-button>
          </a-form-item>
          <a-form-item>
            <a-button class="a-button" type="primary" icon="download" @click="actionHandler('download')">下载</a-button>
          </a-form-item>
        </a-form>

        <a-table
          :columns="columns"
          :dataSource="tableData"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
          size="small"
          bordered
        >
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="money" slot-scope="text, record">
            <span>{{ record.money | moneyFormatNumber }}</span>
          </div>
        </a-table>
      </a-col>
      <a-col :span="24">
        <div class="chart-wrapper">
          <h3 class="chart-title">销售总计分析</h3>
          <v-chart :forceFit="true" :height="chartHeight" :data="chartData1" :scale="scale1">
            <v-tooltip />
            <v-axis />
            <v-line position="date*总计销售额(万元)" />
            <v-point position="date*总计销售额(万元)" shape="circle" />
          </v-chart>
        </div>
      </a-col>
      <a-col :span="24">
        <div class="chart-wrapper">
          <h3 class="chart-title">部门业绩分析</h3>
          <v-chart :forceFit="true" :height="chartHeight" :data="chartData" :scale="scale" :padding="padding">
            <v-tooltip />

            <v-legend />
            <v-interval position="月份*销售金额" color="name" :adjust="adjust" :opcaity="1" />
            <v-axis :label="labelFormat" :title="title" dataKey="销售金额" />
          </v-chart>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import { pageListDepartmentPerformanceReport, downDepartment } from '@/api/saleReport'
import moment from 'moment'
const DataSet = require('@antv/data-set')

const label = {
  textStyle: {
    fill: '#aaaaaa',
  },
}

const labelFormat = {
  textStyle: {
    fill: '#aaaaaa',
  },
  formatter: function formatter(text) {
    return text.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  },
}

const tickLine = {
  alignWithLabel: false,
  length: 0,
}

const title = {
  offset: 70,
}
export default {
  name: 'DepartmentSalesAnalysis',
  data() {
    return {
      pageTitle: '部门业绩分析',
      columns: [],
      sDate: [undefined, undefined],
      dataSource: [],
      pagination: {
        current: 1,
        _prePageSize: 10,
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      loading: false,
      chartHeight: 600,
      padding: [20, 20, 100, 140],
      label,
      labelFormat,
      tickLine,
      title,
      scale1: [
        {
          dataKey: '总计销售额(万元)',
          min: 0,
        },
        {
          dataKey: 'date',
          min: 0,
          max: 1,
        },
      ],
      scale: [
        {
          dataKey: '销售金额',
          alias: '销售额(RMB)',
        },
      ],
      monthFormat: 'YYYY/MM',
      adjust: [
        {
          type: 'dodge',
          marginRatio: 1 / 32,
        },
      ],
      startTime: undefined,
      endTime: undefined,
      endOpen: false,
    }
  },
  watch: {
    $route: {
      handler: function (to, from) {
        if (to.name === 'DepartmentSalesAnalysis') {
          this.init()
        }
      },
      immediate: true,
    },
  },
  computed: {
    chartData1() {
      return this.dataSource.map((item) => {
        return {
          date: item.date,
          '总计销售额(万元)': item.sumMoney,
        }
      })
    },
    chartData() {
      //参考 https://viserjs.github.io/demo.html#/viser/bar/grouped-column
      let fields = [...new Set(this.dataSource.map((item) => item.date))]
      let _formatChartData = (records) => {
        if (!Array.isArray(records)) {
          return []
        }
        if (records.length === 0) {
          return []
        }
        let keys = Object.keys(records[0]).filter(
          (v) => v !== 'date' && v !== 'key' && v !== 'sumMoney' && v.indexOf('占比%') === -1
        )
        let result = []
        records.map((item) => {
          keys.map((k) => {
            let target = result.find((item) => item.name === k + '(万元)')
            if (target) {
              target[`${item.date}`] = +item[k]
            } else {
              let obj = {}
              obj.name = k + '(万元)'
              obj[`${item.date}`] = +item[k]
              result.push(obj)
            }
          })
        })
        return result
      }
      const dv = new DataSet.View().source(_formatChartData(this.dataSource))
      dv.transform({
        type: 'fold',
        fields: fields,
        key: '月份',
        value: '销售金额',
      })
      return dv.rows
    },
    tableData() {
      let _res = this.dataSource
      if (_res.length > 0) {
        let _columns = [
          {
            title: '序号',
            key: 'order',
            width: '70px',
            align: 'center',
            scopedSlots: { customRender: 'order' },
          },
          {
            title: '月份',
            align: 'center',
            dataIndex: 'date',
          },
          {
            align: 'center',
            title: '总计销售额(万元)',
            dataIndex: 'sumMoney',
          },
        ]

        Object.keys(_res[0]).forEach((v) => {
          if (v !== 'date' && v !== 'key' && v !== 'sumMoney') {
            _columns.push({
              title: v,
              dataIndex: v,
              align: 'center',
              scopedSlots: { customRender: v },
            })
          }
        })
        this.columns = _columns
      } else {
        this.columns = []
      }
      return _res
    },
    searchParam() {
      let startTime = undefined,
        endTime = undefined

      //if(Array.isArray(this.sDate) && this.sDate.length === 2){
      startTime = this.startTime instanceof moment ? this.startTime.format('YYYY-MM') : undefined
      endTime = this.endTime instanceof moment ? this.endTime.format('YYYY-MM') : undefined
      //}
      return {
        current: 1,
        startTime,
        endTime,
      }
    },
  },
  methods: {
    moment: moment,
      componentDidUpdate() {
        setTimeout(() => {
            const e = document.createEvent('Event')
            e.initEvent('resize', true, true)
            window.dispatchEvent(e)
        }, 10);
    },
    init() {
      this.searchAction()
      this.componentDidUpdate()
      
    },
    searchAction(opt) {
      let that = this
      let paginationParam = {
        current: that.pagination.current || 1,
        size: that.pagination.pageSize || 10,
      }
      let _searchParam = Object.assign({}, { ...that.searchParam }, paginationParam, opt || {})
      console.log('执行搜索...', _searchParam)
      that.loading = true
      that.dataSource = []
      pageListDepartmentPerformanceReport(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.records.map((item, index) => {
            item.key = index + 1
            return item
          })
          const pagination = { ...that.pagination }
          pagination.total = res.data.total || 0
          pagination.current = res.data.current || 1
          that.pagination = pagination
        })
        .catch((err) => (that.loading = false))
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      const pager = pagination
      pager.current = pagination.current
      if (+pager.pageSize !== +pager._prePageSize) {
        //pageSize 变化
        pager.current = 1 //重置为第一页
        pager._prePageSize = +pager.pageSize //同步两者的值
      }
      this.pagination = { ...this.pagination, ...pager }
      this.searchAction()
    },
    actionHandler(type) {
      if (type === 'search') {
        this.searchAction({ current: 1 })
      } else if (type === 'download') {
        this.downloadAction()
      }
    },
    downloadAction() {
      let that = this
      downDepartment(this.searchParam)
        .then((res) => {
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
              a.download = `${that.pageTitle}.xls`
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
        .catch((err) => {
          that.$message.info(`请求出错：${err.message}`)
        })
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open
    },
  },
}
</script>

<style scoped>
.chart-wrapper {
  padding: 50px 0 0 0;
}
.chart-wrapper .chart-title {
  text-align: left;
  font-size: 22px;
}
</style>