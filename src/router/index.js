import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import('../views/Home.vue') // 路由懒加载
const Login = () => import('../views/Login.vue')
const Edit = () => import('../views/Edit.vue')

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
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/edit',
            name: 'Edit',
            component: Edit
        }
    ]
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
    // // 如果用户输入的是login页面 直接放行
    // if (to.path === '/login') return next()
    // // 查看客户端是否有token值
    // const tokenStr = window.sessionStorage.getItem('token')
    // // 如果没有token 则直接跳转到登录页
    // if (!tokenStr) return next('/login')
    // // 有token放行
    next()
})

export default router
