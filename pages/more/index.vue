<template>
	<view class="more_container">
		<!-- 未登录状态 强制登录 -->
		<view class="invite_login" v-if="hasLogin === false">
			<view style="margin-top: 40upx;">{{ i18n.more.Hellotourists }}</view>
			<view style="margin-top: 40upx;">{{ i18n.more.touristsText }}</view>

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


			<view class="uni-flex uni-row user-info">
				<view class="text" style="flex: 1;">
					<view>
						<text style="font-size: 46upx; color: #f8ce5f;margin-right: 10upx;">{{ myUserInfo.wallet }}</text>
						<text style="font-size: 24upx;color: #f8ce5f;">{{ CURRENCY_SYMBOL }}</text>
					</view>
					<view><text style="font-size: 26upx;">{{ i18n.more.Wallet }}</text></view>
				</view>
				<view class="text" style="flex: 1;">
					<view>
						<text style="font-size: 46upx; color: #fb7b63;margin-right: 10upx;">{{ myUserInfo.userAllCoupons }}</text>
						<text style="font-size: 24upx;color: #fb7b63;">{{ i18n.more.piece }}</text>
					</view>
					<view><text style="font-size: 26upx;">{{ i18n.more.Coupon }}</text></view>
				</view>
				<view class="text" style="flex: 1;">
					<view>
						<text style="font-size: 46upx; color: #94d84e;margin-right: 10upx;">{{ myUserInfo.totalScore || 0 }}</text>
						<text style="font-size: 24upx;color: #94d84e;">{{ i18n.more.point }}</text>
					</view>
					<view><text style="font-size: 26upx;">{{ i18n.more.Score }}</text></view>
				</view>
			</view>

			<uni-list class="list" style="margin-bottom: 60upx;display: flex;">
				<uni-list-item :title="i18n.more.DeliveryAddress" thumb="/static/img/address.png" @click="chooseAddress"></uni-list-item>
				<uni-list-item :title="i18n.more.RechargeCenter" thumb="/static/img/qb.png" @click="rechargeClick"></uni-list-item>
				<uni-list-item :title="i18n.more.CouponCollection" thumb="/static/img/coupon.png" @click="collectCoupon"></uni-list-item>
				<uni-list-item :title="i18n.more.MyCoupon" thumb="/static/img/myCoupon.png" @click="couponClick"></uni-list-item>
			</uni-list>

			<uni-list class="list">
				<uni-list-item :title="i18n.more.OnlineService" thumb="/static/img/online_service.png" @click="serviceHandle"></uni-list-item>
				<uni-list-item :title="i18n.more.HelpCenter" thumb="/static/img/help_center.png" @click="helpHandle"></uni-list-item>
        <uni-list-item :title="i18n.more.ChangeLanguage" thumb="/static/img/language.png" @click="changeLangHandle"></uni-list-item>
			</uni-list>
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
		},
    i18n() {
      return this.$t('index');
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
    uni.setNavigationBarTitle({
      title: this.i18n.common.more
    })
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
		},
    changeLangHandle () {
      uni.navigateTo({
      	url: '/pages/more/lang/index'
      })
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
	color: white;
	font-size: 45upx;
	font-weight: 600;
}
.title_view {
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
