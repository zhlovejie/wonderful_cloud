<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" style="margin-bottom: 20px">
      <div style="height: 40px; width: 100%">
        <template v-if="this.dataSource.length === 0">
          <a-button style="float: right" type="primary" icon="plus" @click="handle('add', null)">新增</a-button>
        </template>
      </div>
    </div>
    <a-layout>
      <!--  此处编写表单中的功能按钮    -->
      <a-layout-content>
        <a-table :columns="columns" :data-source="this.dataSource" :pagination="false">
          <div slot="order" slot-scope="text, record, index">
            <span>{{ index + 1 }}</span>
          </div>

          <div
            :style="{
              maxWidth: '300px',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              wordWrap: 'break-word',
              wordBreak: 'break-all',
            }"
            slot="remark"
            slot-scope="text, record"
          >
            {{ record.remark }}
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
import { queryCode, DictionaryDelete } from '@/api/workBox'
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
      recordResult: {},
      queryRecord: {},
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
          title: '阀值(度/天)',
          key: 'text',
          dataIndex: 'text',
        },
        {
          align: 'center',
          title: '备注',
          key: 'remarks',
          dataIndex: 'remarks',
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
        if (to.name === 'human_Resources_electricityCharges') {
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
      queryCode({ code: 'electric_early_warn' })
        .then((res) => {
          that.loading = false
          that.dataSource = res.data
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
      DictionaryDelete({ id: record.id }).then((res) => {
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
