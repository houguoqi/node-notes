import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        count: 0,
        token: '' // 用户登录凭证（一般都会有这个）
    },
    getters: {
        count: (state) => state.count,
        token: (state) => state.token
    },
    mutations: {
        addCount (state, payload) {
            state.count++
        },
        setToken (state, token) {
            state.token = token
        }
    },
    actions: {
        // 可以包含异步操作
        // context 是一个与 store 实例具有相同方法和属性的 context 对象
        addCountAct(context) {
            setTimeout(() => {  context.commit('addCount')}, 3000)
        }
    }
})

export default store