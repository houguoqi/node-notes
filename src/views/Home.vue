<template>
    <div class="home">
        <head-bar title="首页"></head-bar>
        <form action="/">
            <van-search
                v-model="value"
                show-action
                placeholder="请输入搜索关键词"
                background="#ffda19"
            >
              <template #action>
                <div style="font-size:14px;color:#fff;" @click="onSearch">搜索</div>
              </template>
            </van-search>
        </form>
        <van-list
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            v-if="list"
            >
            <div class="blog-list-box" v-for="(item, index) in list" :key="index">
                <div class="acvtor"><img :src="item.avatorurl?item.avatorurl:'http://hgqweb.cn/timg.gif'" alt=""></div>
                <div class="blog-content">
                    <div class="name">{{item.blog_title}}</div>
                    <div class="content">{{item.blog_content}}</div>
                    <div class="img-list" v-if="item.photos && item.photos.length">
                        <img @click="imgPreview(item.photos, img_index)" class="blog_photos" v-for="(img, img_index) in item.photos" :key="img_index" :src="img+'?imageView2/1/w/200/h/200'" alt="">
                    </div>
                    <div class="img-list" v-else-if="item.video">
                        <div @click="playVideo(item)" class="play-btn"><van-icon size="36" name="play-circle-o" color="#ffda19" /></div>
                        <!-- 解决视频不自动播放 -->
                        <video  @click="playVideo(item)" muted :src="item.video" :poster="item.video+'?vframe/jpg/offset/0'">
                            <source :src="item.video">
                        </video>
                    </div>
                    <div class="createdate">{{item.createdate}}</div>
                    <div class="comment-layout">
                      <van-row>
                        <van-col @click="commentBlog(item)" span="8"><van-icon name="chat-o" /><span>评论</span></van-col>
                        <van-col @click="saveBlog(item)" span="8"><van-icon name="star-o" /><span>收藏</span></van-col>
                        <van-col span="8"><van-icon name="like-o" /><span>点赞</span></van-col>
                      </van-row>
                    </div>
                    <div class="comment-list" v-if="item.comments && item.comments.length">
                      <van-row>
                        <van-col span="24" v-for="(com, com_index) in item.comments" :key="com_index"><span>{{com.username}}回复:</span><span>{{com.content}}</span></van-col>
                      </van-row>
                    </div>
                </div>
            </div>
        </van-list>
         <van-empty v-if="!list.length" />
        <foot-bar></foot-bar>
         <!-- 评论输入框 -->
        <div class="comment-input-box" :class="{'blog-list-box-active': isComment}">
          <input ref="commentInput" :autofocus="autofocus" type="text" placeholder="输入你的回复" v-model="commentVal">
          <button @click="commitConfirm">评论</button>
          <button @click="commitExit">取消</button>
        </div>
        <van-loading v-show="isloading" class="loading" type="spinner" size="24px" color="#1989fa" vertical></van-loading>
    </div>
</template>

<script>
import { getAllBlogs, saveBlog, searchBlog, commentBlog } from "@/http/api.js";
import footBar from "@/components/footBar.vue";
import headBar from "@/components/headBar.vue";
import { Toast,ImagePreview } from "vant";
export default {
  name: 'Home',
  components: {
      footBar,
      headBar
  },
  computed: {
    user_id () {
      return window.localStorage.getItem('user_id')
    },
    username () {
      return window.localStorage.getItem('username')
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      value: '',
      page: 1,
      commentVal: '',
      isComment: false,
      isCommentData: {},
      isCommentBlogId: '',
      autofocus: false,
      isloading: false
    }
  },
  mounted() {
  },
  methods: {
    onSearch() {
        if (!this.value) {
          this.page = 1
          this.list = []
          this.onLoad()
          return
        }
        this.isloading = true
        searchBlog({
          keyword: this.value
        }).then(res => {
          this.list = []
          this.isloading = false
          this.list = res.result
        })
    },
    onCancel() {
        Toast('取消');
    },
    async onLoad() {
        this.isloading = true
        await getAllBlogs({
            page: this.page
        }).then(res => {
            console.log(res)
            if (!res.data.result.length) this.finished = true
            this.list = this.list.concat(res.data.result)
            this.isloading = false
            this.page++
        }).catch(err => {
            console.log(err)
        })
    },
    playVideo(item) {
        console.log(item)
        this.$router.push({
            name: 'VideoDetail',
            params: item
        })
    },
    // 评论
    commentBlog(item) {
      this.isComment = true
      this.isCommentData = item
      this.isCommentBlogId = item.blog_id
      this.autofocus = true
      // 输入框自动聚焦
      this.$refs.commentInput.focus()
    },
    commitExit() {
      this.isComment = false
      this.isCommentBlogId = ''
      this.commentVal = ''
    },
    commitConfirm() {
      if (!this.commentVal) {
        Toast('请输入内容')
        return
      }
      commentBlog({
        blog_id: this.isCommentBlogId,
        user_id: this.user_id,
        content: this.commentVal
      }).then(res => {
        console.log(res)
        Toast('评论成功')
        this.isCommentData.comments.push({
          username: this.username,
          content: this.commentVal
        })
        this.isComment = false
        this.isCommentBlogId = ''
        this.commentVal = ''
      })
    },
    // 收藏
    saveBlog(item) {
      console.log(item)
      saveBlog({
        blog_id: item.blog_id,
        user_id: this.user_id
      }).then(res => {
        console.log(res)
        Toast(res.message)
      })
    },
    // 图片预览
    imgPreview(images, index) {
      ImagePreview({
        images: images,
        startPosition: index
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
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
.blog-list-box .blog-content .comment-layout {
  margin-top: 10px;
  span {
    font-size: 13px;
    margin-left: 2px;
    color: gray;
  }
}
.blog-list-box .blog-content .comment-list {
  margin-top: 5px;
  span {
    font-size: 13px;
    color: #e2b165;
    &:nth-child(2) {
      margin-left: 5px;
      color: gray;
    }
  }
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
    width: 30%;
}
.img-list .play-btn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
.comment-input-box {
  width: 100%;
  height: 64px;
  background-color: #f1f1f1;
  box-shadow: 0 -5px 3px 3px rgba(0,0,0,.1);
  position: fixed;
  left: 0;
  z-index: 99;
  padding: 10px;
  bottom: -999vh;
  input {
    background: #ffffff;
    width: 60%;
    height: 40px;
    text-indent: 10px;
    font-size: 14px;
  }
  button {
    width: 15%;
    height: 40px;
    border-radius: 4px;
    color: #ffffff;
    font-size: 15px;
    text-align: center;
    line-height: 40px;
    border: none;
    background: linear-gradient(to right, rgb(255, 96, 52), rgb(238, 10, 36));
    &:nth-child(3) {
      background: #ffffff;
      color: #000;
    }
  }
}
.blog-list-box-active {
  bottom: 0;
  transition: all .3s;
}
.loading {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
