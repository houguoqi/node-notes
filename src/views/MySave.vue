<template>
  <div>
      <head-bar title="我的收藏"></head-bar>
      <van-cell-group v-if="mySaveList">
        <van-cell v-for="(item, index) in mySaveList" :key="index" :title="item.blog_title" :value="item.createdate" :label="'作者:'+item.author" />
      </van-cell-group>
      <van-empty v-if="!mySaveList.length" description="暂无收藏" />
      <foot-bar></foot-bar>
  </div>
</template>
<script>
import footBar from "@/components/footBar.vue";
import headBar from "@/components/headBar.vue";
import { getMySaves } from "@/http/api.js";
import { Empty } from 'vant';
export default {
  name: "MySave",
  components: {
    footBar,
    headBar
  },
  computed: {
    user_id () {
      return window.localStorage.getItem('user_id')
    }
  },
  data () {
    return {
      mySaveList: []
    }
  },
  mounted() {
    getMySaves({
      user_id: this.user_id
    }).then(res => {
      console.log(res)
      this.mySaveList = res.result
    })
  }
}
</script>
