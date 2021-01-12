import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import('../views/Home.vue') // 路由懒加载
const Login = () => import('../views/Login.vue')
const Reg = () => import('../views/Reg.vue')
const Mine = () => import('../views/Mine.vue') // 个人中心
const Edit = () => import('../views/Edit.vue') // 图文发表
const VideoUpload = () => import('../views/VideoUpload.vue') // 视频发表
const VideoDetail = () => import('../views/VideoDetail.vue') // 视频详情
const Chat = () => import('../views/wsChat/Chat.vue') // 聊天室
const Panel = () => import('../views/panel/Panel.vue') // 画板
const GetImg = () => import('../views/panel/GetImg.vue') // 保存画板图片
const MySave = () => import('../views/MySave.vue') // 保存画板图片
const HeadUrl = () => import('../views/HeadUrl.vue') // 上传头像
const HappyIframe = () => import('../views/happy/HappyIframe.vue') // 功能


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
            path: '/video_edit',
            name: 'VideoUpload',
            component: VideoUpload
        },
        {
            path: '/video_detail',
            name: 'VideoDetail',
            component: VideoDetail
        },
        {
            path: '/chat',
            name: 'Chat',
            component: Chat
        },
        {
            path: '/panel',
            name: 'Panel',
            component: Panel
        },
        {
            path: '/panel_img',
            name: 'GetImg',
            component: GetImg
        },
        {
            path: '/mysave',
            name: 'MySave',
            component: MySave
        },
        {
            path: '/headurl',
            name: 'HeadUrl',
            component: HeadUrl
        },
        {
            path: '/happy',
            name: 'HappyIframe',
            component: HappyIframe
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
