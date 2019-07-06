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
				<image v-bind:src="userInfo.img" class="avatar" style="margin-left: 40upx;"></image>
				<text class="nickName" style="margin-left: 30upx;">{{ userInfo.name }}</text>
			</view>

			<!-- 钱包 -->
			<!-- 			<view class="wallet" style="margin-bottom: 40upx;">
				<view>
					<text style="font-size: 24upx;">{{ CURRENCY_SYMBOL }}</text>
					<text style="font-size: 46upx; color: #f8ce5f;">{{ walletVaule }}</text>
				</view>

				<view><text style="font-size: 26upx;">Wallet</text></view>
			</view> -->

			<view class="uni-flex uni-row user-info">
				<view class="text" style="flex: 1;">
					<view>
						<text style="font-size: 46upx; color: #f8ce5f;margin-right: 10upx;">{{ myUserInfo.wallet }}</text>
						<text style="font-size: 24upx;color: #f8ce5f;">{{ CURRENCY_SYMBOL }}</text>
					</view>
					<view><text style="font-size: 26upx;">Wallet</text></view>
				</view>
				<view class="text" style="flex: 1;">
					<view>
						<text style="font-size: 46upx; color: #fb7b63;margin-right: 10upx;">{{ myUserInfo.userAllCoupons }}</text>
						<text style="font-size: 24upx;color: #fb7b63;">piece</text>
					</view>
					<view><text style="font-size: 26upx;">Coupon</text></view>
				</view>
				<view class="text" style="flex: 1;">
					<view>
						<text style="font-size: 46upx; color: #94d84e;margin-right: 10upx;">{{ myUserInfo.totalScore || 0 }}</text>
						<text style="font-size: 24upx;color: #94d84e;">point</text>
					</view>
					<view><text style="font-size: 26upx;">Score</text></view>
				</view>
			</view>

			<uni-list class="list" style="margin-bottom: 60upx;display: flex;">
				<uni-list-item title="Delivery Address" thumb="/static/img/address.png" @click="chooseAddress"></uni-list-item>
				<uni-list-item title="Recharge Center" thumb="/static/img/qb.png" @click="rechargeClick"></uni-list-item>
				<uni-list-item title="Coupon Collection" thumb="/static/img/coupon.png" @click="collectCoupon"></uni-list-item>
				<uni-list-item title="My Coupon" thumb="/static/img/myCoupon.png" @click="couponClick"></uni-list-item>
			</uni-list>

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
			CURRENCY_SYMBOL: CONFIG.common.CURRENCY_SYMBOL,
			myUserInfo: {},
			addressInfo: {}
		};
	},
	mounted() {
		wx.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: this.systemInfo.color
		});
		this.queryWallet();
	},
	methods: {
		chooseAddress() {
			wx.chooseAddress({
				success: res => {
					console.log(res);
					this.addressInfo = res
				},
				fail: function(err) {
					console.log(err);
				}
			});
		},
		querySystem() {
			this.$request
				.get('/entry/wxapp/userInfo?id=' + this.userInfo.userId)
				.then(res => {
					this.myUserInfo = res.user;
				})
				.catch(error => {
					console.error(error);
				});
		},
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
			wx.makePhoneCall({
				phoneNumber: this.systemInfo.tel
			});
		},
		// 点击 Help Center
		helpHandle() {
			uni.navigateTo({
				url: '/pages/more/helpCenter/index'
			});
		},
		// 充值
		rechargeClick() {
			uni.navigateTo({
				url: '/pages/more/recharge/index'
			});
		},
		queryWallet() {
			this.$request
				.get('/entry/wxapp/userInfo?id=' + this.userInfo.userId)
				.then(res => {
					this.myUserInfo = res.user;
				})
				.catch(error => {
					console.error(error);
				});
		},
    couponClick () {
      uni.navigateTo({
      	url: '../home/coupons/index?choose=false'
      })
    },
		collectCoupon () {
			uni.navigateTo({
				url: '/pages/home/coupons/collectCoupon'
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

.user-info {
	background-color: white;
	text-align: center;
	margin-bottom: 20upx;
}
</style>
