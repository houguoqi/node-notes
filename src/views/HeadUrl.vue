<template>
    <div>
        <head-bar title="上传头像"></head-bar>
        <div>
            <label>上传头像：</label>
            <input @change="change" type="file" name="avator" id="avator" />
            <input type="hidden" id="avatorVal">
            <img class="preview" alt="预览头像">
        </div>
        <div style="margin: 16px;">
            <button class="submit" @click="upload">点击上传</button>
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
        }
    },
    mounted() {
        
    },
    methods: {
        upload() {
		    if($('#avatorVal').val() == ''){
				console.log('请上传头像！')
			}else{
                avatorUpload({
                    user_id: this.user_id,
                    username: this.username,
                    avatorurl: this.user_id+this.username,
                    avatorFile: $('#avatorVal').val(),
                }).then(res => {
                    console.log(res)
                }).catch(err => {
                    console.log(err)
                })
			}
		},
        afterRead() {},
        change(data) {
            console.log(data.target.files[0])
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
<style scoped>
.loading {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
