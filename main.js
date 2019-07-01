import Vue from 'vue'
import App from './App'

import store from './store'
// 引入插件
import request from '@/common/request.js'

// 全局配置
request.setConfig({
	// baseUrl: 'http://bluecoffee.s1.natapp.cc/',
   baseUrl: 'https://jeetpan.mynatapp.cc/',
	header: {
		'content-type': 'application/json'
	}
})

// 设置请求拦截器
request.interceptors.request(request => {
	return request; // 返回修改后的配置，如未修改也需添加这行
})

// 设置响应拦截器
request.interceptors.response(
	response => {
		if (response.data.code === 0) {
			return response.data; // 原样返回
		} else {
			return Promise.reject(response.data) // 向外层抛出错误，用catch捕获
		}
	}
)

// // 挂载到全局vue实例上，在页面中可以使用this.$request调用request实例下相应方法
Vue.prototype.$request = request;

Vue.config.productionTip = false

Vue.prototype.$store = store

Vue.prototype.$appId = 'wx6d8cc793be64b899'

App.mpType = 'app'
const app = new Vue({
	store,
  
	...App
})
app.$mount()
