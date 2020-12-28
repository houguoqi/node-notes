import { get, post } from "./index";

// 登录接口 -- 实例 --暂时用get
export const login = (params) => {
    return get('/login', params);
}

// 注册接口 -- 实例
export const reg = (data) => {
    return post('/reg', data);
}

// 获取所有发表
export const getAllBlogs = (params) => {
    return get('/get_all_blogs', params)
}

// 获取个人信息
export const getMineInfo = (params) => {
    return get('/get_userinfo_id', params)
}

// 获取七牛token
export const getQiniuToken = () => {
    return get('https://www.hgqweb.cn/wxinterface/getToken.php')
}
