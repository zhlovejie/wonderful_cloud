<template>
  <div class="product-info-wrapper">
    <a-form>
      <a-table
        bordered
        :columns="columns"
        :dataSource="data"
        :scroll="{ x: 2000 }"
        :pagination="false"
        :loading="loading"
      >
        <template slot="targetId" slot-scope="text, record">
          <a-form-item :validate-status="validateData[record.key]['targetId'].validateStatus">
            <a-input
              disabled
              read-only="read-only"
              @click="targetIdModel(record)"
              placeholder="选择标的名称"
              :value="record.targetName"
            />
          </a-form-item>
        </template>
        <template slot="productType" slot-scope="text, record">
          <a-select
            disabled
            :value="record.productType"
            placeholder="选择产品类别"
            @change="typeSelectChange(record, $event)"
          >
            <a-select-option value="0">常规产品</a-select-option>
            <a-select-option value="1">非常规产品</a-select-option>
          </a-select>
        </template>
        <template slot="productCode" slot-scope="text, record">
          <a-form-item :validate-status="validateData[record.key]['productId'].validateStatus">
            <a-input
              disabled
              read-only="read-only"
              @click="openModel(record)"
              placeholder="选择产品代码"
              :value="record.productCode"
            />
          </a-form-item>
        </template>

        <template slot="productName" slot-scope="text, record">
          <a-form-item>
            <a-input disabled read-only="read-only" :value="record.productName" />
          </a-form-item>
        </template>

        <!-- <template slot="productPic" slot-scope="text">
          <img style="width:50px;height:auto;" :src="text"/>
        </template> -->
        <template slot="unit" slot-scope="text, record">
          <a-select disabled :value="record.unit" placeholder="选择单位" @change="companySelectChange(record, $event)">
            <a-select-option value="0">套</a-select-option>
            <a-select-option value="1">台</a-select-option>
            <a-select-option value="2">个</a-select-option>
            <a-select-option value="3">块</a-select-option>
            <a-select-option value="4">条</a-select-option>
            <a-select-option value="5">根</a-select-option>
            <a-select-option value="6">张</a-select-option>
            <a-select-option value="7">卷</a-select-option>
          </a-select>
        </template>
        <template slot="count" slot-scope="text, record">
          <a-form-item :validate-status="validateData[record.key]['count'].validateStatus">
            <a-input disabled type="number" :min="0" :value="record.count" @change="countChange(record, $event)" />
          </a-form-item>
        </template>
        <template slot="unitPrice" slot-scope="text, record">
          <a-form-item :validate-status="validateData[record.key]['unitPrice'].validateStatus">
            <a-input-number
              disabled
              :precision="2"
              :min="0"
              :value="record.unitPrice"
              @change="multiplyMoney(record, 'unitPrice', $event)"
            />
          </a-form-item>
        </template>

        <!--新增2列  单价和金额 -->
        <template slot="freightUnitPrice" slot-scope="text, record">
          <a-form-item>
            <a-input-number
              disabled
              :precision="2"
              :min="0"
              :value="record.freightUnitPrice"
              @change="multiplyMoney(record, 'freightUnitPrice', $event)"
            />
          </a-form-item>
        </template>
        <template slot="totalFreightUnitPrice" slot-scope="text, record">
          <span>{{ record.totalFreightUnitPrice | moneyFormatNumber }}</span>
        </template>
        <!--新增2列  单价和金额 END-->

        <template slot="oneMoney" slot-scope="text, record">
          <span>{{ record.oneMoney | moneyFormatNumber }}</span>
        </template>
        <template slot="tax" slot-scope="text, record">
          <span>{{ record.tax }}%</span>
        </template>
        <template slot="taxAmount" slot-scope="text, record">
          <span>{{ record.taxAmount | moneyFormatNumber }}</span>
        </template>
        <template slot="deliveryDate" slot-scope="text, record">
          <a-form-item :validate-status="validateData[record.key]['deliveryDate'].validateStatus">
            <a-date-picker format="YYYY-MM-DD" :value="record.deliveryDate" @change="onChangeDate(record, $event)" />
          </a-form-item>
        </template>
        <!-- <template slot="operation" slot-scope="text, record">
          <span v-if="record.editable && record.isNew">
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template> -->
      </a-table>
    </a-form>
    <!-- <a-button style="width: 100%" type="dashed" icon="plus" @click="newMember">新增行</a-button> -->

    <a-row justify="start" align="middle">
      <a-col class="col-mount" :span="24">
        <slot></slot>
      </a-col>
      <a-col class="col-mount" :span="24">
        <span class="span-mount">合计（人民币）</span>
        <span class="span-mount bigword">{{ chineseTotalAmount }}</span>
        <span class="span-mount">(&nbsp;{{ totalAmount | moneyFormatNumber }}&nbsp;)</span>
        <!-- <span class="span-mount" v-if="isTax">此价格含质保、不含运费。</span> -->
        <span class="span-mount"
          >此价格{{ isTax ? '含税' : '不含税' }}、{{ freightType === 1 ? '含运费' : '不含运费' }}。</span
        >
      </a-col>
    </a-row>
    <template v-if="saleContractLowCPriceAllAmount > 0 && this.data.length > 0">
      <span> 合同低于C价总差额: </span>
      <span style="color: red">{{ saleContractLowCPriceAllAmount }}</span>
    </template>

    <template v-if="ispriceC && this.data.length > 0">
      <a-row type="flex" justify="center" style="margin-top: 20px">
        <a-col class="closep" :span="1"> 特价说明 </a-col>
        <a-col class="col-mount" :span="23">
          <a-textarea disabled type="text" :rows="1" v-model="lowPriceDesc" />
        </a-col>
      </a-row>
    </template>

    <product-model ref="productModel" @custom-change="productChange"></product-model>
    <targetid-model ref="targetidModel" @custom-change="targetidChange"></targetid-model>
  </div>
