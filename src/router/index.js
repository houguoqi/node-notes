import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import('../views/Home.vue') // 路由懒加载
const Login = () => import('../views/Login.vue')
const Reg = () => import('../views/Reg.vue')
const Mine = () => import('../views/Mine.vue')
const Edit = () => import('../views/Edit.vue')
const Chat = () => import('../views/wsChat/Chat.vue')

Vue.use(Router)

const router = new Router({
    // mode: 'history', // 使用history模式(但有可能404)
    routes: [
        {
            path: '/',
            redirect: '/home' // 通过 redirect是属性，可以实现前端路由的重定向 如果访问的是 根路径 就会跳转到指定路径
        },
        {
            path: '/home',
            name: 'Home',
            component: Home
        },
        {
            path: '/mine',
            name: 'Mine',
            component: Mine
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/reg',
            name: 'Reg',
            component: Reg
        },
        {
            path: '/edit',
            name: 'Edit',
            component: Edit
        },
        {
            path: '/chat',
            name: 'Chat',
            component: Chat
        }
    ]
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
    // 如果用户输入的是login页面 直接放行
    if (to.path === '/login') return next()
    if (to.path === '/reg') return next()
    // 查看客户端是否有token值
    const tokenStr = window.localStorage.getItem('token')
    // 如果没有token 则直接跳转到登录页
    if (!tokenStr) return next('/login')
    // 有token放行
    next()
})

export default router
