<template>
    <div class="panel-img">
        <head-bar title="保存图片"></head-bar>
        <span v-if="is_weixn">可长按保存图片到本地</span>
        <span v-else><a :href="imgUrl" download="image.png" target="_blank">点击保存图片</a></span>
        <img :src="imgUrl" alt="">
    </div>
</template>
<script>
import { is_weixn } from "@/utils/common";
import headBar from "@/components/headBar.vue";
export default {
    components: { headBar },
    computed: {
        imgUrl() {
            return window.localStorage.getItem('Panel_imgUrl')
        },
        is_weixn() {
            return is_weixn()
        }
    },
    mounted() {
        console.log(this.is_weixn, '是否是微信')
    }
}
</script>
<style scoped>
.panel-img {
    text-align: center;
    font-size: 15px;
    color: gray;
    padding-top: 30px;
}
img {
    width: 80%;
    display: block;
    margin: 5px auto;
}
</style>