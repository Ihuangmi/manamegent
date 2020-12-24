import Layout from '@/layout'

const tableRouter = {
    path: '/market',
    component: Layout,
    redirect: '/market/users',
    name: 'Market',
    meta: {
        title: '市场',
        icon: 'tree',
        roles: ['superuser', 'market']
    },
    children: [
        {
            path: 'users',
            component: () => import('@/views/market/users'),
            name: 'UsersMarket',
            meta: { title: '用户信息', icon: 'people' }
        },
        {
            path: 'accounts',
            component: () => import('@/views/market/accounts'),
            name: 'AccountsMarket',
            meta: { title: '关联账户', icon: 'link' }
        },
        {
            path: 'platform',
            component: () => import('@/views/market/platform'),
            name: 'PlatformMarket',
            meta: { title: '平台商表', icon: 'message' }
        },
        {
            path: 'sort',
            component: () => import('@/views/market/sort'),
            name: 'SortMarket',
            meta: { title: '用户选择排序信息表', icon: 'link' }
        },
        {
            path: 'extract',
            component: () => import('@/views/market/extract'),
            name: 'extract',
            meta: { title: '用户充值提取信息', icon: 'people' }
        },
        {
            path: 'documentary',
            component: () => import('@/views/market/documentary'),
            name: 'documentMarket',
            meta: { title: '跟单表', icon: 'clipboard' }
        },
        {
            path: 'news',
            component: () => import('@/views/market/news'),
            name: 'NewsMarket',
            meta: { title: '新闻表', icon: 'clipboard' }
        },
        {
            path: 'orders',
            component: () => import('@/views/market/orders'),
            name: 'OrdersMarket',
            meta: { title: '订单表', icon: 'message' }
        }
    ]
}
export default tableRouter
