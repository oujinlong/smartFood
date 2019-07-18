<template>
	<view>
		<view class="recharge-title uni-input">{{i18n.more.Rechargeactivity}}</view>
		<view v-for="(activityItem,activityIndex) in rechargeArray" :key="activityIndex" class="uni-input">
			{{i18n.more.Recharge}}	<span class="recharge-value">{{activityItem.full}} {{CURRENCY_SYMBOL}}</span> {{i18n.more.get}} <span class="recharge-value">{{activityItem.reduction}} {{CURRENCY_SYMBOL}}</span>
		</view>
		<view style="margin: 40upx 0;">
			<view class="uni-flex uni-row">
				<view class="uni-input" style="width: 200upx;">{{i18n.more.currentBalance}}</view>
				<view class="uni-input" style="flex: 1;">{{ walletValue }} {{CURRENCY_SYMBOL}}</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="uni-input" style="width: 200upx;">{{i18n.more.rechargeAmount}}</view>
				<view class="uni-input" style="flex: 1;">
					<input v-model="rechargeAmount" type="number" focus @input="maxInput" @confirm="queryGiftAmount"/>
				</view>
			</view>
			<view class="uni-flex uni-row" v-if="giftMoney > 0">
				<view class="uni-input" style="width: 200upx;">{{i18n.more.giftAmount}}</view>
				<view class="uni-input" style="flex: 1;">{{ giftMoney }}</view>
			</view>
		</view>

		<view class="submit-button" v-bind:style="{ backgroundColor: systemInfo.color }" @click="submitClick">{{i18n.common.Submit}}</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import CONFIG from '@/utils/config.js';
export default {
	name: '',
	data() {
		return {
      CURRENCY_SYMBOL: CONFIG.common.CURRENCY_SYMBOL,
			rechargeArray: [],
			walletValue: 0,
      rechargeAmount: '',
      giftMoney: 0
		};
	},
	props: {},
	methods: {
    maxInput(event) {
      this.rechargeAmount = Number(event.target.value)
      if (this.rechargeAmount > 1000) {
        uni.showToast({ title: this.i18n.more.Maximumrechargeamount, icon: 'none' })
        setTimeout(() => { this.rechargeAmount = 1000 }, 100)
      }
		},
		czhd() {
			this.rechargeArray = [];
			this.$request
				.get('/entry/wxapp/czhd')
				.then(res => {
					this.rechargeArray = res.czhdList;
				})
				.catch(error => {
					console.error('error:', error);
				});
		},
		queryWallet() {
			this.$request
				.get('/entry/wxapp/userInfo?id=' + this.userInfo.userId)
				.then(res => {
					this.walletValue = res.user.wallet;
				})
				.catch(error => {
					console.error(error);
				});
		},
    queryGiftAmount() {
      this.$request
        .post('/entry/wxapp/giftMoney?money=' + this.rechargeAmount)
        .then(res => {
          this.giftMoney = res.giftMoney;
        })
        .catch(error => {
          console.error(error);
        });
		},
		submitClick() {
			this.$request
				.post('/entry/wxapp/recharge?money=' + this.rechargeAmount + '&userId=' + this.userInfo.userId)
				.then(res => {
					wx.showToast({
						title: this.i18n.common.Succeed,
						icon: 'success',
						duration: 1000
					});
					setTimeout(function() {
						uni.reLaunch({
							url: '/pages/more/index'
						});
					}, 1000);
				})
				.catch(error => {
					console.error(error);
				});
		}
	},
	mounted() {
		wx.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: this.systemInfo.color
		});
    uni.setNavigationBarTitle({
      title: this.i18n.more.RechargeCenter
    })
		this.czhd();
		this.queryWallet();
	},
	computed: {
		...mapGetters({
			systemInfo: 'systemInfo',
			userInfo: 'userInfo'
		}),
    i18n() {
      return this.$t('index');
    }
	},
	components: {}
};
</script>

<style lang="scss" type="text/scss" scoped>
.recharge-title {
	margin-top: 20upx;
	border-bottom: 1upx solid #e3e3e3;
	background-color: white;
}
.recharge-value {
	color: red;
	padding: 0upx 15upx;
}
.submit-button {
	font-size: 35upx;
	font-weight: 500;
	text-align: center;
	padding: 20upx;
	margin: 20upx;
	border-radius: 20upx;
	color: white;
}
</style>
