<template>
    <div>
        <head-bar title="我的"></head-bar>
        name：{{userInfo.username}}
        createdate{{userInfo.createdate}}
         <div style="margin: 16px;">
            <van-button round block type="info" @click="createBlog">
            发表
            </van-button>
        </div>
        <van-grid clickable :column-num="3">
            <van-grid-item>
                <van-icon name="chat-o" size="40px" color="#1989fa" />
                <span>记事本</span>
            </van-grid-item>
              <van-grid-item>
                <van-icon name="chat-o" size="40px" color="#1989fa" />
                <span>记事本</span>
            </van-grid-item>
              <van-grid-item>
                <van-icon name="chat-o" size="40px" color="#1989fa" />
                <span>记事本</span>
            </van-grid-item>
              <van-grid-item>
                <van-icon name="chat-o" size="40px" color="#1989fa" />
                <span>记事本</span>
            </van-grid-item>  <van-grid-item>
                <van-icon name="chat-o" size="40px" color="#1989fa" />
                <span>记事本</span>
            </van-grid-item>
              <van-grid-item>
                <van-icon name="chat-o" size="40px" color="#1989fa" />
                <span>记事本</span>
            </van-grid-item>
        </van-grid>
        <foot-bar></foot-bar>
    </div>
</template>
<script>
import footBar from "@/components/footBar.vue";
import headBar from "@/components/headBar.vue";
import { getMineInfo } from "@/http/api.js";
export default {
    name: 'Mine',
    components: {
        footBar,
        headBar
    },
    data () {
        return {
            user_id: '',
            userInfo: {}
        }
    },
    mounted() {
        // 获取路由参数
        console.log(this.$route)
        this.user_id = this.$route.params.user_id ? this.$route.params.user_id : window.sessionStorage.getItem('user_id')
        // this.user_id = window.sessionStorage.getItem('user_id')
        getMineInfo({
            user_id: this.user_id
        }).then(res => {
            console.log(res)
            this.userInfo = res.result[0]
        }).catch(err => {
            console.log(err)
        })
    },
    methods: {
        createBlog() {
            this.$router.push({
                name: 'Edit',
                params: {
                    user_id: this.user_id
                }
            })
        }
    }
}
</script>