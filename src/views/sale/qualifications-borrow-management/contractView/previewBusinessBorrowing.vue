<template>
  <!-- 经营借用协议 预览 -->
  <a-spin :spinning="spinning">
    <div>
      <div class="contract-wrap">
        <div class="contract-header">
          <div class="log-wrap">
            <img src="@/assets/icon_contract.jpg" style="width: 48px; height: 56px" alt="合同图标" />
          </div>
          <div class="top-right-page">
            <div class="top-right-item">{{ enterpriseName }}</div>
            <div class="top-right-item">{{ enterpriseNameEnglish }}</div>
          </div>
        </div>
        <div class="contract-main">
          <h2 style="text-align: center">{{ contractTitle }}</h2>
          <div class="main-top" style="padding: 10pt 0">
            <div class="contract-title-part">
              <div>
                <span>供方(甲方)：</span>
                <span> {{ supplier }}</span>
              </div>
              <div>
                <span>需方(乙方)：</span>
                <span>
                  <span class="span-underline"> {{ detail.customerName }} </span></span
                >
              </div>
            </div>
            <div class="contract-title-num">
              <div class="title-num-item">
                <span>合同编号 :</span>
                <span>{{ detail.contractNum }}</span>
              </div>
              <div class="title-num-item">
                <span>签订时间 :</span>
                <span :style="{ color: detail.signingDate !== moment().format('YYYY-MM-DD') ? 'red' : '' }">{{
                  detail.signingDate
                }}</span>
              </div>
            </div>
          </div>
          <div class="main-content-wrap">
            <div class="content-p">
              甲、乙双方本着公平公正、互惠互利的原则，在平等自愿、公平公正的基础上，协商一致，达成如下协议，双方共同遵守。
            </div>

            <div class="content-p">第一条：</div>
            <div class="content-p p-text-index">
              乙方因经营所需借用甲方资质，以甲方的名义进行项目经营，最终用户单位全称为：<span class="span-underline">{{
                detail.fullName
              }}</span>
              。乙方承诺在此项目经营过程中，甲方代替乙方与最终签订的所有与本项目相关的合同、
              协议均为乙方的意愿，属于乙方独立经营行为与甲方无关；且项目经营过程中所产生的一
              切法律后果以及违约责任均由乙方承担。乙方承诺在借用甲方资质以甲方的名义进行产品销
              售或项目经营过程中，遵守中华人民共和国法律法规，无违规违法行为。
            </div>
            <div class="content-p">第二条：</div>
            <div class="content-p p-text-index">
              此协议一经签订，乙方应向甲方交纳<span class="span-underline">{{ detail.earnestMoney }}</span>
              万元信誉保证金，保证乙方在此项目经营过程中不损害甲方的信誉。若此项目无法正常进行，
              保证金在三个工作日内无息退还。若项目正常进行，此保证金将作为乙方支付甲方的货款使用。
              若项目经营过程中发现乙方损害甲方的信誉等情形，此保证金不予以退还。
            </div>
            <div class="content-p">第三条：</div>
            <div class="content-p p-text-index">乙方不得透漏双方合作的机密，不得对甲方的形象和利益带来损害。</div>
            <div class="content-p">第四条：</div>
            <div class="content-p p-text-index">
              协议未尽事宜另行协商确定。若发生合同纠纷应协商解决，协商不成，可依法向甲方辖区内人民法院起诉。
            </div>
            <div class="content-p">第五条：</div>
            <div class="content-p p-text-index">
              乙方在本项目经营过程中与任何第三方所产生的一切债权债务关系与甲方无关
            </div>

            <div class="content-p">第六条：</div>
            <div class="content-p p-text-index">
              在项目交付过程中如发生安全伤亡事故，均由乙方独立承担一切责任和全部后果。甲方特提出免责声明。
            </div>

            <div class="content-p">第七条：</div>
            <div class="content-p p-text-index">本合同签字盖章后生效，一式两份，甲、乙双方各执一份。</div>

            <div class="card-wrap" style="overflow: hidden">
              <div class="card">
                <p class="card-tit">甲方</p>
                <p style="position: relative">
                  甲方（盖章）：
                  <img
                    v-if="detail.setCommonSeal"
                    style="position: absolute; width: 140px; left: 35%; top: -50%"
                    :src="detail.setCommonSeal"
                    alt="公章"
                  />
                </p>
                <p>
                  代理人：
                  <img
                    v-if="detail.saleUserSeal"
                    style="height: 50px; width: auto; vertical-align: middle"
                    :src="detail.saleUserSeal"
                    alt="销售人员章"
                  />
                </p>
                <p>
                  日期<span class="span-paddings">{{ detail.signingDate }}</span>
                </p>
              </div>
              <div class="card">
                <p class="card-tit">乙方</p>
                <p>
                  乙方（盖章）：<span class="span-paddings">{{ detail.customerName }}</span>
                </p>
                <p>代理人：</p>
                <p>日期：</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script>
