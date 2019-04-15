import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        hasLogin: false,
        userInfo: undefined
    },
    mutations: {
        setUserInfo (state, userInfo) {
           state.userInfo = userInfo
        }
    },
    getters: {
        userInfo (state) {
          return state.userInfo
        },
        hasLogin (state) {
          return state.userInfo !== undefined
        }
    }
})

export default store
