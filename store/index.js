import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: uni.getStorageSync('userInfo'),
		openId: uni.getStorageSync('openId'),
		selfTakingInfo: undefined,
		token: uni.getStorageSync('token'),
		systemInfo: uni.getStorageSync('systemInfo'),
		storeColor: uni.getStorageSync('storeColor'),
		selfTakingInfo: uni.getStorageSync('selfTakingInfo'),
    lang: uni.getStorageSync('lang') ? uni.getStorageSync('lang') : 'cn'
	},
	mutations: {
		setUserInfo(state, userInfo) {
			state.userInfo = userInfo
			uni.setStorageSync('userInfo', userInfo);
		},
		setToken(state, token) {
			state.token = token
			uni.setStorageSync('token', token);
		},
		setOpenId(state, openId) {
			state.openId = openId
			uni.setStorageSync('openId', openId);

		},
		setSelfTakingInfo(state, info) {
			state.selfTakingInfo = info
			uni.setStorageSync('selfTakingInfo', info);
		},
		setSystemInfo(state, systemInfo) {
			state.systemInfo = systemInfo
			uni.setStorageSync('systemInfo', systemInfo);
		},
		setStoreColor(state, storeColor) {
			state.storeColor = storeColor
			uni.setStorageSync('storeColor', storeColor);
		},
    setLanguage(state, lang) {
      state.lang = lang
      uni.setStorageSync('lang', lang);
    }
	},
	getters: {
		userInfo(state) {
			return state.userInfo
		},
		hasLogin(state) {
			return state.userInfo !== undefined
		},
		openId(state) {
			return state.openId
		},
		selfTakingInfo(state) {
			return state.selfTakingInfo
		},
		token(state) {
			return state.token
		},
		systemInfo(state) {
			return state.systemInfo
		},
		storeColor(state) {
			return state.storeColor
		},
    lang(state) {
      return state.lang
    }
	}
})

export default store
