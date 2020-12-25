<template>
    <div class="home">
        <van-nav-bar
            title="首页"
            left-text="返回"
            right-text="登录"
            left-arrow
            fixed="true"
            placeholder="true"
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
            <van-cell v-for="item in list" :key="item" :title="item" />
        </van-list>
        <van-tabbar route fixed="true">
            <van-tabbar-item replace to="/home" icon="home-o">标签</van-tabbar-item>
            <van-tabbar-item replace to="/login" icon="search">标签</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      value: ''
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
    onLoad() {
        // 异步更新数据
        // setTimeout 仅做示例，真实场景中一般为 ajax 请求
        setTimeout(() => {
            for (let i = 0; i < 10; i++) {
                this.list.push(this.list.length + 1);
                }

                // 加载状态结束
                this.loading = false;

                // 数据全部加载完成
                if (this.list.length >= 40) {
                this.finished = true;
                }
            }, 1000);
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
