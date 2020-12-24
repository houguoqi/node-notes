import { get, post } from "./index";

// 登录接口 -- 实例
export const login = (data) => {
    post('/login', data);
}