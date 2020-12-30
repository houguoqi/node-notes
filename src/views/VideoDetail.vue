<template>
    <div>
        <head-bar title="视频详情"></head-bar>
        <div class="blog-list-box">
            <div class="acvtor"><img src="../assets/timg.gif" alt=""></div>
            <div class="blog-content">
                <div class="name">{{detail.blog_title}}</div>
                <div class="content">{{detail.blog_content}}</div>
                <div class="img-list">
                    <!-- 解决视频不自动播放 -->
                    <video muted :src="detail.video" autoplay loop controls>
                        <source :src="detail.video">
                    </video>
                </div>
                <div class="createdate">{{detail.createdate}}</div>
            </div>
        </div>
        <foot-bar></foot-bar>
    </div>
</template>
<script>
import footBar from "@/components/footBar.vue";
import headBar from "@/components/headBar.vue";
export default {
    name: 'VideoDetail',
    components: {
        footBar,
        headBar
    },
    data () {
        return {
            detail: {}
        }
    },
    mounted() {
        // 视频信息存在本地
        console.log(this.$route.params)
        if (this.$route.params && this.$route.params.blog_id) {
            window.sessionStorage.setItem('videoDetail', JSON.stringify(this.$route.params))
        }
        this.detail = JSON.parse(window.sessionStorage.getItem('videoDetail'))
        console.log(this.detail)
    }
}
</script>
<style scoped>
.blog-list-box {
    width: 95%;
    margin: 20px auto;
    overflow: hidden;
}
.blog-list-box .acvtor {
    width: 15%;
    float: left;
}
.blog-list-box .acvtor img {
    width: 100%;
}
.blog-list-box .blog-content {
    width: 80%;
    float: right;
}
.blog-list-box .blog-content .name {
    font-size: 16px;
    font-weight: bold;
    color: rgb(156, 124, 19);
}
.blog-list-box .blog-content .createdate {
    font-size: 15px;
    font-weight: lighter;
    color: gray;
}
.blog-list-box .blog-content .img-list {
    width: 100%;
    position: relative;
}
.blog-content .img-list img{
    width: 30%;
    margin: 1%;
}
.blog-content .img-list video {
    width: 75%;
}
.img-list .play-btn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>