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

// 模糊搜索
export const searchBlog = (params) => {
  return get('/search_blog', params)
}

// 获取个人信息
export const getMineInfo = (params) => {
    return get('/get_userinfo_id', params)
}

// 获取我的发表
export const getMineBlog = (params) => {
    return get('/get_my_blogs', params)
}

// 获取七牛token PHP
export const getQiniuToken = () => {
    return get('https://www.hgqweb.cn/wxinterface/getToken.php')
}

// 获取七牛token Node SDK
export const getQiniuTokenNode = () => {
    return get('/get_token_node')
}

// 评论博客
export const commentBlog = (params) => {
  return get('/comment_blog', params)
}

// 查询评论
export const getComments = (params) => {
  return get('/get_comments', params)
}

// 收藏博客
export const saveBlog = (params) => {
  return get('/save_blog', params)
}

// 我的收藏
export const getMySaves = (params) => {
  return get('/get_my_save', params)
}

// 上传头像
export const avatorUpload = (params) => {
    return post('/upload_avator', params)
}

// 查询头像
export const getAvator = (params) => {
    return get('/get_avator', params)
}

// 发表
export const createBlog = (params) => {
    return get('/add_blog', params)
}
