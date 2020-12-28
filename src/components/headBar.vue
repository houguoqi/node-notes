<template>
    <van-nav-bar
        :title="title"
        left-text="返回"
        left-arrow
        @click-left="clickLeft"
        :fixed="isFixed"
        :placeholder="isPlaceHolder"
    />
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: '首页'
        }
    },
    data () {
        return {
            isFixed: true,
            isPlaceHolder: true
        }
    },
    methods: {
        clickLeft() {
            console.log(this.$router)
            this.$router.back(-1)
        }
    }
}
</script>