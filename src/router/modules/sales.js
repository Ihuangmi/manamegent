/** When your routing sales is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/sales',
  component: Layout,
  redirect: '/sales/users',
  name: 'Table',
  meta: {
    title: '销售',
    icon: 'nested',
    roles: ['superuser', 'editor', 'sales']
  },
  children: [
    {
      path: 'users',
      component: () => import('@/views/sales/users'),
      name: 'UsersTable',
      meta: { title: '用户信息', icon: 'people' }
    },
    {
      path: 'accounts',
      component: () => import('@/views/sales/accounts'),
      name: 'AccountsTable',
      meta: { title: '关联账户', icon: 'link' }
    },
    // {
    //   path: 'signalman',
    //   component: () => import('@/views/sales/signalman'),
    //   name: 'SignalmanTable',
    //   meta: { title: '信号员表', icon: 'message' }
    // },
    {
      path: 'documentary',
      component: () => import('@/views/sales/documentary'),
      name: 'DocumentTable',
      meta: { title: '跟单表', icon: 'clipboard' }
    }
  ]
}
export default tableRouter
