<template>
    <div>
        <head-bar title="发表"></head-bar>
        <van-uploader
            v-model="fileList"
            multiple
            max-count="9"
        />
        <van-button type="primary" @click="upload">点击上传</van-button>
        <van-loading v-show="isLoading" class="loading" type="spinner" color="#1989fa" vertical>上传中...</van-loading>
        <foot-bar></foot-bar>
    </div>
</template>
<script>
import { getQiniuToken } from "@/http/api.js";
import footBar from "@/components/footBar.vue";
import headBar from "@/components/headBar.vue";
import { Toast } from 'vant';
export default {
    name: 'Edit',
    components: {
        footBar,
        headBar
    },
    data () {
        return {
            fileList: [],
            token: '',
            url_es: 'http://hgqweb.cn/',
            resultQiniuImgages: [],
            isLoading: false
        }
    },
    mounted() {
        getQiniuToken().then(res => {
            res = eval('(' + res + ')');
            this.token = res.data
            console.log(this.token)
        })
    },
    methods: {
        upload() {
            if (this.fileList.length) {
                this.isLoading = true
                this.fileList.forEach(ele => {
                    let formData = new FormData()
                    formData.append('file', ele.file);
                    formData.append('token', this.token);
                    this.$http({
                        url: 'http://up-z0.qiniup.com/', // 华东地区
                        method: 'post',
                        data: formData
                    }).then(res => {
                        if (res.data.key) {
                            this.resultQiniuImgages.push(this.url_es + res.data.key)
                        } else {
                            Toast.fail('上传失败');
                            return false
                        }
                    }).catch(err => {
                        console.log(err)
                        this.isLoading = false
                        return false
                    })
                })
                Toast.success('上传成功');
                console.log(this.resultQiniuImgages)
                this.isLoading = false
            }
        }
    }
}
</script>
<style scoped>
.loading {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>