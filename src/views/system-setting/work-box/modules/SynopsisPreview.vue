<template>
  <a-modal
    :title="modalTitle"
    :width="940"
    :visible="visible"
    @cancel="handleCancel"
    :footer="null"
    :maskClosable="false"
  >
    <a-row>
      <a-col :span="24">
        <a-button style="float:right;" @click="getPDF()" type="primary">导出成PDF</a-button>
      </a-col>
    </a-row>
    <div class="table-page-search-wrapper" id="pdfDom">
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="标题">
              {{ enterpriseSynopsis.itemName }}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="内容">
              <div v-html="formatHTML(enterpriseSynopsis.introduction)" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item label="图片">
              <template v-if="enterpriseSynopsis && enterpriseSynopsis.pictureUrl">
              <img 
                v-for="(url,idx) in enterpriseSynopsis.pictureUrl.split(',')" 
                :key="idx" 
                style="width: 25%;max-width:128px;margin-right:10px;" 
                :src="url" 
                @click="showImg(url)"
              />
              </template>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <ImgView ref="imgView" />
  </a-modal>
</template>

<script>
import util from '@/components/_util/util'
import ImgView from '@/components/CustomerList/ImgView'
export default {
  name: 'SynopsisPreview',
  components:{
    ImgView
  },
  data () {
    return {
      visible: false, // 是否显示
      informationType:1,
      enterpriseSynopsis: {}, // 企业简介信息
      form: this.$form.createForm(this)
    }
  },
  computed: {
    modalTitle() {
      return this.informationType === 1 ? '企业简介' : '产品功能简介'
    }
  },
  methods: {
    show (enterpriseSynopsis) {
      this.visible = true
      this.informationType = enterpriseSynopsis.informationType
      this.enterpriseSynopsis = enterpriseSynopsis
    },
    handleCancel () {
      this.enterpriseSynopsis = {}
      this.form.resetFields() // 清空表
      this.visible = false
    },
    getPDF () {
      util.handleWindowPrint('#pdfDom', this.enterpriseSynopsis.title)
    },
    formatHTML(htmlStr){
      if(typeof htmlStr !== 'string') {
        return ''
      }
      htmlStr = htmlStr.replace(/[\n\r]/g,'<br/>')
      htmlStr = htmlStr.replace(/\s+/g,'&nbsp;')
      return htmlStr
    },
    showImg(url) {
      this.$refs.imgView && this.$refs.imgView.show(url)
    },
  }
}
</script>
<style>
  @media print {
    body {display:none}
    #print {display: block}
  }
</style>
