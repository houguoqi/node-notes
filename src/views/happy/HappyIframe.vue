<template>
    <div>
        <head-bar title="功能"></head-bar>
        <div class="video-audio">
            <div @click="enterIframe('video')">
                <van-icon name="tv-o" size="36" color="rgb(241 137 77)" />
                <p>电影</p>
            </div>
            <div @click="enterIframe('audio')">
                <van-icon name="service-o" size="36" color="rgb(20 210 26)" />
                <p>音乐</p>
            </div>
            <!-- <div @click="enterIframe('video')">
                <van-icon name="tv-o" size="30" color="#1989fa" />
                <p>电影</p>
            </div>
            <div @click="enterIframe('audio')">
                <van-icon name="service-o" size="30" color="#1989fa" />
                <p>音乐</p>
            </div> -->
        </div>
        <foot-bar></foot-bar>
    </div>
</template>
<script>
import footBar from "@/components/footBar.vue";
import headBar from "@/components/headBar.vue";
export default {
    name: 'HappyIframe',
    components: {
        footBar, headBar
    },
    data() {
        return {

        }
    },
    mounted() {},
    methods: {
        enterIframe(type) {
            switch (type) {
                case 'video':
                    // 艾拉拉影视
                    window.location.href = 'http://www.iaila.com/'
                    break;
                case 'audio':
                    // 免费下载歌曲
                    window.location.href = 'https://music.sonimei.cn/?name=AINY%E9%82%93%E7%B4%AB%E6%A3%8B&type=netease'
                    break;
                default:
                    break;
            }
        }
    }
}
</script>
<style lang="less" scoped>
.video-audio {
    padding: 20px;
    text-align: center;
    div {
        width: 50%;
        margin-bottom: 25px;
        float: left;
        p {
            color: #9c9c9c;
            font-size: 15px;
        }
    }
}
</style>