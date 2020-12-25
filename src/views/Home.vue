<template>
    <div class="home">
        <van-nav-bar
            title="首页"
            left-text="返回"
            right-text="登录"
            left-arrow
            :fixed="isFixed"
            :placeholder="isPlaceHolder"
        />
        <form action="/">
            <van-search
                v-model="value"
                show-action
                placeholder="请输入搜索关键词"
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
            <van-cell-group v-for="(item, index) in list" :key="index" >
                <van-cell :title="item.blog_title" :value="item.createdate" :label="item.blog_content" />
            </van-cell-group>
        </van-list>
        <van-tabbar route :fixed="isFixed">
            <van-tabbar-item replace to="/home" icon="home-o">标签</van-tabbar-item>
            <van-tabbar-item replace to="/login" icon="search">标签</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
import { getAllBlogs } from "@/http/api.js";
export default {
  name: 'Home',
  data () {
    return {
      isFixed: true,
      isPlaceHolder: true,
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

</style>
