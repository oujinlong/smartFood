import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        hasLogin: false,
        userInfo: undefined,
        openId: uni.getStorageSync('openId'),
        dinedInInfo: undefined
    },
    mutations: {
        setUserInfo (state, userInfo) {
           state.userInfo = userInfo
        },
        setOpenId (state, openId) {
            state.openId = openId
        },
        setDinedInInfo (state, info) {
            state.dinedInInfo = info
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
        dinedInInfo (state) {
            return state.dinedInInfo
        }
    }
})

export default store
