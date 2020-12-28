<template>
    <van-form @submit="onSubmit" style="text-align:center;">
        <head-bar title="注册"></head-bar>
        <!-- <img src="../assets/timg.gif" alt=""> -->
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
            提交
            </van-button>
        </div>
        <foot-bar></foot-bar>
    </van-form>
</template>
<script>
import footBar from "@/components/footBar.vue";
import headBar from "@/components/headBar.vue";
import { Toast, Dialog } from 'vant';
import {  reg } from "@/http/api.js";
export default {
    name: 'Reg',
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
            reg({
                username: values.username,
                password: values.password
            }).then(res => {
                console.log(res)
                if (res.code !== 200) {
                    Toast(res.message)
                } else {
                    Dialog.confirm({ title: res.message, message: '是否前往登录' }).then(() => {
                        this.$router.push('/login')
                    });
                }
            }).catch(err => {
                console.log(err)
                Toast(err.message);
            })
        },
    },
};
</script>