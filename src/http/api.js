import { get, post } from "./index";

// 登录接口 -- 实例
export const login = (data) => {
    return post('/login', data);
}

// 获取
export const getAllBlogs = (params) => {
    return get('/get_all_blogs', params)
}

// 获取七牛token
export const getQiniuToken = () => {
    return get('https://www.hgqweb.cn/wxinterface/getToken.php')
}