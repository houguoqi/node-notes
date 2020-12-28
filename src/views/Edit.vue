<template>
    <div>
        <head-bar title="发表"></head-bar>
        <van-form>
            <van-field v-model="title" label="标题" placeholder="请输入标题" />
            <van-field
                v-model="content"
                rows="5"
                autosize
                label="内容"
                type="textarea"
                maxlength="100"
                placeholder="请输入内容"
                show-word-limit
            />
            <van-uploader
                v-model="fileList"
                multiple
                max-count="9"
            />
            <!-- <van-button type="primary" @click="upload">点击上传</van-button> -->
            <div style="margin: 16px;">
                <van-button type="primary" @click="upload">点击提交</van-button>
            </div>
        </van-form>
        <van-loading v-show="isLoading" class="loading" type="spinner" color="#1989fa" vertical>上传中...</van-loading>
        <foot-bar></foot-bar>
    </div>
</template>
<script>
import { getQiniuToken, createBlog } from "@/http/api.js";
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
            isLoading: false,
            title: '',
            content: ''
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
                        url: 'https://up-z0.qiniup.com/', // 华东地区
                        method: 'post',
                        data: formData
                    }).then(res => {
                        if (res.data.key) {
                            this.resultQiniuImgages.push(this.url_es + res.data.key)
                            // 长度相同说明上传完成
                            if(this.resultQiniuImgages.length === this.fileList.length) {
                                Toast.success('上传成功');
                                console.log(this.resultQiniuImgages, this.title, this.content)
                                this.isLoading = false
                                createBlog({
                                    blog_title: this.title,
                                    blog_content: this.content,
                                    photos: JSON.stringify(this.resultQiniuImgages),
                                    user_id: window.sessionStorage.getItem('user_id')
                                }).then(res => {
                                    console.log(res)
                                }).catch(err => {
                                    console.log(err)
                                })
                            }
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