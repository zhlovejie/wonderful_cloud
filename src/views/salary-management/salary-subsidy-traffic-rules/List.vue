<template>
  <!-- 交通补贴规则 -->
  <div class="wdf-custom-wrapper">
    <div class="search-wrapper">
      <a-button style="float:right;" type="primary" icon="plus" @click="doAction('add',null)"  v-if="dataSource.length === 0 && $auth('salary-subsidy-traffic-rules:add')">新增</a-button>
    </div>
    <div class="main-wrapper">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
      >
        <div slot="order" slot-scope="text, record, index">
          <span>{{ index + 1 }}</span>
        </div>
        <div slot="sendCycle" slot-scope="text, record, index">
          <span>按月</span>
        </div>
        <div class="action-btns" slot="action" slot-scope="text, record">
          <template v-if="$auth('salary-subsidy-traffic-rules:view')">
            <a type="primary"  @click="doAction('view',record)">查看</a>
          </template>
          <template v-if="$auth('salary-subsidy-traffic-rules:edit')">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('edit',record)">修改</a>
          </template>
          <template v-if="$auth('salary-subsidy-traffic-rules:edit-record')">
            <a-divider type="vertical" />
            <a type="primary" @click="doAction('edit-record',record)">修改记录</a>
          </template>
          <template v-if="$auth('salary-subsidy-traffic-rules:del')">
            <a-divider type="vertical"  />
            <a-popconfirm
              title="是否要删除此行？"
              @confirm="doAction('del',record)"
            >
              <a>删除</a>
            </a-popconfirm>
          </template>
        </div>
      </a-table>
    </div>
    <AddForm ref="addForm" @finish="searchAction" />
  </div>
</template>

<script>
import {
  trafficRulePageList,
  trafficRuleDel,
  trafficRuleAddOrUpdate
} from '@/api/salaryManagement'
import AddForm from './AddForm'
const columns = [
  {
    align: 'center',
    title: '序号',
    key: 'order',
    width: '70px',
    scopedSlots: { customRender: 'order' }
  },
  {
    align: 'center',
    title: '名称',
    dataIndex: 'name'
  },
  {
    align: 'center',
    title: '交通补贴(元/月)',
    dataIndex: 'amount'
  },
  {
    align: 'center',
    title: '发放周期',
    scopedSlots: { customRender: 'sendCycle' }
  },
  {
    align: 'center',
    title: '备注',
    dataIndex: 'remark'
  },
  {
    align: 'center',
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name:'salary-subsidy-traffic-rules',
  components:{
    AddForm
  },
  data(){
    return {
      depId:undefined,

      meetingTypesList:[],
      depList:[],
      columns:columns,
      dataSource:[],
      pagination: {
        current: 1,
        size:"10",
        //showSizeChanger: true,
        //showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
        //onShowSizeChange: this.onShowSizeChangeHandler,
      },
      loading:false,
      bindEnterFn: null,
    }
  },
  computed:{
    searchParam(){
      return {
        departmentId:this.depId
      }
    }
  },
  watch:{
    '$route':{
      handler:function(to,from) {
        if(to.name === 'salary-subsidy-traffic-rules'){
          this.init()
        }
      },
      immediate:true
    }
  },
  mounted() {
    let that = this
    let ele = document.querySelector('.wdf-custom-wrapper')
    that.bindEnterFn = (event) => {
      if (event.type === 'keyup' && event.keyCode === 13) {
        //Enter
        that.searchAction()
      }
    }
    if (ele) {
      ele.addEventListener('keyup', that.bindEnterFn)
    }
  },
  beforeDestroy() {
    let that = this
    let ele = document.querySelector('.wdf-custom-wrapper')
    ele && that.bindEnterFn && ele.removeEventListener('keyup', that.bindEnterFn)
  },
  methods:{
    init(){
      let that = this
      this.searchAction()
    },
    searchAction(opt = {}){
      let that = this
      let paginationParam = {
        current:that.pagination.current || 1,
        size:that.pagination.size || 10
      }
      let _searchParam = Object.assign({},{...this.searchParam},paginationParam,opt)
      console.log('执行搜索...',_searchParam)
      that.loading = true
      trafficRulePageList(_searchParam).then(res => {
        that.loading = false
        that.dataSource = res.data.records.map((item,index) =>{
          item.key = index + 1
          return item
        })

        //设置数据总条数
        const pagination = { ...that.pagination }
        pagination.total = res.data.total || 0
        pagination.current = res.data.current || 1
        that.pagination = pagination

        //有两页数据,第二页只有一条数据,删除第二页的一条数据了,界面显示在第一页,但是不显示第一页数据了
        //刷新也不显示数据
        let {current,pages} = res.data
        if(+pages > 0 && +current > +pages){
          that.pagination = {...pagination,current:pages}
          that.searchAction()
        }
      }).catch(err => that.loading = false)
    },
    // 分页
    handleTableChange (pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.searchAction({current:pagination.current})
    },
    onShowSizeChangeHandler(current,pageSize){
      let pagination = {...this.pagination}
      pagination.current = current
      pagination.size = String(pageSize)
      this.pagination = pagination
      this.searchAction()
    },
    doAction(actionType,record){
      let that = this
      if(actionType === 'del'){
        //console.log(record)
        trafficRuleDel({id:record.id}).then(res =>{
          that.$message.info(res.msg)
          that.searchAction()
        })
        return
      }
      this.$refs.addForm.query(actionType,record)
    }
  }
}
</script>

<style scoped>
  .wdf-custom-wrapper {
    background-color: #fff;
    padding: 10px 20px;
  }
  .wdf-custom-wrapper .search-wrapper * {
    margin: 10px 15px 0 0;
  }
  .main-wrapper{
    margin-top: 20px;
  }

</style>
