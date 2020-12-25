import { get, post } from "./index";

// 登录接口 -- 实例
export const login = (data) => {
    return post('/login', data);
}

// 获取
export const getAllBlogs = (params) => {
    return get('/get_all_blogs', params)
}