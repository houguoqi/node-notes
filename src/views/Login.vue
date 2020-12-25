<template>
    <van-form @submit="onSubmit" style="text-align:center;">
        <van-nav-bar
            title="登录"
            left-text="返回"
            left-arrow
            fixed="true"
            placeholder="true"
        />
        <img src="../assets/timg.gif" alt="">
        <van-field
            v-model="username"
            name="用户名"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
            v-model="password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit">
            提交
            </van-button>
        </div>
        <van-tabbar route fixed="true">
            <van-tabbar-item replace to="/home" icon="home-o">标签</van-tabbar-item>
            <van-tabbar-item replace to="/login" icon="search">标签</van-tabbar-item>
        </van-tabbar>
    </van-form>
</template>
<script>
export default {
    data() {
        return {
            username: '',
            password: '',
        };
    },
    methods: {
        onSubmit(values) {
            console.log('submit', values);
        },
    },
};
</script>