</template>
<script>
import { turnTheCapital, checkDeletedProduct } from '@/api/contractListManagement'
import moment from 'moment'
import ProductModel from './productModel'
import TargetidModel from './targetidModel'

let productKeyID = 0

export default {
  name: 'ProductCommon',
  components: {
    ProductModel, //选择产品
    TargetidModel, //选择标的
  },
  props: {
    params: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      //columns: columns,
      loading: false,
      data: [], //行信息
      validateData: {}, //验证行信息
      totalAmount: 0,
      chineseTotalAmount: '零',
      isTax: false,
      freightType: 1,
      freight: 0,
      saleContractLowCPriceAllAmount: 0,
      freightDivType: 2,
      ispriceC: false,
      lowPriceDesc: '',
    }
  },
  computed: {
    columns: function () {
      let baseColumns = [
        {
          align: 'center',
          title: '标的名称',
          dataIndex: 'targetId',
          key: 'targetId',
          width: '200px',
          scopedSlots: { customRender: 'targetId' },
        },
        {
          align: 'center',
          title: '产品类别',
          dataIndex: 'productType',
          key: 'productType',
          scopedSlots: { customRender: 'productType' },
          width: '200px',
        },
        {
          align: 'center',
          title: '产品代码',
          dataIndex: 'productCode',
          key: 'productCode',
          width: '200px',
          scopedSlots: { customRender: 'productCode' },
        },
        {
          align: 'center',
          title: '产品名称',
          dataIndex: 'productName',
          key: 'productName',
          width: '200px',
          scopedSlots: { customRender: 'productName' },
        },
        {
          align: 'center',
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
          scopedSlots: { customRender: 'unit' },
          width: '120px',
        },
        {
          align: 'center',
          title: '数量',
          dataIndex: 'count',
          key: 'count',
          scopedSlots: { customRender: 'count' },
          width: '120px',
        },
      ]
      /**不含税，不含运费 */
      let case1 = baseColumns.concat([
        {
          align: 'center',
          title: '单价(元)',
          dataIndex: 'unitPrice',
          key: 'unitPrice',
          scopedSlots: { customRender: 'unitPrice' },
          width: '150px',
        },
        {
          align: 'center',
          title: '金额(元)',
          dataIndex: 'oneMoney',
          key: 'oneMoney',
          width: '200px',
          scopedSlots: { customRender: 'oneMoney' },
        },
      ])
      /**含税，不含运费 */
      let case2 = baseColumns.concat([
        {
          align: 'center',
          title: '含税单价(元)',
          dataIndex: 'unitPrice',
          key: 'unitPrice',
          scopedSlots: { customRender: 'unitPrice' },
          width: '150px',
        },
        {
          align: 'center',
          title: '含税金额(元)',
          dataIndex: 'oneMoney',
          key: 'oneMoney',
          width: '200px',
          scopedSlots: { customRender: 'oneMoney' },
        },
      ])
      /**不含税，含运费，单价 */
      let case3 = baseColumns.concat([
        {
          align: 'center',
          title: '单价(元)',
          dataIndex: 'unitPrice',
          key: 'unitPrice',
          scopedSlots: { customRender: 'unitPrice' },
          width: '150px',
        },
        {
          align: 'center',
          title: '含运费单价(元)',
          dataIndex: 'freightUnitPrice',
          key: 'freightUnitPrice',
          scopedSlots: { customRender: 'freightUnitPrice' },
          width: '200px',
        },
        {
          align: 'center',
          title: '含运费金额(元)',
          dataIndex: 'totalFreightUnitPrice',
          key: 'totalFreightUnitPrice',
          scopedSlots: { customRender: 'totalFreightUnitPrice' },
          width: '200px',
        },
      ])
      /**不含税，含运费，金额 */
      let case4 = baseColumns.concat([
        {
          align: 'center',
          title: '单价(元)',
          dataIndex: 'unitPrice',
          key: 'unitPrice',
          scopedSlots: { customRender: 'unitPrice' },
          width: '150px',
        },

        {
          align: 'center',
          title: '金额(元)',
          dataIndex: 'oneMoney',
          key: 'oneMoney',
          width: '200px',
          scopedSlots: { customRender: 'oneMoney' },
        },
        // {
        //   align: 'center',
        //   title: '含运费金额(元)',
        //   dataIndex: 'totalFreightUnitPrice',
        //   key: 'totalFreightUnitPrice',
        //   scopedSlots: {customRender: 'totalFreightUnitPrice'}
        // }
      ])
      /**含税，含运费，单价 */
      let case5 = baseColumns.concat([
        {
          align: 'center',
          title: '单价(元)',
          dataIndex: 'unitPrice',
          key: 'unitPrice',
          scopedSlots: { customRender: 'unitPrice' },
          width: '150px',
        },
        {
          align: 'center',
          title: '含税含运费单价(元)',
          dataIndex: 'freightUnitPrice',
          key: 'freightUnitPrice',
          scopedSlots: { customRender: 'freightUnitPrice' },
          width: '200px',
        },
        {
          align: 'center',
          title: '含税含运费金额(元)',
          dataIndex: 'totalFreightUnitPrice',
          key: 'totalFreightUnitPrice',
          scopedSlots: { customRender: 'totalFreightUnitPrice' },
          width: '200px',
        },
      ])
      /**含税，含运费，金额 */
      let case6 = baseColumns.concat([
        {
          align: 'center',
          title: '单价(元)',
          dataIndex: 'unitPrice',
          key: 'unitPrice',
          scopedSlots: { customRender: 'unitPrice' },
          width: '150px',
        },
        {
          align: 'center',
          title: '金额(元)',
          dataIndex: 'oneMoney',
          key: 'oneMoney',
          scopedSlots: { customRender: 'oneMoney' },
          width: '200px',
        },
        // {
        //   align: 'center',
        //   title: '含税含运费金额(元)',
        //   dataIndex: 'totalFreightUnitPrice',
        //   key: 'totalFreightUnitPrice',
        //   scopedSlots: {customRender: 'totalFreightUnitPrice'}
        // }
      ])
      let targetColumns = []
      //this.freightDivType  1单价 2金额
      //是否含运费
      let hasFreight = this.freightType === 1 ? true : false
      //是否单价
      let hasFreightDivOne = this.freightDivType === 2 ? true : false
      //是否含税
      let hasTax = this.isTax

      if (hasTax) {
        targetColumns = hasFreight ? (hasFreightDivOne ? case5 : case6) : case2
      } else {
        targetColumns = hasFreight ? (hasFreightDivOne ? case3 : case4) : case1
      }
      // targetColumns.push({
      //   title: '交货日期',
      //   dataIndex: 'dateTime'
      // })

      targetColumns.push(
        {
          align: 'center',
          title: '低于C价差额',
          width: '200px',
          dataIndex: 'productLowCPriceUnitAmount',
          scopedSlots: { customRender: 'productLowCPriceUnitAmount' },
        },
        {
          align: 'center',
          width: '200px',
          title: '低于C价总差额',
          dataIndex: 'productLowCPriceAllAmount',
          scopedSlots: { customRender: 'productLowCPriceAllAmount' },
        }
      )
      return targetColumns
    },
  },
  mounted() {
    this.init()
  },
  watch: {
    params: function () {
      this.init()
    },
    data: function () {
      if (this.isTax === false) {
        this.ispriceC = this.data.some((i) => i.priceC > i.unitPrice + parseFloat(i.unitPrice * (i.tax / 100)))
      }
      if (this.isTax === true) {
        this.ispriceC = this.data.some((i) => i.priceC > i.unitPrice)
      }
      //合计总差价
      let saleContractLowCPriceAllAmount = this.data.reduce((calc, item) => {
        return (Number(calc) + Number(item.productLowCPriceAllAmount)).toFixed(2)
      }, 0)
      this.saleContractLowCPriceAllAmount = Number(saleContractLowCPriceAllAmount)
      let hasTax = this.isTax
      let totalAmount = this.data.reduce((calc, item) => {
        return calc + (hasTax ? item.taxAmount : item.oneMoney)
      }, 0)
      let _freight = this.freight
      totalAmount = totalAmount + _freight
      totalAmount = Number(totalAmount).toFixed(2)
      this.totalAmount = totalAmount
      if (totalAmount <= 0) {
        this.chineseTotalAmount = '零'
      } else {
        turnTheCapital({ money: totalAmount })
          .then((res) => {
            console.log('转大写，请求后端接口结果', res)
            this.chineseTotalAmount = res.data
          })
          .catch((error) => {
            console.error(error)
          })
      }
    },
  },
  methods: {
    init() {
      let that = this
      this.totalAmount = this.params.totalAmount
      this.saleContractLowCPriceAllAmount = this.params.saleContractLowCPriceAllAmount
      this.chineseTotalAmount = this.params.freight
      this.isTax = this.params.isTax
      this.freightType = this.params.freightType
      this.freight = this.params.freight
      this.freightDivType = this.params.freightDivType || 2
      this.lowPriceDesc = this.params.lowPriceDesc
      if (this.params.dataSource <= 0) {
        return
      }
      this.data = this.params.dataSource.map((item) => {
        let o = Object.assign({}, item)
        productKeyID++
        o.key = productKeyID
        o.productType = String(item.productType)
        let calcObj = that.calcNumber(o)
        o.oneMoney = calcObj.oneMoney
        o.taxAmount = calcObj.taxAmount

        o.freightUnitPrice = calcObj.freightUnitPrice
        o.totalFreightUnitPrice = calcObj.totalFreightUnitPrice
        return o
      })

      this.freshValidateData()
    },
    freshValidateData() {
      let hasError = false
      let that = this
      let requireKey = ['targetId', 'productId', 'count', 'unitPrice', 'deliveryDate']
      this.data.map((item) => {
        let keys = Object.keys(item)
        if (!that.validateData[item.key]) {
          that.validateData[item.key] = {}
        }
        this.validateData[item.key] = {}
        keys.map((key) => {
          if (requireKey.includes(key)) {
            let res = {}
            if (key === 'count' || key === 'unitPrice') {
              res.validateStatus = item[key] <= 0 ? 'error' : ''
            } else if (key === 'deliveryDate') {
              // let __now = moment().format('YYYY-MM-DD')
              // res.validateStatus = moment(item[key]).isBefore(moment(__now)) ? 'error' : ''
              // res.help = '所选日期必须大于今天'
            } else {
              res.validateStatus = item[key] === null ? 'error' : ''
            }
            this.validateData[item.key][key] = { ...res }

            if (res.validateStatus === 'error') {
              hasError = true
            }
          }
        })
      })
      return hasError
    },
    // 添加行
    newMember() {
      productKeyID++
      this.data.push({
        key: productKeyID,
        targetId: null, //标的编号
        targetName: null, //标的名称
        quantityRequired: null,
        productId: null,
        productName: '', //产品名称
        priceC: '', //产品c价
        requirementDescription: null,
        unit: '0',
        count: '',
        unitPrice: '', // 单价
        oneMoney: 0, // 一行产品的金额
        tax: 0, // 税率%
        taxAmount: 0, // 含税金额（元）
        deliveryDate: moment(), // 签订日期, 默认今天
        editable: true,
        isNew: true,
        productPic: null,
        productCode: null,
        productType: '0',
        freightUnitPrice: '',
        productLowCPriceAllAmount: 0, //总差价
        productLowCPriceUnitAmount: 0, //差价
      })
      this.freshValidateData()
    },
    // 删除行
    async remove(record) {
      if (this.params.__fromAction === 'add') {
        const data = [...this.data]
        this.data = data.filter((item) => item.key !== record.key)
      }
      if (this.params.__fromAction === 'edit') {
        let params = { contractId: record.contractId, productId: record.id }
        if (record.id != undefined) {
          let checkResult = await checkDeletedProduct(params).then((res) => res)
          if (checkResult.code === 500) {
            this.$message.error(checkResult.msg)
            return
          } else if (checkResult.code === 200) {
            const data = [...this.data]
            this.data = data.filter((item) => item.key !== record.key)
          } else {
            console.error(`删除 非变动部分 产品 出现未知情况 :`, res)
          }
        } else {
          const data = [...this.data]
          this.data = data.filter((item) => item.key !== record.key)
        }
      }
    },
    // 标的id的改变 弹出层
    targetIdModel(record) {
      this.$refs.targetidModel.query(record)
    },
    targetidChange(data) {
      console.log('JSON 页面传值事件 标的id的改变 弹出层:', data)
      const dataSource = [...this.data]
      let { recordParam, selectItem } = data
      const target = dataSource.find((item) => item.key === recordParam.key)
      if (target) {
        target.targetId = selectItem.id
        target.targetName = selectItem.text
        target.tax = parseFloat(selectItem.tax)
        this.data = dataSource
      }
      this.freshValidateData()
    },
    //选择产品类别获取产品代码和产品图片
    typeSelectChange(record, e) {
      const dataSource = [...this.data]
      const target = dataSource.find((item) => item.key === record.key)
      if (target) {
        target['productType'] = e
        target.productPic = null
        target.productCode = null
        target.productId = null
        target.productName = null
        this.data = dataSource
      }
    },
    // 单位的改变
    companySelectChange(record, e) {
      const dataSource = [...this.data]
      const target = dataSource.find((item) => item.key === record.key)
      if (target) {
        target['unit'] = e
        this.data = dataSource
      }
    },
    // 交货日期的改变
    onChangeDate(record, e) {
      //debugger
      const dataSource = [...this.data]
      const target = dataSource.find((item) => item.key === record.key)
      if (target) {
        target['deliveryDate'] = e
        this.data = dataSource
      }
      this.freshValidateData()
    },
    //产品代码弹出框
    openModel(record) {
      this.$refs.productModel.query(record)
    },
    productChange(data) {
      console.log('JSON 页面传值事件 标的id的改变 弹出层:', data)
      let { selectItem, recordParam } = data
      const dataSource = [...this.data]
      const target = dataSource.find((item) => item.key === recordParam.key)
      if (target) {
        target['priceC'] = selectItem.priceC
        target['productPic'] = selectItem.productPic
        target['productCode'] = selectItem.productModel
        target['productTypeDicId'] = selectItem.productTypeDicId
        target['productId'] = selectItem.id
        target['productName'] = selectItem.productName
        this.data = dataSource
      }
      this.freshValidateData()
    },
    // 数量变化
    countChange(record, e) {
      //debugger
      const dataSource = [...this.data]
      const target = dataSource.find((item) => item.key === record.key)
      if (target) {
        let val = e.target.value.trim()
        target['count'] = val.length === 0 ? 0 : val

        let calcObj = this.calcNumber(target)
        target['oneMoney'] = calcObj.oneMoney
        target['taxAmount'] = calcObj.taxAmount
        target['productLowCPriceAllAmount'] = calcObj.productLowCPriceAllAmount
        this.data = dataSource
        // this.totalMmountChange()
      }
      this.freshValidateData()
    },
    // 输入单价后，求相乘的一行的金额
    multiplyMoney(record, key, e) {
      const dataSource = [...this.data]
      const target = dataSource.find((item) => item.key === record.key)
      if (target.targetId === null) {
        return this.$message.error('请先选择标的名称')
      }
      if (target.productCode === null) {
        return this.$message.error('请先选择产品代码')
      }
      if (target) {
        target[key] = e
        let calcObj = this.calcNumber(target)
        target['oneMoney'] = calcObj.oneMoney
        target['taxAmount'] = calcObj.taxAmount
        target['totalFreightUnitPrice'] = calcObj.totalFreightUnitPrice
        target['productLowCPriceUnitAmount'] =
          Number(calcObj.productLowCPriceUnitAmount) > 0 && target.productTypeDicId !== 356
            ? parseInt(Number(calcObj.productLowCPriceUnitAmount))
            : Number(calcObj.productLowCPriceUnitAmount) > 0 && target.productTypeDicId === 356
            ? Number(calcObj.productLowCPriceUnitAmount).toFixed(2)
            : 0
        target['productLowCPriceAllAmount'] =
          target.productTypeDicId !== 356
            ? parseInt(Number(calcObj.productLowCPriceAllAmount))
            : Number(calcObj.productLowCPriceAllAmount).toFixed(2)
        this.data = dataSource
        // this.totalMmountChange()
      }
      this.freshValidateData()
    },
    calcNumber(item) {
      let count = parseInt(item.count, 10)
      let unitPrice = parseFloat(item.unitPrice || 0)
      let priceC = parseFloat(item.priceC || 0)
      let oneMoney = count * unitPrice

      let freightUnitPrice = parseFloat(item.freightUnitPrice || 0)
      let totalFreightUnitPrice = count * freightUnitPrice
      let productLowCPriceUnitAmount = 0
      let productLowCPriceAllAmount = 0
      if (unitPrice > 0) {
        productLowCPriceUnitAmount =
          this.isTax === false && priceC > unitPrice
            ? priceC - (parseFloat(unitPrice) + parseFloat(unitPrice * (item.tax / 100)))
            : priceC > unitPrice
            ? priceC - unitPrice
            : 0
        productLowCPriceAllAmount =
          parseFloat(count * productLowCPriceUnitAmount) > 0 ? parseFloat(count * productLowCPriceUnitAmount) : 0
      }

      return {
        oneMoney: oneMoney,
        taxAmount: oneMoney,
        freightUnitPrice: freightUnitPrice,
        totalFreightUnitPrice: totalFreightUnitPrice,
        productLowCPriceAllAmount: productLowCPriceAllAmount,
        productLowCPriceUnitAmount: productLowCPriceUnitAmount,
      }
    },

    // // 合计总金额
    // totalMmountChange() {
    //   let that = this
    //   let hasTax = this.isTax
    //   let totalAmount = this.data.reduce((calc, item) => {
    //     return calc + (hasTax ? item.taxAmount : item.oneMoney)
    //   }, 0)

    //   let _freight = this.freight
    //   totalAmount = totalAmount + _freight
    //   totalAmount = Number(totalAmount).toFixed(2)
    //   this.totalAmount = totalAmount
    //   if (totalAmount <= 0) {
    //     that.chineseTotalAmount = '零'
    //   } else {
    //     turnTheCapital({ money: totalAmount })
    //       .then((res) => {
    //         console.log('转大写，请求后端接口结果', res)
    //         that.chineseTotalAmount = res.data
    //       })
    //       .catch((error) => {
    //         console.error(error)
    //       })
    //   }
    // },
    istotalAmount() {
      return {
        totalAmount: this.totalAmount,
      }
    },
    validate() {
      let hasError = this.freshValidateData()
      if (this.ispriceC === true && (this.lowPriceDesc === null || this.lowPriceDesc.trim().length === 0)) {
        return this.$message.error('特价说明不能为空')
      }
      return {
        errors: hasError,
        values: [...this.data],
        lowPriceDesc: this.lowPriceDesc === '' ? this.params.lowPriceDesc : this.lowPriceDesc,
        ispriceC: this.ispriceC,
      }
    },
  },
}
</script>
<style scoped>
.product-info-wrapper .ant-form-item {
  margin-bottom: 0;
}
.closep {
  text-align: left;
  line-height: 2;
}
</style>
