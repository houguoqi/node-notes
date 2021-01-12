<template>
    <div>
        <head-bar title="功能"></head-bar>
        <div class="video-audio">
            <van-grid :column-num="2">
                <van-grid-item @click="enterIframe('video')" icon="tv-o" text="电影" />
                <van-grid-item @click="enterIframe('audio')" icon="service-o" text="音乐" />
            </van-grid>
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
                    window.location.href = 'http://www.iaila.com/'
                    break;
                case 'audio':
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
}
</style>