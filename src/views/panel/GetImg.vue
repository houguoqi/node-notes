<template>
    <div class="panel-img">
        <span>可长按保存图片到本地</span>
        <img :src="imgUrl" alt="">
    </div>
</template>
<script>
export default {
    computed: {
        imgUrl() {
            return window.localStorage.getItem('Panel_imgUrl')
        }
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