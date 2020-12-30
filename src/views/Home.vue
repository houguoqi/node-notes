<template>
    <div class="home">
        <head-bar title="首页"></head-bar>
        <form action="/">
            <van-search
                v-model="value"
                show-action
                placeholder="请输入搜索关键词"
                background="#ffda19"
                @search="onSearch"
                @cancel="onCancel"
            />
        </form>
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            >
            <div class="blog-list-box" v-for="(item, index) in list" :key="index">
                <div class="acvtor"><img src="../assets/timg.gif" alt=""></div>
                <div class="blog-content">
                    <div class="name">{{item.blog_title}}</div>
                    <div class="content">{{item.blog_content}}</div>
                    <div class="img-list" v-if="item.photos && item.photos.length">
                        <img class="blog_photos" v-for="(img, img_index) in item.photos" :key="img_index" :src="img" alt="">
                    </div>
                    <div class="img-list" v-else-if="item.video">
                        <!-- 解决视频不自动播放 -->
                        <video muted :src="item.video" controls autoplay="autoplay" loop="loop">
                            <source :src="item.video">
                        </video>
                    </div>
                    <div class="createdate">{{item.createdate}}</div>
                </div>
            </div>
        </van-list>
        <foot-bar></foot-bar>
    </div>
</template>

<script>
import { getAllBlogs } from "@/http/api.js";
import footBar from "@/components/footBar.vue";
import headBar from "@/components/headBar.vue";
export default {
  name: 'Home',
  components: {
      footBar,
      headBar
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      value: '',
      page: 1
    }
  },
  mounted() {
  },
  methods: {
    onSearch(val) {
        Toast(val);
    },
    onCancel() {
        Toast('取消');
    },
    async onLoad() {
        await getAllBlogs({
            page: this.page
        }).then(res => {
            console.log(res)
            if (!res.data.result.length) this.finished = true
            this.list = this.list.concat(res.data.result)
            this.loading = false
            this.page++
        }).catch(err => {
            console.log(err)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* .blog_photos {
    width: 30%;
    margin: 1%;
} */
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
}
.blog-content .img-list img{
    width: 30%;
    margin: 1%;
}
.blog-content .img-list video {
    width: 30%;
}
</style>
