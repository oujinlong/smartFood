<template>
	<view>
		<view class="uni-flex uni-row recharge-title">
			<view class="recharge-name uni-input">Recharge activity</view>
			<view class="recharge-list">
				<picker @change="bindPickerChange" :value="rechargeIndex" :range="rechargeArrayLabel">
					<view class="uni-input">{{ rechargeArrayLabel[rechargeIndex] }}</view>
				</picker>
			</view>
		</view>
		<view class="uni-input">{{ rechargeArrayLabel[rechargeIndex] }}</view>

		<view style="margin: 40upx 0;">
			<view class="uni-flex uni-row">
				<view class="uni-input" style="width: 200upx;">当前余额</view>
				<view class="uni-input" style="flex: 1;">{{ walletValue }}</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="uni-input" style="width: 200upx;">充值金额</view>
				<view class="uni-input" style="flex: 1;">{{ rechargeArray[rechargeIndex].full }}</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="uni-input" style="width: 200upx;">赠送金额</view>
				<view class="uni-input" style="flex: 1;">{{ rechargeArray[rechargeIndex].reduction }}</view>
			</view>
		</view>

		<view class="submit-button" v-bind:style="{ backgroundColor: systemInfo.color }" @click="submitClick">Submit</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	name: '',
	data() {
		return {
			rechargeIndex: 0,
			rechargeArray: [],
			rechargeArrayLabel: [],
			walletValue: 0
		};
	},
	props: {},
	methods: {
		bindPickerChange(e) {
			console.log('picker发送选择改变，携带值为', e.target.value);
			this.rechargeIndex = e.target.value;
		},
		czhd() {
			this.rechargeArrayLabel = [];
			this.rechargeArray = [];
			this.$request
				.get('/entry/wxapp/czhd')
				.then(res => {
					this.rechargeArray = res.czhdList;
					if (res.czhdList && res.czhdList.length > 0) {
						res.czhdList.forEach(item => {
							const czhdText = 'Recharge ' + item.full + ' get ' + item.reduction;
							this.rechargeArrayLabel.push(czhdText);
						});
					}
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
		submitClick() {
			this.$request
				.post('/entry/wxapp/recharge?money=' + this.rechargeArray[this.rechargeIndex].full + '&userId=' + this.userInfo.userId)
				.then(res => {
					wx.showToast({
						title: 'Succeed',
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
		this.czhd();
		this.queryWallet();
	},
	computed: {
		...mapGetters({
			systemInfo: 'systemInfo',
			userInfo: 'userInfo'
		})
	},
	components: {}
};
</script>

<style lang="scss" type="text/scss" scoped>
.recharge-title {
	margin-top: 20upx;
	border-bottom: 1upx solid #e3e3e3;
	background-color: white;
	.recharge-name {
	}
	.recharge-list {
		text-align: right;
	}
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
