<template>
    <van-tabbar route :fixed="isFixed">
        <van-tabbar-item replace to="/home" icon="home-o">首页</van-tabbar-item>
        <van-tabbar-item replace to="/happy" icon="fire-o">功能</van-tabbar-item>
        <van-tabbar-item replace to="/mine" icon="contact">我的</van-tabbar-item>
    </van-tabbar>
</template>
<script>
export default {
    data () {
        return {
            isFixed: true
        }
    }
}
</script>