// eslint-disable-next-line
import {
  BasicLayout,
  BlankLayout,
  PageView,
  RouteView,
  UserLayout
} from '@/layouts'
import {
  bxAnaalyse
} from '@/core/icons'

/*
会有权限筛选处理，并作为菜单显示
*/
export const asyncRouterMap = [
  // index/dashboard
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '首页'
    },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard  1
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        hideChildrenInMenu: false,
        meta: {
          title: '万德福',
          keepAlive: true,
          icon: bxAnaalyse,
          permission: ['dashboard']
        },
        children: [{
            path: '/dashboard/analysis',
            name: 'Analysis',
            hidden: true,
            component: () => import('@/views/dashboard/Analysis'),
            meta: {
              title: '分析页',
              keepAlive: false,
              permission: ['dashboard']
            }
          },
          // 外部链接：万德福官网链接
          {
            path: 'http://www.xzwonderful.com/',
            name: 'Monitor',
            hidden: true,
            meta: {
              title: '监控页（外部）',
              target: '_blank'
            }
          },
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: {
              title: '万德福云',
              keepAlive: true,
              permission: ['dashboard']
            }
          }
        ]
      },

      // systemSetting
      {
        path: '/system-setting',
        name: 'SystemSetting',
        component: PageView,
        meta: {
          title: '系统设置',
          icon: 'tool',
          permission: ['admin']
        },
        redirect: '/system-setting/permission',
        children: [{
            path: '/system-setting/permission/devision-management',
            component: RouteView,
            name: 'AuthManagement',
            redirect: '/system-setting/permission/devision-management',
            meta: {
              title: '权限维护',
              icon: 'slack',
              keepAlive: true,
              permission: ['permission']
            },
            children: [

              {
                path: '/system-setting/permission/devision-management',
                name: 'DevisionManagement',
                component: () => import('@/views/system-setting/permission/DevisionManagement'),
                meta: {
                  title: '部门管理',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/permission/position-management',
                name: 'PositionManagement',
                component: () => import('@/views/system-setting/permission/PositionManagement'),
                meta: {
                  title: '岗位管理',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/permission/role-management',
                name: 'RoleManagement',
                component: () => import('@/views/system-setting/permission/RoleManagement'),
                meta: {
                  title: '角色管理',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/permission/system-user',
                name: 'SystemUser',
                component: () => import('@/views/system-setting/permission/SystemUser'),
                meta: {
                  title: '系统用户',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/permission/MenuList',
                name: 'Menumanagement',
                component: () => import('@/views/system-setting/permission/MenuList'),
                meta: {
                  title: '菜单管理',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/permission/产品代码-process',
                name: 'ApprovalProcess',
                component: () => import('@/views/system-setting/permission/ApprovalProcess'),
                meta: {
                  title: '审批流程',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/activity',
                name: 'activity',
                component: () => import('@/views/system-setting/activity/ActivitiProcDefList'),
                meta: {
                  title: '流程定义',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/permission/SysJobList',
                name: 'sysJob',
                component: () => import('@/views/system-setting/permission/SysJobList'),
                meta: {
                  title: '任务调度管理',
                  permission: ['permission']
                }
              }
            ]
          },
          {
            path: '/system-setting/security-settings',
            component: RouteView,
            name: 'SecuritySetting',
            meta: {
              title: '安全设置',
              icon: 'layout'
            },
            children: [{
                path: '/system-setting/work-box/dataDictionary',
                name: 'dataDictionary',
                component: () => import('@/views/system-setting/work-box/dataDictionary'),
                meta: {
                  title: '数据字典',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box/CommonSeal',
                name: 'CommonSeal',
                component: () => import('@/views/system-setting/work-box/CommonSeal'),
                meta: {
                  title: '公章管理',
                  keepAlive: false,
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/security-settings/WhiteList',
                name: 'WhiteList',
                component: () => import('@/views/system-setting/security-settings/WhiteList'),
                meta: {
                  title: '白名单管理',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/permission/SysLog',
                name: 'sysLog',
                component: () => import('@/views/system-setting/permission/SysLog'),
                meta: {
                  title: '系统日志',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/security-settings/Monitor',
                name: 'SysMonitor',
                component: () => import('@/views/system-setting/monitor/monitorIndex'),
                meta: {
                  title: '运行监控',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box/AndroidVersion',
                name: 'AndroidVersion',
                component: () => import('@/views/system-setting/work-box/AndroidVersion'),
                meta: {
                  title: '安卓版本信息',
                  permission: ['permission']
                }
              }
            ]
          },
          {

            path: '/system-setting/work-box',
            component: RouteView,
            name: 'workBox',
            meta: {
              title: '工具箱',
              icon: 'hdd',
              keepAlive: false,
              permission: ['permission']
            },
            children: [{
                path: '/system-setting/work-box/SoftwareProductList',
                name: 'SoftwareProductList',
                component: () => import('@/views/system-setting/work-box/SoftwareProductList'),
                meta: {
                  title: '软件产品信息',
                  permission: ['permission']
                }
              },

              {
                path: '/system-setting/work-box/Qualification',
                name: 'Qualification',
                component: () => import('@/views/system-setting/work-box/Qualification'),
                meta: {
                  title: '资质认证',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box/companyInformation/AccountBank',
                name: 'AccountBank',
                component: () => import('@/views/system-setting/work-box/companyInformation/AccountBank'),
                meta: {
                  title: '公司账户',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box/companyInformation/EnterpriseVideo',
                name: 'EnterpriseVideo',
                component: () => import('@/views/system-setting/work-box/companyInformation/EnterpriseVideo'),
                meta: {
                  title: '企业视频',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box/companyInformation/EnterpriseSynopsis',
                name: 'EnterpriseSynopsis',
                component: () => import('@/views/system-setting/work-box/companyInformation/EnterpriseSynopsis'),
                meta: {
                  title: '企业简介',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box/companyInformation/ProductPromotionVideo',
                name: 'ProductPromotionVideo',
                component: () => import('@/views/system-setting/work-box/companyInformation/ProductPromotionVideo'),
                meta: {
                  title: '产品宣传视频',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box/companyInformation/TeachingVideoOfProductUse',
                name: 'TeachingVideoOfProductUse',
                component: () => import('@/views/system-setting/work-box/companyInformation/TeachingVideoOfProductUse'),
                meta: {
                  title: '产品使用教学视频',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box/companyInformation/ProductFunctionIntroduction',
                name: 'ProductFunctionIntroduction',
                component: () => import('@/views/system-setting/work-box/companyInformation/ProductFunctionIntroduction'),
                meta: {
                  title: '产品功能简介',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box/OperationalScheme',
                name: 'OperationalScheme',
                component: () => import('@/views/system-setting/work-box/OperationalScheme'),
                meta: {
                  title: '运行方案',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box/GuidanceManual',
                name: 'GuidanceManual',
                component: () => import('@/views/system-setting/work-box/GuidanceManual'),
                meta: {
                  title: '运营指导手册',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box/DescriptionDocument',
                name: 'DescriptionDocument',
                component: () => import('@/views/system-setting/work-box/DescriptionDocument'),
                meta: {
                  title: '软件说明文档',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box/ElectronicAtlas',
                name: 'ElectronicAtlas',
                component: () => import('@/views/system-setting/work-box/ElectronicAtlas'),
                meta: {
                  title: '电子图册',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box/ProductPoster',
                name: 'ProductPoster',
                component: () => import('@/views/system-setting/work-box/ProductPoster'),
                meta: {
                  title: '产品海报',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box/ProjectCaseList',
                name: 'ProjectCaseList',
                component: () => import('@/views/system-setting/work-box/ProjectCaseList'),
                meta: {
                  title: '工程案例',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box/ToolPostExplain',
                name: 'ToolPostExplain',
                component: () => import('@/views/system-setting/work-box/ToolPostExplain'),
                meta: {
                  title: '岗位说明书',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box/SalesSkill',
                name: 'SalesSkil',
                component: () => import('@/views/system-setting/work-box/SalesSkillList'),
                meta: {
                  title: '销售技巧',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box/ProductDescription',
                name: 'ProductDescription',
                component: () => import('@/views/system-setting/work-box/ProductDescriptionList'),
                meta: {
                  title: '产品说明书',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box/ClassifiedPublicityVideo',
                name: 'ClassifiedPublicityVideo',
                component: () => import('@/views/system-setting/work-box/ClassifiedPublicityVideo'),
                meta: {
                  title: '分类宣传小视频',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box/companyInformation/EnterpriseQualification',
                name: 'EnterpriseQualification',
                component: () => import('@/views/system-setting/work-box/companyInformation/EnterpriseQualification'),
                meta: {
                  title: '企业资质',
                  permission: ['permission']
                }
              },
            ]
          },
          {

            path: '/system-setting/work-box-foreign-trade',
            component: RouteView,
            name: 'workBoxForeignTrade',
            redirect: '/system-setting/work-box-foreign-trade/Qualification',
            meta: {
              title: '外贸工具箱',
              icon: 'hdd',
              keepAlive: false,
              permission: ['permission']
            },
            children: [
              // {
              //   path: '/system-setting/work-box-foreign-trade/Qualification',
              //   name: 'ForeignTradeQualification',
              //   component: () => import('@/views/system-setting/work-box-foreign-trade/Qualification'),
              //   meta: { title: '资质认证', keepAlive: false ,permission: ['permission'] }
              // },
              {
                path: '/system-setting/work-box-foreign-trade/AccountBank',
                name: 'ForeignTradeAccountBank',
                component: () => import('@/views/system-setting/work-box-foreign-trade/AccountBank'),
                meta: {
                  title: '公司账户',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box-foreign-trade/EnterpriseVideo',
                name: 'ForeignTradeEnterpriseVideo',
                component: () => import('@/views/system-setting/work-box-foreign-trade/EnterpriseVideo'),
                meta: {
                  title: '企业视频',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box-foreign-trade/EnterpriseSynopsis',
                name: 'ForeignTradeEnterpriseSynopsis',
                component: () => import('@/views/system-setting/work-box-foreign-trade/EnterpriseSynopsis'),
                meta: {
                  title: '企业简介',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box-foreign-trade/OperationalScheme',
                name: 'ForeignTradeOperationalScheme',
                component: () => import('@/views/system-setting/work-box-foreign-trade/OperationalScheme'),
                meta: {
                  title: '技术参数',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box-foreign-trade/DescriptionDocument',
                name: 'ForeignTradeDescriptionDocument',
                component: () => import('@/views/system-setting/work-box-foreign-trade/DescriptionDocument'),
                meta: {
                  title: '软件说明文档',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box-foreign-trade/ProductPromotionVideo',
                name: 'ForeignTradeProductPromotionVideo',
                component: () => import('@/views/system-setting/work-box-foreign-trade/ProductPromotionVideo'),
                meta: {
                  title: '产品宣传视频',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box-foreign-trade/TeachingVideoOfProductUse',
                name: 'ForeignTradeTeachingVideoOfProductUse',
                component: () => import('@/views/system-setting/work-box-foreign-trade/TeachingVideoOfProductUse'),
                meta: {
                  title: '产品使用教学视频',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box-foreign-trade/ElectronicAtlas',
                name: 'ForeignTradeElectronicAtlas',
                component: () => import('@/views/system-setting/work-box-foreign-trade/ElectronicAtlas'),
                meta: {
                  title: '电子图册',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box-foreign-trade/ProductPoster',
                name: 'ForeignTradeProductPoster',
                component: () => import('@/views/system-setting/work-box-foreign-trade/ProductPoster'),
                meta: {
                  title: '产品海报',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box-foreign-trade/ProductDescription',
                name: 'ForeignTradeProductDescription',
                component: () => import('@/views/system-setting/work-box-foreign-trade/ProductDescription'),
                meta: {
                  title: '产品使用说明书',
                  permission: ['permission']
                }
              },
              {
                path: '/system-setting/work-box-foreign-trade/ClassifiedPublicityVideo',
                name: 'ForeignTradeClassifiedPublicityVideo',
                component: () => import('@/views/system-setting/work-box-foreign-trade/ClassifiedPublicityVideo'),
                meta: {
                  title: '分类宣传小视频',
                  permission: ['permission']
                }
              }
            ]
          }
        ]
      },
      // salesManagement销售管理
      {
        path: '/sales-management',
        name: 'salesManagement',
        component: PageView,
        meta: {
          title: '销售管理',
          icon: 'dollar',
          permission: ['permission']
        },
        redirect: '/sales-management',
        children: [{
            path: '/sales-management/customer', // 访问路径
            name: 'customer',
            component: RouteView,
            meta: {
              title: '客户管理',
              icon: 'team',
              keepAlive: false,
              permission: ['permission']
            },
            children: [{
                path: '/sales-management/customer/dep-customer',
                name: 'DepCustomerList',
                component: () => import('@/views/sales-management/customer/dep-customer/DepCustomerList'),
                meta: {
                  title: '部门客户',
                  permission: ['permission']
                }
              },
              {
                path: '/sales-management/customer/common-customer',
                name: 'CommonCutomerList',
                component: () => import('@/views/sales-management/customer/common-customer/CommonCutomerList'),
                meta: {
                  title: '公共客户',
                  permission: ['permission']
                }
              },
              {
                path: '/sales-management/customer/all-customer',
                name: 'AllCustomerList',
                component: () => import('@/views/sales-management/customer/all-customer/AllCustomerList'),
                meta: {
                  title: '所有客户',
                  permission: ['permission']
                }
              },
              {
                path: '/sales-management/customer/salesman',
                name: 'Salesman',
                component: () => import('@/views/sales-management/customer/salesman/SalesmanList'),
                meta: {
                  title: '销售人员管理',
                  keepAlive: false,
                  permission: ['permission']
                }
              },
              {
                path: '/sales-management/customer/customer_delay_record',
                name: 'customer_delay_record',
                component: () => import('@/views/sales-management/customer/customer_delay_record/CustomerDelayRecordList'),
                meta: {
                  title: '客户延时',
                  keepAlive: false,
                  permission: ['permission']
                }
              },
              {
                path: '/sales-management/customer/customer-release-rule',
                name: 'customerReleaseRule',
                component: () => import('@/views/sales-management/customer/customerReleaseRule/List'),
                meta: {
                  title: '客户释放规则',
                  keepAlive: false,
                  permission: ['permission']
                }
              },
              {
                path: '/sales-management/customer/customer-appeal',
                name: 'customerAppeal',
                component: () => import('@/views/sales-management/customer/customerAppeal/List'),
                meta: {
                  title: '客户申诉单',
                  keepAlive: false,
                  permission: ['permission']
                }
              }
            ]
          },
          {
            path: '/sales-management/contract-template-management',
            component: RouteView,
            name: 'contractManagement',
            redirect: '/sales-management/contract-template-management',
            meta: {
              title: '合同模版管理',
              icon: 'book',
              keepAlive: true,
              permission: ['permission']
            },
            children: [{
                path: '/sales-management/contract-template-management/salesContractTemplate',
                name: 'salesContractTemplate',
                component: () => import('@/views/sales-management/contract-template-management/salesContractTemplate'),
                meta: {
                  title: '销售合同模板',
                  permission: ['permission']
                }
              },
              {
                path: '/sales-management/contract-template-management/productOrderFormTemplate',
                name: 'productOrderFormTemplate',
                component: () => import('@/views/sales-management/contract-template-management/productOrderFormTemplate'),
                meta: {
                  title: '产品订货单模板',
                  permission: ['permission']
                }
              },
              {
                path: '/sales-management/contract-template-management/tripartiteContractTemplate',
                name: 'tripartiteContractTemplate',
                component: () => import('@/views/sales-management/contract-template-management/tripartiteContractTemplate'),
                meta: {
                  title: '三方合同模板',
                  permission: ['permission']
                }
              },
              {
                path: '/sales-management/contract-template-management/softwareContractTemplate',
                name: 'softwareContractTemplate',
                component: () => import('@/views/sales-management/contract-template-management/softwareContractTemplate'),
                meta: {
                  title: '软件合同模板',
                  permission: ['permission']
                }
              }
            ]
          },
          {
            path: '/sale/electronic-receipt', // 访问路径
            name: 'electronic-receipt',
            component: RouteView,
            meta: {
              title: '单据管理',
              icon: 'team',
              keepAlive: false,
              permission: ['permission']
            },
            children: [{
                path: '/sale/electronic-receipt/electronicReceipt',
                name: 'electronicReceipt',
                component: () => import('@/views/sale/electronic-receipt/electronicReceipt'),
                meta: {
                  title: '电子收据',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/electronic-receipt/modules',
                name: 'receiptModule',
                hidden: true,
                component: () => import('@/views/sale/electronic-receipt/modules/receiptModule'),
                meta: {
                  title: '查看收据',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/addReceipt',
                name: 'addReceipt',
                hidden: true,
                component: () => import('@/views/sale/electronic-receipt/addReceipt'),
                meta: {
                  title: '申请收据',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/order',
                name: 'order',
                component: () => import('@/views/sale/order/order'),
                meta: {
                  title: '销售订单',
                  keepAlive: false,
                  permission: ['permission']
                }
              },
              {
                path: '/sale/order/modules',
                name: 'orderModule',
                hidden: true,
                component: () => import('@/views/sale/order/modules/orderModule'),
                meta: {
                  title: '订单详情',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/invoice',
                name: 'invoice',
                keepAlive: false,
                component: () => import('@/views/sale/invoice/invoice'),
                meta: {
                  title: '发货单',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/invoice/modules',
                name: 'invoiceModules',
                hidden: true,
                component: () => import('@/views/sale/invoice/modules/invoiceModules'),
                meta: {
                  title: '发货单申请',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/invoice/modules',
                name: 'invoiceApproval',
                hidden: true,
                component: () => import('@/views/sale/invoice/modules/invoiceApproval'),
                meta: {
                  title: '发货单审批',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/delayed_payment',
                name: 'delayedPayment',
                keepAlive: false,
                component: () => import('@/views/sale/delayed_payment/delayedPayment'),
                meta: {
                  title: '延迟付款单',
                  permission: ['permission']
                }
              }, {
                path: '/sale/delayed_payment/modules',
                name: 'addDelayedPayment',
                hidden: true,
                component: () => import('@/views/sale/delayed_payment/modules/addDelayedPayment'),
                meta: {
                  title: '延迟付款单新增',
                  permission: ['permission']
                }
              }, {
                path: '/sale/delayed_payment/modules',
                name: 'addSoftDelayedPayment',
                hidden: true,
                component: () => import('@/views/sale/delayed_payment/modules/addSoftDelayedPayment'),
                meta: {
                  title: '延迟付款单新增',
                  permission: ['permission']
                }
              }, {
                path: '/sale/delayed_payment/modules',
                name: 'lookDelayedPayment',
                hidden: true,
                component: () => import('@/views/sale/delayed_payment/modules/lookDelayedPayment'),
                meta: {
                  title: '延迟付款单查看',
                  permission: ['permission']
                }
              }, {
                path: '/sale/delayed_payment/modules',
                name: 'lookSoftDelayedPayment',
                hidden: true,
                component: () => import('@/views/sale/delayed_payment/modules/lookSoftDelayedPayment'),
                meta: {
                  title: '延迟付款单查看',
                  permission: ['permission']
                }
              }, {
                path: '/sale/delayed_payment/modules',
                name: 'resubmit',
                hidden: true,
                component: () => import('@/views/sale/delayed_payment/modules/resubmit'),
                meta: {
                  title: '延迟付款单重新提交',
                  permission: ['permission']
                }
              }, {
                path: '/sale/delayed_payment/modules',
                name: 'softResubmit',
                hidden: true,
                component: () => import('@/views/sale/delayed_payment/modules/softResubmit'),
                meta: {
                  title: '延迟付款单重新提交',
                  permission: ['permission']
                }
              }, {
                path: '/sale/delayed_payment/modules',
                name: 'createPromise',
                hidden: true,
                component: () => import('@/views/sale/delayed_payment/modules/createPromise'),
                meta: {
                  title: '延迟付款承诺书',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/receipt/ReceiptList',
                name: 'receiptList',
                component: () => import('@/views/sale/receipt/ReceiptList'),
                meta: {
                  title: '收款单',
                  permission: ['user']
                }
              },
              {
                path: '/sale/receipt/ReceiptAdd',
                name: 'ReceiptAdd',
                hidden: true,
                component: () => import('@/views/sale/receipt/ReceiptAdd'),
                meta: {
                  title: '销售收款添加',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/receipt/ReceiptSoftwareAdd',
                name: 'ReceiptSoftwareAdd',
                hidden: true,
                component: () => import('@/views/sale/receipt/ReceiptSoftwareAdd'),
                meta: {
                  title: '软件收款添加',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/receipt/ReceiptVue',
                name: 'ReceiptVue',
                hidden: true,
                component: () => import('@/views/sale/receipt/ReceiptVue'),
                meta: {
                  title: '查看',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/receipt/ReceiptSoftwareVue',
                name: 'ReceiptSoftwareVue',
                hidden: true,
                component: () => import('@/views/sale/receipt/ReceiptSoftwareVue'),
                meta: {
                  title: '查看',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/receipt/ReceiptAudit',
                name: 'ReceiptAudit',
                hidden: true,
                component: () => import('@/views/sale/receipt/ReceiptAudit'),
                meta: {
                  title: '审批',
                  permission: ['permission']
                }
              }, {
                path: '/sale/receipt/ReceiptSoftwareAudit',
                name: 'ReceiptSoftwareAudit',
                hidden: true,
                component: () => import('@/views/sale/receipt/ReceiptSoftwareAudit'),
                meta: {
                  title: '审批',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/advances/AdvancesList',
                name: 'advancesList',
                component: () => import('@/views/sale/advances/AdvancesList'),
                meta: {
                  title: '预收款单',
                  permission: ['user']
                }
              },
              {
                path: '/sales-management/pricing-module/pricing',
                name: 'pricing',
                component: () => import('@/views/sales-management/pricing-module/pricing'),
                meta: {
                  title: '核价单',
                  permission: ['permission']
                }
              },
              {
                path: '/sales-management/pricing-module/ApplyNuclearPrice',
                name: 'ApplyNuclearPrice',
                hidden: true,
                component: () => import('@/views/sales-management/pricing-module/ApplyNuclearPrice'),
                meta: {
                  title: '申请核价',
                  keepAlive: false,
                  permission: ['permission']
                }
              },
              {
                path: '/sales-management/pricing-module/LookNuclearPrice',
                name: 'LookNuclearPrice',
                hidden: true,
                component: () => import('@/views/sales-management/pricing-module/LookNuclearPrice'),
                meta: {
                  title: '查看核价',
                  permission: ['permission']
                }
              },
              {
                path: '/sales-management/pricing-module/NuclearPriceApproval',
                name: 'NuclearPriceApproval',
                hidden: true,
                component: () => import('@/views/sales-management/pricing-module/NuclearPriceApproval'),
                meta: {
                  title: '核价单界面',
                  keepAlive: false,
                  permission: ['permission']
                }
              },
              {
                path: '/sales-management/pricing-module/ReApplyNuclearPrice',
                name: 'ReApplyNuclearPrice',
                hidden: true,
                component: () => import('@/views/sales-management/pricing-module/ReApplyNuclearPrice'),
                meta: {
                  title: '核价单重新提交',
                  keepAlive: false,
                  permission: ['permission']
                }
              },
              {
                path: '/sale/openpaper/OpenPaperList',
                name: 'openPaperList',
                component: () => import('@/views/sale/openpaper/OpenPaperList'),
                meta: {
                  title: '开票单',
                  permission: ['user']
                }
              }, {
                path: '/sale/openpaper/OpenPaperAdd',
                name: 'openPaperAdd',
                hidden: true,
                component: () => import('@/views/sale/openpaper/OpenPaperAdd'),
                meta: {
                  title: '开票申请',
                  permission: ['permission']
                }
              }, {
                path: '/sale/openpaper/modules/SoftwareOpenPaperAdd',
                name: 'softwareOpenPaperAdd',
                hidden: true,
                component: () => import('@/views/sale/openpaper/modules/SoftwareOpenPaperAdd'),
                meta: {
                  title: '软件合同开票申请',
                  permission: ['permission']
                }
              }, {
                path: '/sale/openpaper/OpenPaperVue',
                name: 'openPaperVue',
                hidden: true,
                component: () => import('@/views/sale/openpaper/OpenPaperVue'),
                meta: {
                  title: '查看开票单',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/openpaper/modules/SoftwareOpenPaperView',
                name: 'softwareOpenPaperView',
                hidden: true,
                component: () => import('@/views/sale/openpaper/modules/SoftwareOpenPaperView'),
                meta: {
                  title: '查看开票单',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/openpaper/EditPaperVue',
                name: 'editPaperVue',
                hidden: true,
                component: () => import('@/views/sale/openpaper/EditPaperVue'),
                meta: {
                  title: '重新提交',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/openpaper/modules/EditSoftwareOpenPaper',
                name: 'editSoftwareOpenPaper',
                hidden: true,
                component: () => import('@/views/sale/openpaper/modules/EditSoftwareOpenPaper'),
                meta: {
                  title: '重新提交',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/after/AfterList',
                name: 'afterList',
                component: () => import('@/views/sale/after/AfterList'),
                meta: {
                  title: '产品调试任务单',
                  permission: ['user']
                }
              }, {
                path: '/sale/after/AfterAdd',
                name: 'afterAdd',
                hidden: true,
                component: () => import('@/views/sale/after/AfterAdd'),
                meta: {
                  title: '产品调试任务单',
                  permission: ['permission']
                }
              }, {
                path: '/sale/after/AfterVueOfAudit',
                name: 'AfterVueOfAudit',
                hidden: true,
                component: () => import('@/views/sale/after/AfterVueOfAudit'),
                meta: {
                  title: '产品调试任务单',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/refund/List',
                name: 'refundReceipt',
                hidden: true,
                component: () => import('@/views/sale/refund-receipt/List'),
                meta: {
                  title: '退款单',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/present/List',
                name: 'presentReceipt',
                hidden: true,
                component: () => import('@/views/sale/present-receipt/List'),
                meta: {
                  title: '赠送单',
                  permission: ['permission']
                }
              },
              // {
              //   path: '/sale/present-order/List',
              //   name: 'presentOrder',
              //   hidden: true,
              //   component: () => import('@/views/sale/present-order/List'),
              //   meta: { title: '赠送订单', permission: ['permission'] }
              // },
              {
                path: '/sale/present-order/List',
                name: 'presentOrder',
                hidden: true,
                component: () => import('@/views/sale/present-order/List'),
                meta: {
                  title: '赠送订单',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/income/List',
                name: 'incomeReceipt',
                hidden: true,
                component: () => import('@/views/sale/income-receipt/List'),
                meta: {
                  title: '进款单',
                  permission: ['permission']
                }
              }
            ]
          },
          {
            path: '/sales-management/contract-list-management',
            name: 'contractListManagement',
            component: RouteView,
            meta: {
              title: '合同列表管理',
              icon: 'table',
              permission: ['permission']
            },
            children: [{
                path: '/sales-management/contract-list-management/distributionContractList',
                name: 'distributionContractList',
                component: () => import('@/views/sales-management/contract-list-management/distributionContractList'),
                meta: {
                  title: '销售合同',
                  permission: ['permission']
                }
              },
              {
                path: '/sales-management/contract-list-management/step-forms/basicInformation1',
                name: 'basicInformation1',
                hidden: true,
                component: () => import('@/views/sales-management/contract-list-management/step-forms/basicInformation1'),
                meta: {
                  title: '申请合同',
                  keepAlive: false,
                  permission: ['permission']
                }
              },
              {
                path: '/sales-management/contract-list-management/step-forms-edit/basicInformation1',
                name: 'basicInformationEdit',
                hidden: true,
                component: () => import('@/views/sales-management/contract-list-management/step-forms-edit/basicInformation1'),
                meta: {
                  title: '申请合同',
                  permission: ['permission']
                }
              },
              // {
              //   path: '/sales-management/contract-list-management/preview/previewSalesContract',
              //   name: 'preview',
              //   hidden:true,
              //   component: () => import('@/views/sales-management/contract-list-management/preview/previewSalesContract'),
              //   meta: { title: '合同预览', permission: ['permission'] },
              //   // redirect: '/sales-management/contract-list-management/step-forms/preview/previewSalesContract',
              //   children: [
              {
                path: '/sales-management/contract-list-management/preview/previewSalesContract',
                name: 'previewSalesContract',
                hidden: true,
                component: () => import('@/views/sales-management/contract-list-management/preview/previewSalesContract'),
                meta: {
                  title: '销售合同',
                  permission: ['permission']
                }
              },
              {
                path: '/sales-management/contract-list-management/preview/previewProductOrderForm',
                name: 'previewProductOrderForm', //产品订货单
                hidden: true,
                component: () => import('@/views/sales-management/contract-list-management/preview/previewProductOrderForm'),
                meta: {
                  title: '销售合同',
                  permission: ['permission']
                }
              },
              {
                path: '/sales-management/contract-list-management/preview/previewTripartiteContract',
                name: 'previewTripartiteContract', //三方合同
                hidden: true,
                component: () => import('@/views/sales-management/contract-list-management/preview/previewTripartiteContract'),
                meta: {
                  title: '销售合同',
                  permission: ['permission']
                }
              },
              {
                path: '/sales-management/software-contract-management/softwareContractList',
                name: 'softwareContractList',
                component: () => import('@/views/sales-management/software-contract-management/softwareContractList'),
                meta: {
                  title: '软件合同',
                  keepAlive: true,
                  permission: ['permission']
                }
              },
              {
                path: '/sales-management/software-contract-management/softwareContractModel',
                name: 'softwareContractModel',
                component: () => import('@/views/sales-management/software-contract-management/softwareContractModel'),
                meta: {
                  title: '软件合同编辑',
                  keepAlive: false,
                  permission: ['permission']
                }
              },
              {
                path: '/sales-management/software-contract-management/preview/previewSoftwareContract',
                name: 'previewSoftwareContract',
                component: () => import('@/views/sales-management/software-contract-management/preview/previewSoftwareContract'),
                meta: {
                  title: '软件合同预览',
                  permission: ['permission']
                }
              },

              //   ]
              // },
            ]
          },
          {
            path: '/sale', // 访问路径
            name: 'sale',
            component: RouteView,
            meta: {
              title: '项目授权',
              icon: 'team',
              keepAlive: false,
              permission: ['permission']
            },
            children: [{
              path: '/sale/record/InvestigateList',
              name: 'investigateList',
              component: () => import('@/views/sale/record/InvestigateList'),
              meta: {
                title: '授权列表',
                permission: ['permission']
              }
            }]
          },
          {
            path: '/sales-record-new', // 访问路径
            name: 'salesRecordNew',
            component: RouteView,
            meta: {
              title: '项目备案',
              icon: 'team',
              keepAlive: false,
              permission: ['permission']
            },
            children: [{
              path: '/sale/recordNew/List',
              name: 'recordNewList',
              component: () => import('@/views/sale/recordNew/List'),
              meta: {
                title: '备案列表',
                permission: ['permission']
              }
            }]
          },
          {
            path: '/sales-report', // 访问路径
            name: 'salesReport',
            component: RouteView,
            meta: {
              title: '销售报表',
              icon: 'chart',
              keepAlive: false,
              permission: ['permission']
            },
            children: [{
                path: '/sale/salesReport/SaleOrderReport',
                name: 'SaleOrderReport',
                component: () => import('@/views/sale/report/SaleOrderReport'),
                meta: {
                  title: '订单详情',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/salesReport/InvoiceProductReport',
                name: 'InvoiceProductReport',
                component: () => import('@/views/sale/report/InvoiceProductReport'),
                meta: {
                  title: '发货分析',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/salesReport/PersonnelPerformanceReport',
                name: 'PersonnelPerformanceReport',
                component: () => import('@/views/sale/report/PersonnelPerformanceReport'),
                meta: {
                  title: '人员业绩分析',
                  permission: ['permission']
                }
              },
              {
                path: '/sale/salesReport/DepartmentPerformanceReport',
                name: 'DepartmentPerformanceReport',
                component: () => import('@/views/sale/report/DepartmentPerformanceReport'),
                meta: {
                  title: '部门业绩分析',
                  permission: ['permission']
                }
              }
            ]
          },
          {
            path: '/system-setting/work-box/ProductList',
            name: 'productList',
            component: () => import('@/views/system-setting/work-box/ProductList'),
            meta: {
              title: '产品信息',
              keepAlive: false,
              permission: ['permission']
            }
          },
          {
            path: '/system-setting/work-box/ProductPrice',
            name: 'ProductPrice',
            component: () => import('@/views/system-setting/work-box/ProductPrice'),
            meta: {
              title: '产品价格',
              permission: ['permission']
            }
          },
        ]
      },
      // 生产管理
      {
        path: '/production',
        name: 'production',
        component: PageView,
        meta: {
          title: '生产管理',
          icon: 'build',
          permission: ['permission']
        },
        redirect: '/production/retrospect',
        children: [{
            path: '/production/retrospect',
            name: 'retrospect',
            component: RouteView,
            meta: {
              title: '产品追溯',
              icon: 'select',
              keepAlive: false,
              permission: ['permission']
            },
            children: [{
                path: '/production/retrospect/processList',
                name: 'ProcessList',
                component: () => import('@/views/production/retrospect/ProcessList'),
                meta: {
                  title: '生产工序',
                  permission: ['permission']
                }
              },
              {
                path: '/production/retrospect/codeList',
                name: 'CodeList',
                component: () => import('@/views/production/retrospect/CodeList'),
                meta: {
                  title: '产品代码',
                  permission: ['permission']
                }
              },
              {
                path: '/production/retrospect/recordList',
                name: 'RecordList',
                component: () => import('@/views/production/retrospect/RecordList'),
                meta: {
                  title: '产品档案',
                  permission: ['permission']
                }
              }
            ]
          },
          {
            path: '/production/event',
            name: 'productionEvent',
            component: RouteView,
            meta: {
              title: '质量事件',
              icon: 'select',
              keepAlive: false,
              permission: ['permission']
            },
            children: [{
              path: '/production/event/EventList',
              name: 'eventList',
              component: () => import('@/views/production/event/EventList'),
              meta: {
                title: '质量事件列表',
                permission: ['permission']
              }
            }]
          },
          {
            path: '/production/cutCost',
            name: 'productionCutCost',
            component: RouteView,
            meta: {
              title: '降本',
              icon: 'select',
              keepAlive: false,
              permission: ['permission']
            },
            children: [{
                path: '/production/cutCostRecord',
                name: 'cutCostRecord',
                component: () => import('@/views/production/cut-cost/RecordList'),
                meta: {
                  title: '降本申请记录',
                  permission: ['permission']
                }
              },
              {
                path: '/production/cutCostRule',
                name: 'cutCostRule',
                component: () => import('@/views/production/cut-cost/RuleList'),
                meta: {
                  title: '考核规则',
                  permission: ['permission']
                }
              },
              {
                path: '/production/cutCostRuleRecord',
                name: 'cutCostRuleRecord',
                component: () => import('@/views/production/cut-cost/RuleRecordList'),
                meta: {
                  title: '考核记录',
                  permission: ['permission']
                }
              }
            ]
          }
        ]
      },
      { //人事管理
        path: '/personnel-management',
        name: 'personnel-management',
        component: PageView,
        meta: {
          title: '人事管理',
          icon: 'team',
          permission: ['permission']
        },
        redirect: '/personnel-management',
        children: [{
            path: '/personnel-management/personnel-reserve',
            name: 'personnel-reserve',
            component: () => import('@/views/personnel-management/reserve/ReserveList'),
            meta: {
              title: '人员储备',
              icon: 'select',
              keepAlive: false,
              permission: ['permission']
            },
            children: []
          },
          {
            path: '/personnel-management/organizational-structure',
            name: 'organizational-structure',
            component: () => import('@/views/personnel-management/structure/OrganizationalStructureChart'),
            meta: {
              title: '组织架构图',
              icon: 'cluster',
              keepAlive: false,
              permission: ['permission']
            },
            children: []
          },
          // {
          //   path: '/personnel-management/report',
          //   name: 'personnel-report',
          //   component: () => import('@/views/personnel-management/report/ReportList'),
          //   meta: { title: '人事报表', icon: 'file', keepAlive: false, permission: ['permission'] },
          //   children:[]
          // },

          {
            path: '/personnel-management/personnel-apply',
            name: 'personnel-apply',
            component: RouteView,
            meta: {
              title: '人事申请',
              icon: 'select',
              keepAlive: false,
              permission: ['permission']
            },
            children: [{
                path: '/personnel-management/personnel-apply/recruit-apply',
                name: 'recruit-apply',
                component: () => import('@/views/personnel-management/apply/recruit-apply/RecruitApplyList'),
                meta: {
                  title: '招聘申请',
                  icon: 'select',
                  keepAlive: false,
                  permission: ['permission']
                },
                children: []
              },
              {
                path: '/personnel-management/personnel-apply/becoming-apply',
                name: 'becoming-apply',
                component: () => import('@/views/personnel-management/apply/becoming-apply/BecomingApplyList'),
                meta: {
                  title: '转正申请',
                  icon: 'select',
                  keepAlive: false,
                  permission: ['permission']
                },
                children: []
              },
              {
                path: '/personnel-management/personnel-apply/probation-survey',
                name: 'probation-survey',
                component: () => import('@/views/personnel-management/apply/probation-survey/ProbationSurveyList'),
                meta: {
                  title: '试用期调查表',
                  icon: 'select',
                  keepAlive: false,
                  permission: ['permission']
                },
                children: []
              },
              {
                path: '/personnel-management/personnel-apply/adjust-apply',
                name: 'adjust-apply',
                component: () => import('@/views/personnel-management/apply/adjust-apply/List'),
                meta: {
                  title: '调岗调薪申请',
                  icon: 'select',
                  keepAlive: false,
                  permission: ['permission']
                },
                children: []
              },
              {
                path: '/personnel-management/personnel-apply/severance-apply',
                name: 'severance-apply',
                component: () => import('@/views/personnel-management/apply/severance-apply/List'),
                meta: {
                  title: '离职申请',
                  icon: 'select',
                  keepAlive: false,
                  permission: ['permission']
                },
                children: []
              },
              {
                path: '/personnel-management/personnel-apply/accident-report',
                name: 'accident-report',
                component: () => import('@/views/personnel-management/apply/accident-report/List'),
                meta: {
                  title: '事故调查报告',
                  icon: 'select',
                  keepAlive: false,
                  permission: ['permission']
                },
                children: []
              },
              {
                path: '/personnel-management/personnel-apply/severance-agreement',
                name: 'severance-agreement',
                component: () => import('@/views/personnel-management/apply/severance-agreement/List'),
                meta: {
                  title: '离职协议',
                  icon: 'select',
                  keepAlive: false,
                  permission: ['permission']
                },
                children: []
              }
            ]
          },
          {
            path: '/personnel-management/interview-record',
            name: 'interview-record',
            component: () => import('@/views/personnel-management/interview-record/InterviewRecordList'),
            meta: {
              title: '面试记录',
              icon: 'select',
              keepAlive: false,
              permission: ['permission']
            },
            children: []
          }
        ]
      }, { //产品报价管理
        path: '/product-offer-management',
        name: 'product-offer-management',
        component: PageView,
        meta: {
          title: '产品报价管理',
          icon: 'dollar',
          permission: ['permission']
        },
        children: [{
            path: '/product-offer-management/product-config',
            name: 'pom-product-config',
            component: () => import('@/views/product-offer-management/product-config/List'),
            meta: {
              title: '产品配置',
              icon: 'setting',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/product-offer-management/products-price',
            name: 'pom-products-price',
            component: () => import('@/views/product-offer-management/products-price/List'),
            meta: {
              title: '产品价格配置',
              icon: 'setting',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/product-offer-management/2d0', // 访问路径
            name: 'product-offer-management2d0',
            component: RouteView,
            meta: {
              title: '2.0产品配置',
              icon: 'team',
              keepAlive: false,
              permission: ['permission']
            },
            children: [{
                path: '/product-offer-management/2d0/products-config',
                name: 'pom-products-config2d0',
                component: () => import('@/views/product-offer-management/products-config/List2'),
                meta: {
                  title: '系列产品配置',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                },
              },
              {
                path: '/product-offer-management/2d0/productPriceCoefficient',
                name: 'productPriceCoefficient2d0',
                component: () => import('@/views/system-setting/work-box/productPriceCoefficient/List2'),
                meta: {
                  title: '产品价格系数',
                  permission: ['permission']
                }
              },
            ]
          },
          {
            path: '/product-offer-management/4d0', // 访问路径
            name: 'product-offer-management4d0',
            component: RouteView,
            meta: {
              title: '4.0产品配置',
              icon: 'team',
              keepAlive: false,
              permission: ['permission']
            },
            children: [{
                path: '/product-offer-management/4d0/central-control-system-config',
                name: 'pom-central-control-system-config4d0',
                component: () => import('@/views/product-offer-management/central-control-system-config/List'),
                meta: {
                  title: '中控系统模块配置',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                },
                children: []
              },
              {
                path: '/product-offer-management/4d0/products-config',
                name: 'pom-products-config4d0',
                component: () => import('@/views/product-offer-management/products-config/List'),
                meta: {
                  title: '系列产品配置',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                },
              },
              {
                path: '/product-offer-management/4d0/productPriceCoefficient',
                name: 'productPriceCoefficient4d0',
                component: () => import('@/views/system-setting/work-box/productPriceCoefficient/List'),
                meta: {
                  title: '产品价格系数',
                  permission: ['permission']
                }
              },
              {
                path: '/product-offer-management/4d0/priceAdjustProductQuote',
                name: 'pom-products-quotation-list4d0',
                component: () => import('@/views/product-offer-management/products-quotation/QuoteList'),
                meta: {
                  title: '产品报价列表',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                },
              },
            ]
          },
          {
            path: '/product-offer-management/products-quotation',
            name: 'pom-products-quotation',
            component: () => import('@/views/product-offer-management/products-quotation/List'),
            meta: {
              title: '产品报价',
              icon: 'setting',
              keepAlive: false,
              permission: ['permission']
            },
          }
        ]
      },
      {
        //工作上报管理
        path: '/work-report-management',
        name: 'work-report-management',
        component: PageView,
        meta: {
          title: '工作上报管理',
          icon: 'dollar',
          permission: ['permission']
        },
        redirect: '/work-report-management',
        children: [{
            path: '/work-report-management/report-set',
            name: 'wrm-report-set',
            component: () => import('@/views/work-report-management/report-set/List'),
            meta: {
              title: '工作上报设置',
              icon: 'setting',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/work-report-management/report-daily-set',
            name: 'wrm-report-daily-set',
            component: () => import('@/views/work-report-management/report-daily-set/List'),
            meta: {
              title: '日报',
              icon: 'setting',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/work-report-management/report-week-set',
            name: 'wrm-report-week-set',
            component: () => import('@/views/work-report-management/report-week-set/List'),
            meta: {
              title: '周报',
              icon: 'setting',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/work-report-management/report-month-set',
            name: 'wrm-report-month-set',
            component: () => import('@/views/work-report-management/report-month-set/List'),
            meta: {
              title: '月报',
              icon: 'setting',
              keepAlive: false,
              permission: ['permission']
            },
          },
        ]
      },

      {
        //会议管理
        path: '/meeting-management',
        name: 'meeting-management',
        component: PageView,
        meta: {
          title: '会议管理',
          icon: 'team',
          permission: ['permission']
        },
        redirect: '/meeting-management/settings',
        children: [{
            path: '/meeting-management/settings',
            name: 'meetingManagementSettings',
            component: () => import('@/views/meeting-management/settings/List'),
            meta: {
              title: '会议设置',
              icon: 'setting',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/meeting-management/records',
            name: 'meetingManagementRecords',
            component: () => import('@/views/meeting-management/records/List'),
            meta: {
              title: '会议记录',
              icon: 'setting',
              keepAlive: false,
              permission: ['permission']
            },
          }
        ]
      },


      {
        //考勤管理
        path: '/attendance-management',
        name: 'attendance-management',
        component: PageView,
        meta: {
          title: '考勤管理',
          icon: 'bell',
          permission: ['permission']
        },
        redirect: '/canteen-menu-management/config',
        children: [{
            path: '/attendance-management/rules-setting',
            name: 'attendance-rules-setting',
            component: RouteView,
            redirect: '/attendance-management/rules-setting/shift-rule',
            meta: {
              title: '考勤规则设置',
              icon: 'setting',
              keepAlive: false,
              permission: ['permission']
            },
            children: [{
                path: '/attendance-management/rules-setting/shift-rule',
                name: 'attendance-rules-setting-shift-rule',
                component: () => import('@/views/attendance-management/rules-setting/shift-rule/List'),
                meta: {
                  title: '班次设置',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                }
              },
              {
                path: '/attendance-management/rules-setting/supplement-card-rule',
                name: 'attendance-rules-setting-supplement-card-rule',
                component: () => import('@/views/attendance-management/rules-setting/supplement-card-rule/List'),
                meta: {
                  title: '补卡规则设置',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                }
              },
              {
                path: '/attendance-management/rules-setting/over-time-rule',
                name: 'attendance-rules-setting-over-time-rule',
                component: () => import('@/views/attendance-management/rules-setting/over-time-rule/List'),
                meta: {
                  title: '加班规则设置',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                }
              },
              {
                path: '/attendance-management/rules-setting/attendance-rule',
                name: 'attendance-rules-setting-attendance-rule',
                component: () => import('@/views/attendance-management/rules-setting/attendance-rule/List'),
                meta: {
                  title: '出勤规则设置',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                }
              },
              {
                path: '/attendance-management/rules-setting/attendance-rule-edit',
                name: 'attendance-rules-setting-attendance-rule-edit',
                component: () => import('@/views/attendance-management/rules-setting/attendance-rule/ListEdit'),
                meta: {
                  title: '出勤规则修改记录',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                }
              },
              {
                path: '/attendance-management/rules-setting/vacation-rule',
                name: 'attendance-rules-setting-vacation-rule',
                component: () => import('@/views/attendance-management/rules-setting/vacation-rule/List'),
                meta: {
                  title: '假期规则设置',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                }
              },
              {
                path: '/attendance-management/rules-setting/vacation-management',
                name: 'attendance-rules-setting-vacation-management',
                component: () => import('@/views/attendance-management/rules-setting/vacation-management/List'),
                meta: {
                  title: '节假日管理',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                }
              }
            ]
          },
          {
            path: '/attendance-management/business-trip-apply',
            name: 'attendance-business-trip-apply',
            component: () => import('@/views/attendance-management/business-trip-apply/List'),
            meta: {
              title: '出差申请',
              icon: 'car',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/attendance-management/over-time-apply',
            name: 'attendance-over-time-apply',
            component: () => import('@/views/attendance-management/over-time-apply/List'),
            meta: {
              title: '加班申请',
              icon: 'setting',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/attendance-management/attendance-abnormal-events',
            name: 'attendance-abnormal-events',
            component: () => import('@/views/attendance-management/attendance-abnormal-events/List'),
            meta: {
              title: '考勤异常事件',
              icon: 'setting',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/attendance-management/attence-months',
            name: 'attence-months',
            component: () => import('@/views/attendance-management/attence-months/List'),
            meta: {
              title: '考勤月历',
              icon: 'setting',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/attendance-management/supplement-card-apply',
            name: 'attendance-supplement-card-apply',
            component: () => import('@/views/attendance-management/supplement-card-apply/List'),
            meta: {
              title: '补卡申请',
              icon: 'setting',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/attendance-management/leave-apply',
            name: 'attendance-leave-apply',
            component: () => import('@/views/attendance-management/leave-apply/List'),
            meta: {
              title: '请假申请',
              icon: 'setting',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/attendance-management/face-record',
            name: 'attendance-face-record',
            component: () => import('@/views/attendance-management/face-record/List'),
            meta: {
              title: '人脸打卡记录',
              icon: 'setting',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/attendance-management/attendance-chart',
            name: 'attendance-chart',
            component: RouteView,
            redirect: '/attendance-management/chart/attendance-statistics',
            meta: {
              title: '考勤报表',
              icon: 'line-chart',
              keepAlive: false,
              permission: ['permission']
            },
            children: [{
                path: '/attendance-management/chart/attendance-statistics',
                name: 'attendance-chart-attendance-statistics',
                component: () => import('@/views/attendance-management/chart/AttendanceStatisticsList'),
                meta: {
                  title: '考勤统计',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                }
              },
              {
                path: '/attendance-management/chart/work-meals-statistics',
                name: 'attendance-chart-work-meals-statistics',
                component: () => import('@/views/attendance-management/chart/WorkMealsStatisticsList'),
                meta: {
                  title: '工作餐统计',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                }
              },
            ]
          },
          {
            path: '/attendance-management/attendance-device',
            name: 'attendance-device',
            component: () => import('@/views/attendance-management/attendance-device/List'),
            meta: {
              title: '考勤设备',
              icon: 'setting',
              keepAlive: false,
              permission: ['permission']
            },
          },
        ]
      },
      {
        // 物联卡管理
        path: '/icotcard-management',
        name: 'icotcard-management',
        component: PageView,
        meta: {
          title: '物联网卡管理',
          icon: 'setting',
          permission: ['permission']
        },
        redirect: '/canteen-menu-management/config',
        children: [{
          path: '/icotcard-management/mycard',
          name: 'icotcard-management-mycard',
          component: () => import('@/views/icotcard-management/mycard/List'),
          meta: {
            title: '我的卡片',
            icon: 'setting',
            keepAlive: false,
            permission: ['permission']
          },
        }]
      },
      {
        //研发管理
        path: '/research-managements',
        name: 'research-managements',
        component: PageView,
        meta: {
          title: '研发管理',
          icon: 'shop',
          permission: ['permission']
        },
        redirect: '/research-managements/drawing-managements/permissions',
        children: [{
          path: '/research-managements/drawing-managements',
          name: 'research-managements-drawing-managements',
          component: RouteView,
          meta: {
            title: '图纸管理',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
          children: [{
              path: '/research-managements/drawing-managements/permissions',
              name: 'research-managements-drawing-managements-permissions',
              component: () => import('@/views/research-managements/drawing-managements/permissions/List'),
              meta: {
                title: '图纸权限',
                icon: 'setting',
                keepAlive: false,
                permission: ['permission']
              },
            },
            {
              path: '/research-managements/drawing-managements/management',
              name: 'research-managements-drawing-managements-management',
              component: () => import('@/views/research-managements/drawing-managements/management/List'),
              meta: {
                title: '图纸管理',
                icon: 'profile',
                keepAlive: false,
                permission: ['permission']
              },
            }
          ]
        }]
      },


      {
        //人力资源
        path: '/human_Resources',
        name: 'human_Resources',
        component: PageView,
        meta: {
          title: '人力资源',
          icon: 'user',
          permission: ['permission']
        },
        redirect: '/human_Resources',
        children: [{
            path: '/human_Resources/notice',
            name: 'human_Resources_notice',
            component: () => import('@/views/human_Resources/notice/Notice-List'),
            meta: {
              title: '公告管理',
              icon: 'read',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/human_Resources/security',
            name: 'human_Resources_security',
            component: RouteView,
            meta: {
              title: '社保管理',
              icon: 'audit',
              keepAlive: false,
              permission: ['permission']
            },
            redirect: '/human_Resources/security/Insurance',
            children: [{
                path: '/human_Resources/security/Insurance',
                name: 'human_Resources_Insurance',
                component: () => import('@/views/human_Resources/security/Insurance/Insurance_List'),
                meta: {
                  title: '保险配置',
                  icon: 'audit',
                  keepAlive: false,
                  permission: ['permission']
                },
              },
              {
                path: '/human_Resources/security/social',
                name: 'human_Resources_social',
                component: () => import('@/views/human_Resources/security/social/security_List'),
                meta: {
                  title: '社保',
                  icon: 'audit',
                  keepAlive: false,
                  permission: ['permission']
                },
              },

            ]
          },
          {
            path: '/human_Resources/security/social',
            name: 'humanResourcesSee',
            hidden: true,
            component: () => import('@/views/human_Resources/security/social/See'),
            meta: {
              title: '社保列表',
              permission: ['permission']
            },
          },
          {
            path: '/human_Resources/leagueBuilding',
            name: 'human_Resources_leagueBuilding',
            component: () => import('@/views/human_Resources/leagueBuilding/leagueBuilding_List'),
            meta: {
              title: '团建管理',
              icon: 'usergroup-delete',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/human_Resources/labor_contract',
            name: 'human_Resources_contract',
            component: RouteView,
            meta: {
              title: '劳动合同管理',
              icon: 'solution',
              keepAlive: false,
              permission: ['permission']
            },
            redirect: '/human_Resources/labor_contract/post_allocation',
            children: [{
                path: '/human_Resources/labor_contract/post_allocation',
                name: 'human_Resources_allocation',
                component: () => import('@/views/human_Resources/labor_contract/post_allocation/post_allocation_List'),
                meta: {
                  title: '岗位配置',
                  icon: 'container',
                  keepAlive: false,
                  permission: ['permission']
                },
              },
              {
                path: '/human_Resources/labor_contract/contractAgreement',
                name: 'human_Resources_contractAgreement',
                component: () => import('@/views/human_Resources/labor_contract/contractAgreement/contractAgreement_List'),
                meta: {
                  title: '合同协议管理',
                  icon: 'profile',
                  keepAlive: false,
                  permission: ['permission']
                },
              },
            ]
          },
          {
            path: '/human_Resources/dormitory',
            name: 'human_Resources_dormitory',
            component: RouteView,
            meta: {
              title: '宿舍管理',
              icon: 'solution',
              keepAlive: false,
              permission: ['permission']
            },
            redirect: '/human_Resources/dormitory/electricity',
            children: [{
                path: '/human_Resources/dormitory/electricity',
                name: 'human_Resources_electricity',
                component: () => import('@/views/human_Resources/dormitory/electricity/electricity_List'),
                meta: {
                  title: '房间管理',
                  icon: 'container',
                  keepAlive: false,
                  permission: ['permission']
                },
              },
              {
                path: '/human_Resources/dormitory/personnel',
                name: 'human_Resources_personnel',
                component: () => import('@/views/human_Resources/dormitory/personnel/personnel_List'),
                meta: {
                  title: '人员管理',
                  icon: 'profile',
                  keepAlive: false,
                  permission: ['permission']
                },
              },
              {
                path: '/human_Resources/dormitory/room',
                name: 'human_Resources_room',
                component: () => import('@/views/human_Resources/dormitory/room/room_List'),
                meta: {
                  title: '电费管理',
                  icon: 'profile',
                  keepAlive: false,
                  permission: ['permission']
                },
              },
              {
                path: '/human_Resources/dormitory/securityHealth',
                name: 'human_Resources_securityHealth',
                component: () => import('@/views/human_Resources/dormitory/securityHealth/securityHealth_List'),
                meta: {
                  title: '安全卫生考核',
                  icon: 'profile',
                  keepAlive: false,
                  permission: ['permission']
                },
              },
            ]
          },
          {
            // 资产管理
            path: '/human_Resources/asset-management',
            name: 'asset-management',
            component: RouteView,
            meta: {
              title: '资产管理',
              icon: 'setting',
              permission: ['permission']
            },
            children: [{
                path: '/human_Resources/asset-management/mine',
                name: 'asset-management-mine',
                component: () => import('@/views/asset-management/mine/List'),
                meta: {
                  title: '我的资产',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                },
              },
              {
                path: '/human_Resources/asset-management/search',
                name: 'asset-management-search',
                component: () => import('@/views/asset-management/search/List'),
                meta: {
                  title: '查询资产',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                },
              },
              {
                path: '/human_Resources/asset-management/management',
                name: 'asset-management-management',
                component: () => import('@/views/asset-management/management/List'),
                meta: {
                  title: '管理资产',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                },
              },
              {
                path: '/human_Resources/asset-management/record',
                name: 'asset-management-record',
                component: () => import('@/views/asset-management/record/List'),
                meta: {
                  title: '维修申请记录',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                },
              },
              {
                path: '/human_Resources/asset-management/inventory-record-cycle',
                name: 'asset-management-inventory-record-cycle',
                component: () => import('@/views/asset-management/inventory-record-cycle/List'),
                meta: {
                  title: '资产盘点周期',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                },
              },
              {
                path: '/human_Resources/asset-management/inventory-record',
                name: 'asset-management-inventory-record',
                component: () => import('@/views/asset-management/inventory-record/List'),
                meta: {
                  title: '资产盘点记录',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                },
              }
            ]
          },

          {
            //通讯管理
            path: '/communication-management',
            name: 'communication-management',
            component: RouteView,
            meta: {
              title: '通讯管理',
              icon: 'phone',
              permission: ['permission']
            },
            redirect: '/communication-management/settings',
            children: [{
                path: '/communication-management/settings',
                name: 'communication-management-settings',
                component: () => import('@/views/communication-management/settings/List'),
                meta: {
                  title: '通讯设置',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                },
              },
              {
                path: '/communication-management/phone-number',
                name: 'communication-management-phone-number',
                component: () => import('@/views/communication-management/phone-number/List'),
                meta: {
                  title: '手机号管理',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                },
              },
              {
                path: '/communication-management/consume',
                name: 'communication-management-consume',
                component: () => import('@/views/communication-management/consume/List'),
                meta: {
                  title: '消费详情',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                },
              },
              {
                path: '/communication-management/account',
                name: 'communication-management-account',
                component: () => import('@/views/communication-management/account/List'),
                meta: {
                  title: '账号管理',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                },
              },
              {
                path: '/communication-management/group-leader',
                name: 'communication-management-group-leader',
                component: () => import('@/views/communication-management/group-leader/List'),
                meta: {
                  title: '群主管理',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                },
              }
            ]
          },





          {
            //制度文档管理
            path: '/files-management',
            name: 'files-management',
            component: RouteView,
            meta: {
              title: '制度文档管理',
              icon: 'file',
              permission: ['permission']
            },
            redirect: '/files-management/list',
            children: [{
              path: '/files-management/list',
              name: 'files-management-list',
              component: () => import('@/views/files-management/List'),
              meta: {
                title: '制度文档管理',
                icon: 'file',
                keepAlive: false,
                permission: ['permission']
              },
            }]
          },



          {
            //食堂菜单管理
            path: '/canteen-menu-management',
            name: 'canteen-menu-management',
            component: RouteView,
            meta: {
              title: '食堂菜单管理',
              icon: 'shop',
              permission: ['permission']
            },
            redirect: '/canteen-menu-management/config',
            children: [{
                path: '/canteen-menu-management/config',
                name: 'canteen-menu-management-config',
                component: () => import('@/views/canteen-menu-management/config/List'),
                meta: {
                  title: '食堂菜单',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission']
                },
              },
              {
                path: '/canteen-menu-management/record',
                name: 'canteen-menu-management-record',
                component: () => import('@/views/canteen-menu-management/record/List'),
                meta: {
                  title: '菜单记录',
                  icon: 'profile',
                  keepAlive: false,
                  permission: ['permission']
                },
              },
              {
                path: '/canteen-menu-management/evaluate',
                name: 'canteen-menu-management-evaluate',
                component: () => import('@/views/canteen-menu-management/evaluate/List'),
                meta: {
                  title: '满意度调查',
                  icon: 'file-done',
                  keepAlive: false,
                  permission: ['permission']
                },
              }
            ]
          },



          {
            // 福利管理
            path: '/welfare-management',
            name: 'welfare-management',
            component: RouteView,
            meta: {
              title: '福利管理',
              icon: 'setting',
              permission: ['permission']
            },
            children: [{
                path: '/welfare-management/healthy',
                name: 'welfare-management-healthy',
                component: RouteView,
                meta: {
                  title: '健康管理',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission'],
                },
                children: [{
                    path: '/welfare-management/healthy/config',
                    name: 'welfare-management-healthy-config',
                    component: () => import('@/views/welfare-management/healthy/config/List'),
                    meta: {
                      title: '体检设置',
                      icon: 'setting',
                      keepAlive: false,
                      permission: ['permission']
                    },
                  },
                  {
                    path: '/welfare-management/healthy/cycle-config',
                    name: 'welfare-management-healthy-cycle-config',
                    component: () => import('@/views/welfare-management/healthy/cycle-config/List'),
                    meta: {
                      title: '体检周期设置',
                      icon: 'setting',
                      keepAlive: false,
                      permission: ['permission']
                    },
                  },
                  {
                    path: '/welfare-management/healthy/management',
                    name: 'welfare-management-healthy-management',
                    component: () => import('@/views/welfare-management/healthy/management/List'),
                    meta: {
                      title: '体检管理',
                      icon: 'setting',
                      keepAlive: false,
                      permission: ['permission']
                    },
                  }
                ]
              },
              {
                path: '/welfare-management/employee-care',
                name: 'welfare-management-employee-care',
                component: RouteView,
                meta: {
                  title: '员工关怀',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission'],
                },
                children: [{
                    path: '/welfare-management/employee-care/config',
                    name: 'welfare-management-employee-care-config',
                    component: () => import('@/views/welfare-management/employee-care/config/List'),
                    meta: {
                      title: '关怀设置',
                      icon: 'setting',
                      keepAlive: false,
                      permission: ['permission']
                    },
                  },
                  {
                    path: '/welfare-management/employee-care/config-record',
                    name: 'welfare-management-employee-care-config-record',
                    component: () => import('@/views/welfare-management/employee-care/config-record/List'),
                    meta: {
                      title: '关怀设置修改记录',
                      icon: 'setting',
                      keepAlive: false,
                      permission: ['permission']
                    },
                  }
                ]
              },

              {
                path: '/welfare-management/holiday-gifts',
                name: 'welfare-management-holiday-gifts',
                component: RouteView,
                meta: {
                  title: '过节礼品',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission'],
                },
                children: [{
                    path: '/welfare-management/holiday-gifts/config',
                    name: 'welfare-management-holiday-gifts-config',
                    component: () => import('@/views/welfare-management/holiday-gifts/config/List'),
                    meta: {
                      title: '礼品标准',
                      icon: 'setting',
                      keepAlive: false,
                      permission: ['permission']
                    },
                  },
                  {
                    path: '/welfare-management/holiday-gifts/money-config',
                    name: 'welfare-management-holiday-gifts-money-config',
                    component: () => import('@/views/welfare-management/holiday-gifts/money-config/List'),
                    meta: {
                      title: '过节费标准',
                      icon: 'setting',
                      keepAlive: false,
                      permission: ['permission']
                    },
                  },
                  {
                    path: '/welfare-management/holiday-gifts/money-config-record',
                    name: 'welfare-management-holiday-gifts-money-config-record',
                    component: () => import('@/views/welfare-management/holiday-gifts/money-config-record/List'),
                    meta: {
                      title: '过节费修改记录',
                      icon: 'setting',
                      keepAlive: false,
                      permission: ['permission']
                    }
                  },
                ]
              },
              {
                path: '/welfare-management/welfare',
                name: 'welfare-management-welfare',
                component: RouteView,
                meta: {
                  title: '福利',
                  icon: 'setting',
                  keepAlive: false,
                  permission: ['permission'],
                },
                children: [{
                    path: '/welfare-management/welfare/config',
                    name: 'welfare-management-welfare-config',
                    component: () => import('@/views/welfare-management/welfare/config/List'),
                    meta: {
                      title: '生日福利标准',
                      icon: 'setting',
                      keepAlive: false,
                      permission: ['permission']
                    },
                  },
                  {
                    path: '/welfare-management/welfare/birthday-config',
                    name: 'welfare-management-welfare-birthday-config',
                    component: () => import('@/views/welfare-management/welfare/birthday-config/List'),
                    meta: {
                      title: '生日福利管理',
                      icon: 'setting',
                      keepAlive: false,
                      permission: ['permission']
                    },
                  },
                  {
                    path: '/welfare-management/welfare/annual-meeting-config',
                    name: 'welfare-management-welfare-annual-meeting-config',
                    component: () => import('@/views/welfare-management/welfare/annual-meeting-config/List'),
                    meta: {
                      title: '年会福利管理',
                      icon: 'setting',
                      keepAlive: false,
                      permission: ['permission']
                    },
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        //物流管理
        path: '/distribution-management',
        name: 'distribution-management',
        component: PageView,
        meta: {
          title: '物流管理',
          icon: 'shop',
          permission: ['permission']
        },
        redirect: '/distribution-management',
        children: [{
            path: '/distribution-management/Distribution',
            name: 'distribution_Distribution',
            component: () => import('@/views/distribution-management/Distribution/Distribution_List'),
            meta: {
              title: '配货站信息登记',
              icon: 'select',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/distribution-management/logistics',
            name: 'distribution_logistics',
            component: () => import('@/views/distribution-management/logistics/logistics_List'),
            meta: {
              title: '物流信息登记',
              icon: 'select',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/distribution-management/logistics/module',
            name: 'basicInform',
            hidden: true,
            component: () => import('@/views/distribution-management/logistics/module/AddForm'),
            meta: {
              title: '新增物流信息登记',
              permission: ['permission']
            },
          }
        ]
      },
      {
        //培训管理
        path: '/training-management',
        name: 'training-management',
        component: PageView,
        meta: {
          title: '培训管理',
          icon: 'shop',
          permission: ['permission']
        },
        redirect: '/training-management',
        children: [{
            path: '/training-management/training_materials',
            name: 'training-management_materials',
            component: () => import('@/views/training-management/training_materials/materials_List'),
            meta: {
              title: '培训资料',
              icon: 'select',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/training-management/dispersed',
            name: 'training-management_dispersed',
            component: () => import('@/views/training-management/dispersed/dispersed_List'),
            meta: {
              title: '分散培训',
              icon: 'select',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/training-management/focus',
            name: 'training-management_focus',
            component: () => import('@/views/training-management/focus/focus_List'),
            meta: {
              title: '集中培训',
              icon: 'select',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/training-management/annual_programme',
            name: 'training-management_programme',
            component: () => import('@/views/training-management/annual_programme/annual_List'),
            meta: {
              title: '年度培训方案',
              icon: 'select',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/training-management/my_information',
            name: 'training-management_information',
            component: () => import('@/views/training-management/my_information/information_List'),
            meta: {
              title: '我的培训资料',
              icon: 'select',
              keepAlive: false,
              permission: ['permission']
            },
          },
          {
            path: '/training-management/my_training',
            name: 'training-management_training',
            component: () => import('@/views/training-management/my_training/training_List'),
            meta: {
              title: '我的培训',
              icon: 'select',
              keepAlive: false,
              permission: ['permission']
            },
          }

        ]
      },
      {
        //薪酬管理
        path: '/salary-management',
        name: 'salary-management',
        component: PageView,
        meta: {
          title: '薪酬管理',
          icon: 'shop',
          permission: ['permission']
        },
        redirect: '/salary-management',
        children: [{
          path: '/salary-management/bonus',
          name: 'salary-management_bonus',
          component: RouteView,
          meta: {
            title: '奖金管理',
            icon: 'select',
            keepAlive: false,
            permission: ['permission']
          },
          children: [{
              path: '/salary-management/bonus/bonusRules',
              name: 'salary-management_bonusRules',
              component: RouteView,
              meta: {
                title: '奖金规则',
                icon: 'select',
                keepAlive: false,
                permission: ['permission']
              },
              children: [{
                  path: '/salary-management/bonus/bonusRules/research',
                  name: 'bonusRules_research',
                  component: () => import('@/views/salary-management/bonus/bonusRules/research/research_List'),
                  meta: {
                    title: '研发提成奖金规则',
                    icon: 'select',
                    keepAlive: false,
                    permission: ['permission']
                  },
                },
                {
                  path: '/salary-management/bonus/bonusRules/overtime',
                  name: 'bonusRules_overtime',
                  component: () => import('@/views/salary-management/bonus/bonusRules/overtime/overtime_List'),
                  meta: {
                    title: '加班奖金规则',
                    icon: 'select',
                    keepAlive: false,
                    permission: ['permission']
                  },
                },
                {
                  path: '/salary-management/bonus/bonusRules/attendance',
                  name: 'bonusRules_attendance',
                  component: () => import('@/views/salary-management/bonus/bonusRules/attendance/attendance_List'),
                  meta: {
                    title: '全勤奖金规则',
                    icon: 'select',
                    keepAlive: false,
                    permission: ['permission']
                  },
                }
              ]
            },
            {
              path: '/salary-management/bonus/year_end_bonus',
              name: 'salary_year_bonus',
              component: () => import('@/views/salary-management/bonus/year_end_bonus/year_end_bonus_List'),
              meta: {
                title: '年终奖金',
                icon: 'select',
                keepAlive: false,
                permission: ['permission']
              },
            },
            // {
            //   path: '/salary-management/logistics/module',
            //   name: 'basicInform',
            //   hidden: true,
            //   component: () => import('@/views/salary-management/logistics/module/AddForm'),
            //   meta: {
            //     title: '新增物流信息登记',
            //     permission: ['permission']
            //   },
            // }
          ]
        }, ]
      },
    ]
  }
]

/**
 * 基础路由
 * 所有角色都可以訪問到的
 * @type { *[] }
 */
export const constantRouterMap = [{
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [{
        path: 'login',
        name: 'login',
        component: () => import( /* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import( /* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import( /* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },
  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [{
      path: 'home',
      name: 'TestHome',
      component: () => import('@/views/Home')
    }]
  },
  {
    path: '/404',
    hideInMenu: true,
    component: () => import( /* webpackChunkName: "fail" */ '@/views/exception/404')
  },
  {
    path: '/PrivacyPolicy',
    /* 隐私政策 */
    component: BlankLayout,
    children: [{
      path: '/PrivacyPolicy',
      name: 'PrivacyPolicy',
      component: () => import('@/views/PrivacyPolicy')
    }]
  }
]

// 前端未找到页面路由（固定不用改）
export const notFoundRouter = {
  path: '*',
  redirect: '/404',
  hidden: true
}
