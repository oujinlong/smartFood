<template>
	<uni-popup :show="show" mode="fiexd" @hidePopup="hideHandle" class="pay-dialog">
		<view style="width: 75vw">
			<view class="pay-title">Payment options</view>
			<view class="uni-list">
				<radio-group @change="radioChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in payItems" :key="item.value">
						<view class="uni-flex uni-row" style="position: relative;">
							<view class="flex-item" style="position: absolute;top:-7rpx;"><image :src="item.icon" style="width: 40upx;height: 40upx;"></image></view>
							<view class="flex-item padding-left-xl" style="line-height: 28upx;">{{ item.name }}</view>
						</view>
						<view><radio :value="item.value" :checked="index === currentPayIndex" /></view>
					</label>
				</radio-group>
				<view class="uni-list-cell-pd" style="text-align:center;border-top:1upx solid #DDDEE1;margin-top:2upx;">You selected {{ payItems[currentPayIndex].name }}</view>
			</view>
      <form-button @onPress = "confirmClick">
          <view  class="confirm-button" :class="{ 'blue-button': payItems[currentPayIndex].name === 'Balance' }">Confirm payment ${{ price || '0' }}</view>
      </form-button>
		</view>
	</uni-popup>
</template>

<script>
import CONFIG from '@/utils/config.js';
import { uniPopup } from '@dcloudio/uni-ui';
import FormButton from '../formButton/index.vue'
export default {
	name: 'paymentDialog',
	props: {
		visible: false,
		price: 0
	},
	components: {
		uniPopup,
    FormButton
	},
	data() {
		return {
			show: false,
			payItems: [
				{
					icon: '../../static/img/weixin.png',
					name: 'WeChat',
					value: 2
				},
				{
					icon: '../../static/img/qb.png',
					name: 'Balance',
					value: 1
				}
			],
			currentPayIndex: 0,
			CURRENCY_SYMBOL: CONFIG.common.CURRENCY_SYMBOL
		};
	},
	watch: {
		visible(value) {
			this.show = this.visible;
		}
	},
	methods: {
		hideHandle() {
			this.$emit('hideHandle', '');
		},
		radioChange(evt) {
			//支付方式变更
			for (let i = 0; i < this.payItems.length; i++) {
				if (this.payItems[i].value.toString() === evt.target.value) {
					this.currentPayIndex = i;
					break;
				}
			}
		},
		confirmClick(formIdList) {
			this.$emit('confirm', { payIndex: this.payItems[this.currentPayIndex].value, formIdList });
		}
	}
};
</script>

<style lang="scss" type="text/scss" scoped>
.pay-dialog {
	/deep/ .uni-popup-middle.uni-popup-fixed {
		padding: 0;
		width: 85vw;
	}
}
.title-content {
	flex: 1;
	text-align: right;
	padding-right: 20rpx;
}

.arrow-right-icon {
	display: flex;
	justify-content: center;
	align-items: center;
}

.price-name {
	flex: 1;
	text-align: right;
	line-height: 60rpx;
}

.price-value {
	width: 120upx;
	padding-left: 40upx;
	line-height: 60rpx;
}

.input-name {
	width: 120upx;
	padding-left: 25rpx;
	height: 50rpx;
	padding: 15rpx 25rpx;
	line-height: 50rpx;
	font-size: 28rpx;
	background: #fff;
}

.input-value {
	flex: 1;
	height: 50rpx;
	padding: 15rpx 25rpx;
	line-height: 50rpx;
	font-size: 28rpx;
	background: #fff;
}
.form-mian {
	height: 100vh;
	position: relative;
	min-height: 1400rpx;
}
.button-icon {
	position: absolute;
	bottom: 0;
	width: calc(100% - 60upx);
}
.pay-title {
	background-color: #f2f2f2;
	border-top-left-radius: 10upx;
	border-top-right-radius: 10upx;
	text-align: center;
	padding: 20rpx;
	font-size: 30rpx;
}
.confirm-button {
	
	text-align: center;
	padding: 20rpx;
	font-size: 30rpx;
	color: white;
	background-color: #39b54a;
}
.blue-button {
	background-color: #34aaff;
}
</style>
