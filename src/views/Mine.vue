<template>
    <div>
        <head-bar title="我的"></head-bar>
        <div class="header">
          <p>
              <span @click="exitLogin"><i class="icon-shutDown"><van-icon name="setting-o" /></i> </span>
              <span @click="enterHeaderUrl">上传头像</span>
          </p>
        </div>
          <div class="info">
          <img :src="avator ? avator : 'http://hgqweb.cn/FlU3cIqu3nhJoxbG87vmMujRz7_1'" >
          <p class="info_name">欢迎你：<span class="username">{{username}}</span> <i class="icon-nan"></i></p>
          <p class="info_text">部分功能正在建设中...</p>
          <div class="info_item">
            <p>99</p>
            <p>关注</p>
          </div>
          <div class="info_item">
            <p>99</p>
            <p>粉丝</p>
          </div>
          <div class="info_item">
            <p>99</p>
            <p>动态</p>
          </div>
        </div>
        <div class="iconCon">
          <div @click="createBlog">
            <i class="icon-xiezuo icon_comment"><van-icon size="18" name="description" /></i>
            <p>文章</p>
          </div>
          <div @click="createVideoBlog">
            <i class="icon-tupian icon_comment"><van-icon size="18" name="photo-o" /></i>
            <p>视频</p>
          </div>
          <div @click="enterPanel">
            <i class="icon-yinyue icon_comment"><van-icon size="18" name="smile-comment-o" /></i>
            <p>画板</p>
          </div>
          <div @click="enterChat">
            <i class="icon-shipin icon_comment"><van-icon size="18" name="chat-o" /></i>
            <p>聊天</p>
          </div>
        </div>
        <div class="ui-table">
          <div class="ui-table-cell" @click="enterMySaves">
            <span>收藏</span>
            <van-icon name="arrow" />
          </div>
          <div>
            <span>关于</span>
            <van-icon name="arrow" />
          </div>
          <div @click="exitLogin">
            <span>注销</span>
            <van-icon name="arrow" />
          </div>
        </div>
        <foot-bar></foot-bar>
    </div>
</template>
<script>
import footBar from "@/components/footBar.vue";
import headBar from "@/components/headBar.vue";
import { getMineInfo, getAvator } from "@/http/api.js";
export default {
    name: 'Mine',
    components: {
        footBar,
        headBar
    },
    computed: {
        username () {
            return window.localStorage.getItem('username')
        }
    },
    data () {
        return {
            user_id: '',
            userInfo: {},
            avator: ''
        }
    },
    mounted() {
        // 获取路由参数
        console.log(this.$route)
        this.user_id = this.$route.params.user_id ? this.$route.params.user_id : window.localStorage.getItem('user_id')
        // this.user_id = window.localStorage.getItem('user_id')
        getMineInfo({
            user_id: this.user_id
        }).then(res => {
            console.log(res)
            this.userInfo = res.result[0]
        }).catch(err => {
            console.log(err)
        })

        // 查询头像
        getAvator({
            user_id: this.user_id,
            username: this.username
        }).then(res => {
            console.log(res)
            this.avator = res.avatorFile
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
        },
        // 发表视频
        createVideoBlog() {
          this.$router.push('/video_edit')
        },
        // 进入聊天室
        enterChat() {
          this.$router.push('/chat')
        },
        // 进入画板
        enterPanel() {
            this.$router.push('/panel')
        },
        // 退出登录
        exitLogin() {
            window.localStorage.clear()
            this.$router.push('/login')
        },
        // 我的收藏
        enterMySaves() {
          this.$router.push('/mysave')
        },
        // 上传头像
        enterHeaderUrl() {
            this.$router.push('/headurl')
        }
    }
}
</script>
<style lang="less" scoped>
.header {
    /* 头部包含背景图 */
    background-color: #ffda19;
    width: 100%;
    overflow: hidden;
    height: 160px;
}
.header > p {
    /* 放我的和关机图标 */
    height: 50px;
    line-height: 50px;
}
.header > p > span:nth-of-type(1) {
    float: left;
    padding-left: 16px;
    font-size: 18px;
    font-weight: bold;
}
.header > p > span:nth-of-type(2) {
    float: right;
    padding-right: 16px;
    color: #bf8a5c;
}
.header > p > span:nth-of-type(2) > i {
    font-size: 18px;
    font-weight: bold;
}
.info {
    /* 存放个人信息的 */
    width: calc( 100% - 32px );
    background-color: #FFFFFF;
    margin-left: 16px;
    margin-top: -48px;
    float: left;
    border-radius: 8px;
    box-shadow: 0 0 6px rgba(255,218,25,0.6);
}
.info > img {
    width: 66px;
    height: 66px;
    border-radius: 66px;
    margin: 0 auto;
    display: block;
    margin-top: -33px;
    border: 1px solid #ffda19;
}
.info_name {
    text-align: center;
    font-size: 14px;
    color: #6F6F6F;
    height: 30px;
    line-height: 30px;
    .username {
      color: #9c7c13;
      font-weight: bold;
      font-size: 16px;
    }
}
.info_text {
    text-align: center;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #6F6F6F;
}
.info_item {
    width: calc( 100% / 3 );
    float: left;
    text-align: center;
    padding: 4px 0;
}
.info_item > p:nth-of-type(1) {
    font-size: 16px;
}
.info_item > p:nth-of-type(2) {
    font-size: 16px;
    color: #6F6F6F;
}
.info_item:nth-of-type(1) {
    border-radius: 0 0 0 8px;
}
.info_item:nth-last-of-type(1) {
    border-radius: 0 0 8px 0;
}
.iconCon {
    /* 放功能的图标 */
    width: 100%;
    float: left;
    overflow: hidden;
    margin-top: 16px;
    padding: 32px 0;
}
.iconCon > div {
    float: left;
    width: calc( 100% / 4 );
    text-align: center;

}
.ui-table {
    float: left;
    width: calc( 100% - 64px );
    background-color: #FFFFFF;
    border-top: 8px solid #EFEFF4;
    padding: 0 32px;
}
.ui-table > div {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #EFEFF4;
}
.ui-table > div > span {
    font-size: 16px;
    float: left;
}
.ui-table > div > i {
    float: right;
    margin-top: 16px;
}
.icon_comment {
    border-radius: 100px;
    font-size: 24px;
    width: 30px;
    height: 30px;
    display: inline-block;
    line-height: 30px;
    color: #FFFFFF;
}
.iconCon p {
    font-size: 16px;
}
.icon-xiezuo {
    background-color: #fbdc58;
}
.icon-tupian {
    background-color: #94ede2;
}
.icon-yinyue {
    background-color: #bceccd;
}
.icon-shipin {
    background-color: #ffbadc;
}
</style>
