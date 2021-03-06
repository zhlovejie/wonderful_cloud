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


import routerDashboard from '@/router/router-dashboard'
import systemSetting from '@/router/router-system-setting'
import salesManagement from '@/router/router-sales-management'
import production from '@/router/router-production'
import personnelManagement from '@/router/router-personnel-management'
import productOfferManagement from '@/router/router-product-offer-management'
import workReportManagement from '@/router/router-work-report-management'
import meetingManagement from '@/router/router-meeting-management'
import attendanceManagement from '@/router/router-attendance-management'
import icotcardManagement from '@/router/router-icotcard-management'
import researchManagements from '@/router/router-research-managements'
import humanResources from '@/router/router-human_resources'
import distributionManagement from '@/router/router-distribution-management'
import vehicleManagement from '@/router/router-vehicle-management'
import contingencyManagement from '@/router/router-contingency-management'
import trainingManagement from '@/router/router-training-management'
import salaryManagemen from '@/router/router-salary-management'
import accessControl from '@/router/router-access_control'



const __ROUTER_MAP__ = [
  routerDashboard, //仪表盘
  systemSetting, //系统设置
  salesManagement, //销售管理
  production, //生产管理
  personnelManagement, //人事管理
  productOfferManagement, //产品报价管理
  workReportManagement, //工作上报管理
  meetingManagement, //会议管理
  attendanceManagement, //考勤管理
  icotcardManagement, //物联卡管理
  researchManagements, //研发管理
  humanResources, //人力资源
  distributionManagement, //物流管理
  vehicleManagement, //车辆管理
  contingencyManagement, //应急管理
  trainingManagement, //培训管理
  salaryManagemen, // 薪酬管理
  accessControl, //门禁管理
]
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
      ...__ROUTER_MAP__
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
