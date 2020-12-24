import Layout from '@/layout'

const tableRouter = {
    path: '/financial',
    component: Layout,
    redirect: '/financial/users',
    name: 'Financial',
    meta: {
        title: '财务',
        icon: 'lock',
        roles: ['superuser', 'financial']
    },
    children: [
        {
            path: 'users',
            component: () => import('@/views/financial/users'),
            name: 'usersFinancial',
            meta: { title: '用户信息', icon: 'people' }
        },
        {
            path: 'accounts',
            component: () => import('@/views/financial/accounts'),
            name: 'accounts',
            meta: { title: '关联账户', icon: 'link' }
        },
        {
            path: 'operation',
            component: () => import('@/views/financial/operation'),
            name: 'operation',
            meta: { title: '用户操作表', icon: 'clipboard' }
        },
        {
            path: 'extract',
            component: () => import('@/views/financial/extract'),
            name: 'extract',
            meta: { title: '用户充值提取信息', icon: 'people' }
        },
        {
            path: 'frozen',
            component: () => import('@/views/financial/frozen'),
            name: 'frozen',
            meta: { title: '冻结钱包记录', icon: 'link' }
        },
        {
            path: 'orders',
            component: () => import('@/views/financial/orders'),
            name: 'orders',
            meta: { title: '订单表', icon: 'clipboard' }
        },
        {
            path: 'purse',
            component: () => import('@/views/financial/purse'),
            name: 'purse',
            meta: { title: '平台钱包', icon: 'people' }
        },
        // {
        //     path: 'refund',
        //     component: () => import('@/views/financial/refund'),
        //     name: 'refund',
        //     meta: { title: '订单退款表', icon: 'link' }
        // },
        {
            path: 'transaction',
            component: () => import('@/views/financial/transaction'),
            name: 'transaction',
            meta: { title: '用户交易报告', icon: 'clipboard' }
        }
    ]
}
export default tableRouter
