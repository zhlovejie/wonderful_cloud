<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 20px">
      <div style="height: 40px; width: 100%">
        <template v-if="this.dataSource.length == 0">
          <a-button style="float: right" type="primary" icon="plus" @click="handle('add', null)">新增</a-button>
        </template>
      </div>
    </div>
    <a-layout>
      <!--  此处编写表单中的功能按钮    -->
      <a-layout-content>
        <a-table :columns="columns" :data-source="this.dataSource">
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>
          <div slot="lunchTimes" slot-scope="text, record, index">
            <span>1</span>
          </div>
          <span slot="action" slot-scope="text, record">
            <template>
              <a @click="handle('edit-salary', record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否删除" ok-text="是" cancel-text="否" @confirm="deleteRoleInfo(record)">
                <a type="primary">删除</a>
              </a-popconfirm>
            </template>
          </span>
        </a-table>
      </a-layout-content>
    </a-layout>
    <AddForm ref="addForm" @finish="init()" />
  </a-card>
</template>

<script>
import { capital_Meals_List, capital_Meals_delete } from '@/api/bonus_management'
import AddForm from './module/Formadd'

export default {
  name: 'RoleManagement',
  components: {
    AddForm,
  },
  data() {
    return {
      openKeys: ['id'],
      parentId: 0,
      userInfo: this.$store.getters.userInfo, // 当前登录人
      hiddenBoolean: false,
      stationId: undefined,
      queryParam: {},
      recordResult: {},
      queryRecord: {},
      pagination1: { current: 1 },
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
          title: '用餐次数(次)',
          key: 'lunchTimes',
          dataIndex: 'lunchTimes',
          scopedSlots: { customRender: 'lunchTimes' },
        },
        {
          align: 'center',
          title: '扣款(元)',
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          align: 'center',
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
        },
        {
          align: 'center',
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
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
        if (to.name === 'salary_capital_Meals') {
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
    // 获取列表
    searchAction() {
      let that = this
      that.loading = true
      let _searchParam = Object.assign(
        { socialSecurityId: that.recordId },
        { ...this.queryParam },
        { ...this.pagination1 }
      )
      capital_Meals_List(_searchParam)
        .then((res) => {
          that.loading = false
          that.dataSource = res.data.map((item, index) => {
            item.key = index + 1
            return item
          })
        })
        .catch((err) => (that.loading = false))
    },

    // 清空、重置
    emptyQueryParam() {
      this.queryParam = {}
      this.roleList = {}
    },

    handle(type, record) {
      this.$refs.addForm.query(type, record)
    },
    // 删除
    deleteRoleInfo(record) {
      let that = this
      capital_Meals_delete(`id=${record.id}`).then((res) => {
        if (res.code === 200) {
          this.searchAction()
          that.$message.info(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
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
</style>
