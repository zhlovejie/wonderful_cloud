<template>
  <a-card :bordered="false">
    <!--搜索模块-->
    <div class="operational-scheme-search-wrapper">
      <a-form layout="inline">
        <a-form-item label="名称">
          <a-input v-model.trim="queryParam.fileName" placeholder="根据名称模糊查询" :allowClear="true" />
        </a-form-item>
        <template v-if="$auth('scheme:list')">
          <a-form-item>
            <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
          </a-form-item>
        </template>

        <div class="action-wrapper" style="float: right">
          <a-form-item>
            <template v-if="$auth('scheme:add')">
              <a-button style="margin-left: 8px" type="primary" icon="plus" @click="$refs.modal.add(1)">新增</a-button>
            </template>
            <template v-if="$auth('scheme:list')">
              <a-button style="margin-left: 8px" type="primary" icon="download" @click="handleBatchDownload"
                >批量下载</a-button
              >
            </template>
          </a-form-item>
        </div>
      </a-form>
    </div>
    <s-table
      ref="table"
      size="default"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="false"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <template v-if="$auth('scheme:one')">
            <a target="_blank" :href="viewFormat(record)">查看</a>
          </template>
          <template v-if="$auth('scheme:one')">
            <a-divider type="vertical" />
            <a target="_blank" :href="record.fileUrl">下载</a>
          </template>
          <template v-if="$auth('scheme:edit')">
            <a-divider type="vertical" />
            <a @click="handleEdit(record)">编辑</a>
          </template>
          <template v-if="$auth('scheme:del')">
            <a-divider type="vertical" />
            <a @click="del(record)">删除</a>
          </template>
        </template>
      </span>
    </s-table>
    <Modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getFileManagementList, downloadFile, delFileManagement } from '@/api/OperationalScheme'

import Modal from './modules/SchemeModal'

export default {
  name: 'OperationalScheme',
  components: {
    // 组件
    STable,
    Modal,
  },
  data() {
    return {
      url: 'https://view.officeapps.live.com/op/view.aspx?src=',
      selectedRowKeys: [],
      selectedRows: [],
      // 查询参数
      queryParam: { type: 1 },
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' },
        },
        {
          title: '名称',
          dataIndex: 'fileName',
        },
        {
          title: '操作人',
          dataIndex: 'modifierName',
        },
        {
          title: '操作时间',
          dataIndex: 'modifierTime',
          // sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '200px',
          scopedSlots: { customRender: 'action' },
        },
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        return getFileManagementList(Object.assign(parameter, this.queryParam))
          .then((res) => {
            return res
          })
          .catch(function (err) {
            console.log(err)
          })
      },
    }
  },
  methods: {
    handleEdit(record) {
      // 修改
      this.$refs.modal.edit(record)
    },
    handleOk() {
      this.$refs.table.refresh()
    },
    handleSaveOk() {
      this.$refs.table.refresh(true)
    },
    handleSaveClose() {},
    // 删除
    del(record) {
      const _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除 ${record.fileName} 吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          // 在这里调用删除接口
          delFileManagement({ id: record.id })
            .then((data) => {
              if (data.code == 200) {
                _this.$message.success('删除成功')
                _this.$refs.table.refresh(true)
              } else {
                _this.$message.error(data.msg)
              }
            })
            .catch(() => {
              // Do something
            })
        },
        onCancel() {
          console.log('Cancel')
        },
      })
    },

    handleBatchDownload() {
      const data = [] // 需要下载打包的路径, 可以是本地相对路径, 也可以是跨域的全路径
      const selectedRows = this.selectedRows
      if (selectedRows.length < 1) {
        this.$message.error('请选择下载信息')
        return
      }
      for (let j = 0; j < selectedRows.length; j++) {
        const url = selectedRows[j].fileUrl
        downloadFile(url)
      }
    },

    onSelectChange(selectedRowKeys, selectedRows) {
      console.log('onSelectChange 点击了', selectedRows)
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    viewFormat(record) {
      let url = String(record.fileUrl)
      let pdfUrl = String(record.filePdf)
      let isWord = (url) => ['.doc', '.docx', '.xls', '.xlsx'].some((suffix) => url.endsWith(suffix))
      let isPdf = (url) => url.endsWith('.pdf')
      let isImage = (url) => ['.png', '.jpg', 'jpeg', '.gif', '.bmp'].some((suffix) => url.endsWith(suffix))
      if (url) {
        if (isPdf(url) || isImage(url)) {
          return url
        }
        if (isWord(url)) {
          return isPdf(pdfUrl) ? pdfUrl : `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`
        }
      }
      return '#'
    },
  },
}
</script>

<style scoped>
</style>
