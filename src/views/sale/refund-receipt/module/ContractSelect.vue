<template>
  <a-modal title="选择合同" :width="800" v-model="visible" :maskClosable="false" @cancel="handleCancel" :footer="null">
    <div class="search-wrapper">
      <a-input
        placeholder="合同编号"
        :allowClear="true"
        v-model="searchParam.contractNum"
        style="width: 200px; margin-right: 20px; margin-bottom: 20px"
      />
      <a-input
        placeholder="客户名称"
        :allowClear="true"
        v-model="searchParam.customerName"
        style="width: 200px; margin-right: 20px; margin-bottom: 20px"
      />
      <a-button class="a-button" type="primary" icon="search" @click="searchAction">查询</a-button>
    </div>
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <div slot="order" slot-scope="text, record, index">
        <span>{{ index + 1 }}</span>
      </div>
      <div slot="contractNum" slot-scope="text, record">
        <a href="javascript:void(0);" @click="selected(record)">{{ text }}</a>
      </div>
    </a-table>
  </a-modal>
</template>

<script>
import { refundGetApprovedSaleContract } from '@/api/receipt'
let columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' },
  },
  {
    title: '合同编号',
    dataIndex: 'contractNum',
    scopedSlots: { customRender: 'contractNum' },
  },
  {
    title: '客户名称',
    dataIndex: 'customerName',
  },
]
export default {
  name: 'ContractSelect',
  data() {
    return {
      visible: false,
      loading: true,
      searchParam: {},
      pagination1: { current: 1 },
      pagination: {
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'], //每页中显示的数据
        showTotal: (total) => `共${total} 条数据`, //分页中显示总的数据
        onShowSizeChange: (current, pageSize) => ((this.pagination1.size = pageSize), this.searchAction()),
      },
      columns: columns,
      dataSource: [],
    }
  },
  methods: {
    searchAction(opt = {}) {
      let that = this
      let _searchParam = Object.assign({}, { ...that.searchParam }, { ...that.pagination1 }, opt || {}, {
        searchStatus: that.activeKey,
      })
      console.log('执行搜索...', _searchParam)
      that.loading = true
      refundGetApprovedSaleContract(_searchParam)
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
    query(record) {
      this.visible = true
      this.searchAction()
    },
    handleCancel() {
      this.visible = false
    },
    selected(record) {
      this.$emit('onSelect', record)
      this.handleCancel()
    },
    // 分页
    handleTableChange(pagination, filters, sorter) {
      this.pagination1.size = pagination.pageSize
      this.pagination1.current = pagination.current
      this.searchAction()
    },
  },
}
</script>
