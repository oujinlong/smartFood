import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        hasLogin: false,
        userInfo: undefined,
        openId: uni.getStorageSync('openId'),
        selfTakingInfo: undefined
    },
    mutations: {
        setUserInfo (state, userInfo) {
           state.userInfo = userInfo
        },
        setOpenId (state, openId) {
            state.openId = openId
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
        }
    }
})

export default store
