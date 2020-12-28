<template>
    <div>
        <head-bar title="我的"></head-bar>
        user_id：{{userInfo.user_id}}
        name：{{userInfo.username}}
        createdate{{userInfo.createdate}}
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
            userInfo: null
        }
    },
    mounted() {
        // 获取路由参数
        console.log(this.$route)
        this.user_id = this.$route.params.user_id ? this.$route.params.user_id : window.sessionStorage.getItem('user_id')
        getMineInfo({
            user_id: this.user_id
        }).then(res => {
            console.log(res)
            this.userInfo = res.result[0]
        }).catch(err => {
            console.log(err)
        })
    }
}
</script>