import { businessdetail } from '@/api/agencyContract'
import moment from 'moment'

export default {
  name: 'previewBusinessBorrowing-contractView',
  props: {
    contractId: [Number, String],
  },
  data() {
    return {
      isPassBtn: false, // 通过不通过按钮的是否显示
      opinion: '', // 审批意见
      visible: false, // 审批弹出层是否可见
      loading: false,
      spinning: false,
      dialogTitle: '审批操作',
      enterpriseName: '江苏万德福公共设施科技有限公司',
      enterpriseNameEnglish: 'JiangSu Wonderful Infrastructure Manufacturing co.,Ltd',
      contractTitle: '经营借用协议',
      supplier: '江苏万德福公共设施科技有限公司', // 供方（甲方）
      detail: {},
      placeholder: '***',
      wordUrl: '',
      productCategoryList: [],
    }
  },
  computed: {},
  watch: {
    contractId() {
      this.init()
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    moment,
    async init() {
      let that = this

      if (!that.contractId) {
        that.detail = {}
        //that.$message.info('参数【contractId】缺失。')
        return
      }
      that.spinning = true
      businessdetail({ id: that.contractId })
        .then((res) => {
          that.spinning = false
          that.detail = res.data
        })
        .catch((err) => {
          that.spinning = false
          that.$message.error()
          err.message
        })
    },
  },
}
</script>

<style scoped>
.approval-checkbox-wrapper {
  background-color: #fafad2;
  padding: 10px 30px;
}

.clearfix:after {
  display: block;
  content: '';
  clear: both;
  height: 0;
}
.clearfix {
  zoom: 1;
}
.contract-wrap {
  padding: 20px;
  background-color: #fff;
}
.contract-header {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.log-wrap img {
  width: 56px;
  height: 56px;
}
.top-right-page {
  text-align: right;
}
.contract-header {
  margin-bottom: 16px;
}
.contract-title-part {
  color: #000;
  font-size: 18px;
  line-height: 2;
}
.contract-title-part h2 {
  text-align: center;
  font-size: 26px;
  font-weight: bold;
  color: #000;
}
.main-top {
  position: relative;
  margin-bottom: 20px;
}
.contract-title-num {
  position: absolute;
  right: 8px;
  top: 50%;
  margin-top: -38px;
  padding: 12px 16px;
  border: 1px solid #999;
}
.title-num-item {
  color: #000;
  font-size: 18px;
  line-height: 2;
}
.title-num-item span:first-child {
  margin-right: 12px;
}
.main-content-wrap {
  font-size: 16px;
  color: #000;
}
.content-p {
  line-height: 2;
}
.productTab {
  margin: 6px auto;
}
.span-paddings {
  margin: 0 6px;
}
.p-text-index {
  padding-left: 34px;
}
.span-underline {
  padding: 6px 10px;
  border-bottom: 1px solid #000;
  color: red;
}
.card {
  width: 500px;
  padding: 16px;
  border: 1px solid #999;
  margin: 10px 16px 10px 112px;
}
.card-tit {
  color: #000;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}
.card-wrap {
  display: flex;
  justify-content: space-around;
  margin: 20px auto;
}
.card-wrap .card {
  flex: 40% 0 0;
  margin: 0;
  padding: 20px 0 20px 35px;
  width: auto !important;
}

.card-wrap .card p {
  margin-bottom: 0;
}
.margin-b {
  margin-bottom: 24px;
}

#pdfDom >>> .red-flag {
  color: red !important;
}
</style>
