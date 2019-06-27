<template>
	<view class="more_container">
		<!-- 未登录状态 强制登录 -->
		<view class="invite_login" v-if="hasLogin === false">
			<view style="margin-top: 40upx;">Hello, tourists</view>
			<view style="margin-top: 40upx;">In order to give you a better shopping experience, we invite you to log in before making a purchase.</view>

			<button open-type="getUserInfo" @getuserinfo="getUserInfoHandle" v-bind:style="{ backgroundColor: backgroundColor }" class="login_btn" style="margin-top: 100upx;">
				Login
			</button>
		</view>

		<!-- 已登陆 -->
		<view v-else>
			<!-- 红色 title view -->
			<view class="title_view" v-bind:style="{ backgroundColor: backgroundColor }">
				<image v-bind:src="userInfo.avatarUrl" class="avatar" style="margin-left: 40upx;"></image>
				<text class="nickName" style="margin-left: 30upx;">{{ userInfo.nickName }}</text>
			</view>

			<!-- 钱包 -->
			<view class="wallet" style="margin-bottom: 40upx;">
				<view>
					<text style="font-size: 24upx;">{{ CURRENCY_SYMBOL }}</text>
					<text style="font-size: 46upx; color: #f8ce5f;">708</text>
				</view>

				<view><text style="font-size: 26upx;">Wallet</text></view>
			</view>

			<uni-list class="list">
				<uni-list-item title="Online Service" thumb="/static/img/online_service.png" @click="serviceHandle"></uni-list-item>
				<uni-list-item title="Help Center" thumb="/static/img/help_center.png" @click="helpHandle"></uni-list-item>
			</uni-list>

			<!-- <form @submit="senMessage" report-submit="true">
          <button form-type='submit'>
              发送模版消息
          </button>
      </form> -->
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import { uniList, uniListItem } from '@dcloudio/uni-ui';
import CONFIG from '@/utils/config.js';
export default {
	computed: {
		...mapGetters(['userInfo', 'hasLogin', 'systemInfo']),
		backgroundColor() {
			return this.systemInfo.color;
		}
	},
	components: { uniList, uniListItem },
	data() {
		return {
			CURRENCY_SYMBOL: CONFIG.common.CURRENCY_SYMBOL
		};
	},
	mounted() {
		wx.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: this.systemInfo.color
		});
		console.log('more user info');
		console.log(this.userInfo);
	},
	methods: {
		senMessage(event) {
			const formId = event.detail.formId;
			console.log(this.userInfo);
			const params = {
				appId: 'wx6d8cc793be64b899',
				formId,
				openId: 'oxMyZ5d4FRzX2_w2MLqmGzAe8fF8',
				merchantName: '大数据产业基地',
				orderId: '123',
				orderPrice: '100',
				orderTime: '2019 05-24 23:00',
				orderType: 'success',
				payMethod: 'wechat'
			};
			console.log(JSON.stringify(params));
			//       this.$request.post('/entry/wxapp/notification/wx6d8cc793be64b899/orderMsg', {
			//         data: params
			//       }).then(res => {
			//         console.log('res', res)
			//       })
		},
		getUserInfoHandle(e) {
			let _this = this;
			let userInfo = e.mp.detail.rawData;
			if (userInfo) {
				//用户按了允许授权按钮
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						const code = loginRes.code;
						userInfo = JSON.parse(userInfo);
						_this.$request.get('/entry/wxapp/user/wx6d8cc793be64b899/login?code=' + code, {}).then(serverLoginRes => {
							console.log('serverLoginRes');
							console.log(serverLoginRes);
							let openid = serverLoginRes[1].data.data.openid;
							userInfo.openId = openid;
							let img = userInfo.avatarUrl;
							let name = userInfo.nickName;
							uni
								.request({
									url: 'http://bluecoffee.s1.natapp.cc/entry/wxapp/user/wx6d8cc793be64b899/session',
									method: 'POST',
									data: {
										img: 'http://xxx.png',
										name: 'JeepV2019',
										openid: 'xxx'
									}
								})
								.then(sessionRes => {
									console.log('session res: ');
									console.log(sessionRes);
								});
						});
					}
				});
			} else {
				//用户按了拒绝按钮
				console.log('用户按了拒绝按钮');
			}
		},
		// 点击 online service
		serviceHandle() {
			uni.showToast({
				duration: 1000,
				title: 'Online Service',
				icon: 'none'
			});
		},
		// 点击 Help Center
		helpHandle() {
			uni.showToast({
				duration: 1000,
				title: 'Help Center',
				icon: 'none'
			});
		}
	}
};
</script>

<style lang="scss">
.more_container {
	width: 100vw;
	height: 100vh;
	background-color: #f4f4f4;
}
,
.invite_login {
	display: flex;
	flex-direction: column;
	padding: 40upx;
}
.login_btn {
	width: calc(100% - 80upx);
	height: 100upx;
	text-align: center;
	line-height: 100upx;
	border-radius: 50upx;
	// background-color: $app-theme-color;
	color: white;
	font-size: 45upx;
	font-weight: 600;
}
.title_view {
	// background-color: $app-theme-color;
	// width: 100vw;
	height: 160upx;
	display: flex;
	flex-direction: row;
	align-items: center;
	.avatar {
		width: 120upx;
		height: 120upx;
		border-radius: 60upx;
	}

	.nickName {
		color: white;
		font-size: 40upx;
	}
}

.wallet {
	width: 100vw;
	height: 130upx;
	background-color: white;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
</style>
