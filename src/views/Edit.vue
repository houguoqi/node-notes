<template>
    <div>
        <head-bar title="图文发表"></head-bar>
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
                :multiple="multiple"
                max-count="9"
                :after-read="afterRead"
            />
            <!-- <van-button type="primary" @click="upload">点击上传</van-button> -->
            <div style="margin: 16px;">
                <van-button type="primary" @click="upload">点击提交</van-button>
            </div>
        </van-form>
        <van-loading v-show="isLoading" class="loading" type="spinner" color="#1989fa" vertical>压缩上传中...</van-loading>
        <foot-bar></foot-bar>
    </div>
</template>
<script>
import { getQiniuToken, createBlog } from "@/http/api.js";
import footBar from "@/components/footBar.vue";
import headBar from "@/components/headBar.vue";
import { Toast } from 'vant';
import Exif from 'exif-js'
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
            multiple: true,
            title: '',
            content: '',
            // 图片信息
            files: {
                name: "",
                type: ""
            },
            // 压缩过的图片数组
            zipImgList: []
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
            if (!this.title) {
                Toast('未填写标题')
                return
            }
            if (!this.content) {
                Toast('未填写内容')
                return
            }
            if (!this.zipImgList.length) {
                Toast('未选择图片')
                return
            }
            console.log(this.zipImgList, 'zipImgListzipImgList')
            console.log(this.fileList, 'zipImgListzipImgList')
            // return
            if (this.zipImgList.length) {
                this.isLoading = true
                this.zipImgList.forEach(ele => {
                    let formData = new FormData()
                    formData.append('file', ele);
                    formData.append('token', this.token);
                    this.$http({
                        url: 'https://up-z0.qiniup.com/', // 华东地区
                        method: 'post',
                        data: formData
                    }).then(res => {
                        if (res.data.key) {
                            this.resultQiniuImgages.push(this.url_es + res.data.key)
                            // 长度相同说明上传完成
                            if(this.resultQiniuImgages.length === this.zipImgList.length) {
                                Toast.success('上传成功');
                                console.log(this.resultQiniuImgages, this.title, this.content)
                                this.isLoading = false
                                createBlog({
                                    blog_title: this.title,
                                    blog_content: this.content,
                                    photos: JSON.stringify(this.resultQiniuImgages),
                                    user_id: window.localStorage.getItem('user_id'),
                                    video: ''
                                }).then(res => {
                                    console.log(res)
                                    this.$router.push('/home')
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
        },
        // 组件方法 获取 流
        afterRead(file) {
            console.log(file)
            if (Object.prototype.toString.call(file) === '[object Array]') {
                file.forEach(ele => {
                    this.files.name = ele.file.name // 获取文件名
                    this.files.type = ele.file.type // 获取类型
                    this.imgPreview(ele.file)
                })
            } else if (Object.prototype.toString.call(file) === '[object Object]') {
                this.files.name = file.file.name // 获取文件名
                this.files.type = file.file.type // 获取类型
                this.imgPreview(file.file)
            }
        },
        // 处理图片
        imgPreview(file) {
            let self = this
            let Orientation
            //去获取拍照时的信息，解决拍出来的照片旋转问题   npm install exif-js --save   这里需要安装一下包
            Exif.getData(file, function() {
                Orientation = Exif.getTag(this, 'Orientation')
            })
            // 看支持不支持FileReader
            if (!file || !window.FileReader) return
            if (/^image/.test(file.type)) {
                // 创建一个reader
                let reader = new FileReader()
                // 将图片2将转成 base64 格式
                reader.readAsDataURL(file)
                // 读取成功后的回调
                reader.onloadend = function() {
                    let result = this.result
                    let img = new Image()
                    img.src = result
                    //判断图片是否大于500K,是就直接上传，反之压缩图片
                    // if (this.result.length <= 500 * 1024) {
                    //     // 上传图片
                    //     self.postImg(this.result);
                    // } else {
                    //     img.onload = function() {
                    //         let data = self.compress(img, Orientation)
                    //         // 上传图片
                    //         console.log(data, '处理过的图片')
                    //         self.postImg(data);
                    //     }
                    // }
                    img.onload = function() {
                        let data = self.compress(img, Orientation)
                        // 上传图片
                        console.log(self.dataURLtoFile(data), '处理过的图片')
                        self.zipImgList.push(self.dataURLtoFile(data))
                        // self.postImg(data);
                    }
                }
            }
        },
        // 压缩图片
        compress(img, Orientation) {
            let canvas = document.createElement('canvas')
            let ctx = canvas.getContext('2d')
            //瓦片canvas
            let tCanvas = document.createElement('canvas')
            let tctx = tCanvas.getContext('2d')
            // let initSize = img.src.length;
            let width = img.width
            let height = img.height
            //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
            let ratio
            if ((ratio = (width * height) / 4000000) > 1) {
                // console.log("大于400万像素");
                ratio = Math.sqrt(ratio)
                width /= ratio
                height /= ratio
            } else {
                ratio = 1
            }
            canvas.width = width
            canvas.height = height
            //    铺底色
            ctx.fillStyle = '#fff'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            //如果图片像素大于100万则使用瓦片绘制
            let count
            if ((count = (width * height) / 1000000) > 1) {
                // console.log("超过100W像素");
                count = ~~(Math.sqrt(count) + 1) //计算要分成多少块瓦片
                //      计算每块瓦片的宽和高
                let nw = ~~(width / count)
                let nh = ~~(height / count)
                tCanvas.width = nw
                tCanvas.height = nh
                for (let i = 0; i < count; i++) {
                for (let j = 0; j < count; j++) {
                    tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
                    ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
                }
                }
            } else {
                ctx.drawImage(img, 0, 0, width, height)
            }
            //进行最小压缩
            let ndata = canvas.toDataURL('image/jpeg', 0.1)
            tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
            return ndata
        },
        //将base64转换为文件
        dataURLtoFile(dataurl) {
            var arr = dataurl.split(','),
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n)
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            return new File([u8arr], this.files.name, {
                type: this.files.type
            })
        },
        // 提交图片到后端
        postImg(base64) {
            let file = this.dataURLtoFile(base64)
            let formData = new window.FormData()
            formData.append('file', file)
            // 提交图片
            // Some code
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
