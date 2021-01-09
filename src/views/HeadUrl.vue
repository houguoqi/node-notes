<template>
    <div class="headurl">
        <head-bar title="上传头像"></head-bar>
        <div>
            <label for="avator">请选择文件：</label>
            <div class="file-handle">
                <input @change="change" type="file" name="avator" id="avator" />
                <div class="visual"><van-icon size="24" name="plus" /></div>
            </div>
            <input type="hidden" id="avatorVal">
            <img style="display:none;width:120px;" class="preview" alt="预览头像">
        </div>
        <div style="margin: 16px;">
            <van-button type="primary" @click="upload">点击上传</van-button>
        </div>
        <van-loading v-show="isLoading" class="loading" type="spinner" color="#1989fa" vertical>上传中...</van-loading>
        <foot-bar></foot-bar>
    </div>
</template>
<script>
import $ from 'jquery'
import { getQiniuToken, avatorUpload } from "@/http/api.js";
import footBar from "@/components/footBar.vue";
import headBar from "@/components/headBar.vue";
import { Toast } from 'vant';
import Exif from 'exif-js'
export default {
    name: 'HeadUrl',
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
            fileList: [],
            isLoading: false,
            token: '',
            url_es: 'http://hgqweb.cn/',
            avatorurl: '',
            avatorFileObject: null
        }
    },
    mounted() {
        getQiniuToken().then(res => {
            res = eval('(' + res + ')');
            this.token = res.data
        })
    },
    methods: {
        upload() {
		    if($('#avatorVal').val() == ''){
				console.log('请上传头像！')
			}else{
                Toast.loading({
                    message: '上传中...',
                    forbidClick: true,
                    loadingType: 'spinner',
                });
                let formData = new FormData()
                formData.append('file', this.avatorFileObject);
                formData.append('token', this.token);
                this.$http({
                    url: 'https://up-z0.qiniup.com/', // 华东地区
                    method: 'post',
                    data: formData
                }).then(res => {
                    if (res.data.key) {
                        this.avatorurl = this.url_es + res.data.key
                        console.log(this.avatorurl, '我的头像')
                        avatorUpload({
                            user_id: this.user_id,
                            username: this.username,
                            avatorurl: this.avatorurl,
                            avatorFile: $('#avatorVal').val(),
                        }).then(res => {
                            console.log(res)
                            Toast.clear();
                            if (res.code == 200 || res.code == 500) {
                                Toast(res.message)
                                setTimeout(() => {
                                    this.$router.push('/mine')
                                }, 500);
                            } else {
                                Toast('上传异常请重试,或联系管理员')
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    } else {
                        Toast.fail('上传失败');
                    }
                }).catch(err => {
                    console.log(err)
                })
			}
		},
        afterRead() {},
        change(data) {
            console.log(data.target.files[0])
            this.avatorFileObject = data.target.files[0]
			if (data.target.files != 0) {
				var file = data.target.files[0],
					reader = new FileReader();
				if (!reader) {
					this.value = '';
					return;
				};
				console.log(file.size,file.type)
				// if (file.size >= 1024 * 1024 / 2) {
				// 	console.log("请上传小于512kb的图片!")
				// 	return 
				// }
				if (!/image/g.test(file.type)) {
					console.log("请上传图片文件!")
					$('#avatorVal').val('')
					$('.preview').attr('src', '')
					$('.preview').fadeOut()
					return 
				}
				reader.onload = function (e) {
					this.value = '';
					$('.preview').attr('src', e.target.result)
					$('.preview').fadeIn()
					 var image = new Image();
					 image.onload = function(){
						 var canvas = document.createElement('canvas');
						 var ctx = canvas.getContext("2d");
						 canvas.width = 100;
						 canvas.height = 100;
						 ctx.clearRect(0, 0, 100, 100);
						 ctx.drawImage(image, 0, 0, 100, 100);
						 var blob = canvas.toDataURL("image/png");
						 $('#avatorVal').val(blob)
					 }
					 image.src = e.target.result
				};
				reader.readAsDataURL(file);
			};
		}
    }
}
</script>
<style scoped lang="less">
.headurl {
    padding: 20px;
    .file-handle {
        margin-top: 10px;
        width: 120px;
        height: 120px;
        overflow: hidden;
        border-radius: 50%;
        background: #e4e2e2;
        position: relative;
        input {
            opacity: 0;
            height: 100%;
            width: 100%;
        }
        .visual {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
    .loading {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
}

</style>
