<template>
    <div>
        <van-form @submit="onSubmit" style="text-align:center;">
            <head-bar title="登录"></head-bar>
            <img style="width:60%;margin:0 auto;" src="../assets/timg.gif" alt="">
            <van-field
                v-model="username"
                name="username"
                label="用户名"
                placeholder="用户名"
                :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
                v-model="password"
                type="password"
                name="password"
                label="密码"
                placeholder="密码"
                :rules="[{ required: true, message: '请填写密码' }]"
            />
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">
                登录
                </van-button>
            </div>
        </van-form>
        <div style="margin: 16px;">
            <van-button round block @click="userReg">
            注册
            </van-button>
        </div>
        <foot-bar></foot-bar>
    </div>
</template>
<script>
import footBar from "@/components/footBar.vue";
import headBar from "@/components/headBar.vue";
import { login, reg } from "@/http/api.js";
export default {
    name: 'Login',
    components: {
        footBar,
        headBar
    },
    data() {
        return {
            username: '',
            password: ''
        };
    },
    methods: {
        onSubmit(values) {
            console.log('submit', values);
            login({
                username: values.username,
                password: values.password
            }).then(res => {
                console.log(res)
                // 将token存在localStorage-过期或关闭窗口即失效
                window.localStorage.setItem('token', res.token)
                this.$store.commit('setToken', res.token)
                const user_id = res.userInfo.id
                window.localStorage.setItem('user_id', user_id)
                this.$router.push({ name: 'Mine', params: { user_id }})
            }).catch(err => {
                console.log(err)
            })
        },
        userReg() {
            this.$router.push('/reg')
        }
    },
};
</script>