import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        hasLogin: false,
        userInfo: uni.getStorageSync('userInfo'),
        openId: uni.getStorageSync('openId'),
        selfTakingInfo: undefined,
        token: uni.getStorageSync('token')
    },
    mutations: {
        setUserInfo (state, userInfo) {
           state.userInfo = userInfo
           uni.setStorageSync('userInfo', userInfo);     
        },
        setToken (state, token) {
            state.token = token
            uni.setStorageSync('token', token);
        },
        setOpenId (state, openId) {
            state.openId = openId
            uni.setStorageSync('openId', openId);
            
        },
        setSelfTakingInfo (state, info) {
            state.selfTakingInfo = info
        }
    },
    getters: {
        userInfo (state) {
          return state.userInfo
        },
        hasLogin (state) {
          return state.userInfo !== undefined
        },
        openId (state) {
          return state.openId
        },
        selfTakingInfo (state) {
            return state.selfTakingInfo
        },
        token (state) {
            return state.token
        }
    }
})

export default store
