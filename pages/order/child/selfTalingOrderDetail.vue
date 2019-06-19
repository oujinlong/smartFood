<template>
	<view class="order-main">
		<view class="order-header">
			<image :src="orderInfo.logo" style="width: 150upx;height: 150upx;"></image>
			<!-- <view class="order-type-name">Self-taking Order</view> -->
			<!-- Self-taking订单状态  state：状态 1.待付款 2.等待接单 3.等待送达  4.完成  5.取消订单 6.完成评价 7.待退款 8.退款成功 9.退款失败 -->
			<view class="order-status">{{ orderInfo.state | tipFilter }}</view>
			<view class="order-status-name">{{ orderInfo.state | titleFilter }}</view>
			<view class="uni-flex uni-row" style="justify-content: center;" v-if="orderInfo.state === '1'">
				<view class="blue-button" @click="cancelPayment">Cancel</view>
				<!-- <view class="red-button" @click="payClick">Pay Now</view> -->
			</view>
			<view class="uni-flex uni-row" style="justify-content: center;" v-else-if="orderInfo.state === '2'"><view class="blue-button" @click="contactStore">Remind Us</view></view>
			<view class="uni-flex uni-row" style="justify-content: center;" v-else>
				<view class="blue-button" v-if="orderInfo.state === '3'" @click="comfirmOrder">Confirm Receipt</view>
				<view class="blue-button" v-if="['4', '5', '6', '7'].indexOf(orderInfo.state) !== -1" @click="anotherOrder">Anohter Order</view>
				<view class="red-button" v-if="['3', '5', '7'].indexOf(orderInfo.state) !== -1" @click="contactStore">Contac Us</view>
				<view class="red-button" v-if="orderInfo.state === '4'" @click="commentOrder">Comment</view>
			</view>
		</view>
		<view class="uni-list" style="margin-top: 20upx;">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row">
					<image :src="orderInfo.logo" style="width: 70upx;height: 70upx;"></image>
					<view class="store-name">{{ orderInfo.storeName }}</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">Type</view>
					<view class="text" style="width: 150upx;text-align: right;">Self-taking</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">Order ID</view>
					<view class="text" style="width: 400upx;text-align: right;">{{ orderInfo.orderNum }}</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">Order Time</view>
					<view class="text" style="width: 400upx;text-align: right;">{{ orderInfo.time }}</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd" v-for="(foodItem, foodIndex) in orderInfo.goods" :key="foodIndex">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">{{ foodItem.name }}</view>
					<view class="text" style="width: 60upx;">×{{ foodItem.num }}</view>
					<view class="text" style="width: 150upx;text-align: right;">{{ CURRENCY_SYMBOL }} {{ foodItem.money }}</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">Discount</view>
					<view class="text" style="width: 150upx;text-align: right;">-{{ CURRENCY_SYMBOL }} {{ orderInfo.preferential }}</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">Tax</view>
					<view class="text" style="width: 150upx;text-align: right;">-{{ CURRENCY_SYMBOL }} {{ orderInfo.taxMoney }}</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1; display: flex;align-items: center;" @click="contactStore">
						<image src="../../../static/img/telephone.png" style="width: 35upx;height: 35upx;"></image>
						<view style="color:#0097FF;margin-left: 10upx;">Contract</view>
					</view>
					<view class="text" style="width: 400upx;text-align: right;">Actual payment {{ CURRENCY_SYMBOL }} {{ orderInfo.money }}</view>
				</view>
			</view>
		</view>
		<payment-dialog :visible="showPay" :price="totalAllWithTax" @confirm="paymentConfirm" @hideHandle="hideHandle"></payment-dialog>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import CONFIG from '@/utils/config.js';
import { PaymentDialog } from '@/components/paymentDialog';

export default {
	name: '',
	onLoad(e) {
		this.orderId = e.orderId || '';
	},
	data() {
		return {
			CURRENCY_SYMBOL: CONFIG.common.CURRENCY_SYMBOL,
			orderId: '',
			orderInfo: {},
			showPay: false,
			totalAllWithTax: 0
		};
	},
	props: {},
	filters: {
		titleFilter(val) {
			if (val === '1') {
				return 'Wait for payment';
			} else if (val === '2') {
				return 'Waiting for order';
			} else if (val === '3') {
				return 'Merchant production';
			} else if (val === '4' || val === '6') {
				return 'Order Fnished';
			} else if (val === '5') {
				return 'Order cancelled';
			} else if (val === '7') {
				return 'Waiting for review';
			}
		},
		tipFilter(val) {
			if (val === '1') {
				return 'If the payment is overdue, the order will be automatically taken';
			} else if (val === '2') {
				return 'Merchant pending order';
			} else if (val === '3') {
				return 'Being produced, please be patient';
			} else if (val === '4' || val === '6') {
				return 'Product has been picked up';
			} else if (val === '5') {
				return 'You have cancelled your order, welcome to visit next time';
			} else if (val === '7') {
				return 'You have applied for a refund, welcome to visit next time.';
			}
		}
	},
	methods: {
		hideHandle() {
			this.showPay = false
		},
		payClick() {
			this.showPay = true;
		},
		contactStore() {
			wx.makePhoneCall({
				phoneNumber: this.orderInfo.tel
			});
		},
		queryOrderInfo() {
			const param = {
				orderId: this.orderId
			};
			this.$request
				.get('/entry/wxapp/orderInfo', {
					data: param
				})
				.then(res => {
					this.orderInfo = res.orderInfo;
					this.totalAllWithTax = res.orderInfo.money
				})
				.catch(error => {
					console.error('error:', error);
				});
		},
		anotherOrder() {
			uni.navigateTo({
				url: '/pages/home/store/index?storeId=' + this.orderInfo.storeId
			});
		},
		commentOrder() {
			uni.navigateTo({
				url: '/pages/order/child/commentOrder?storeId=' + this.orderInfo.storeId
			});
		},
		cancelPayment() {
			let that = this;
			wx.showModal({
				title: 'Notice',
				content: 'Cancel the order?',
				cancelText: 'Cancel',
				confirmText: 'Yes',
				success(res) {
					if (res.confirm) {
						that.$request
							.post('/entry/wxapp/cancelOrder?orderId=' + that.orderId)
							.then(res => {
								wx.showToast({
									title: 'Cancelled',
									icon: 'success',
									duration: 1000
								});
								setTimeout(function() {
									uni.reLaunch({
										url: '/pages/order/index?tabIndex=' + 1
									});
								}, 1000);
							})
							.catch(error => {
								console.error('error:', error);
								wx.showToast({
									title: 'Try again later',
									icon: 'loading',
									duration: 1000
								});
							});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		comfirmOrder() {
			// 确认收货
			let that = this;
			wx.showModal({
				title: 'Notice',
				content: 'Confirm the order?',
				cancelText: 'Cancel',
				confirmText: 'Yes',
				success(res) {
					if (res.confirm) {
						that.$request
							.post('/entry/wxapp/complete?orderId=' + that.orderId)
							.then(res => {
								wx.showToast({
									title: 'Successful',
									icon: 'success',
									duration: 1000
								});
								setTimeout(function() {
									uni.reLaunch({
										url: '/pages/order/index?tabIndex=' + 1
									});
								}, 1000);
							})
							.catch(error => {
								console.error('error:', error);
								wx.showToast({
									title: 'Try again later',
									icon: 'loading',
									duration: 1000
								});
							});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		}
	},
	mounted() {
		this.queryOrderInfo();
	},
	computed: {
		...mapGetters({})
	},
	components: {
		PaymentDialog
	}
};
</script>

<style lang="scss" type="text/scss" scoped>
.order-main {
	.order-header {
		background-color: white;
		padding: 30upx 20upx;
		text-align: center;
		.order-type-name {
		}
		.order-status {
			color: #0097ff;
		}
		.order-status-name {
			font-size: 40upx;
		}
		.blue-button {
			width: 200upx;
			height: 70upx;
			line-height: 70upx;
			font-size: 26upx;
			color: white;
			background-color: #0097ff;
			border-radius: 6upx;
		}
		.red-button {
			width: 200upx;
			height: 70upx;
			font-size: 26upx;
			line-height: 70upx;
			color: #fff;
			background-color: #ff5539;
			border-radius: 6upx;
			margin-left: 30upx;
		}
	}
	.store-name {
		line-height: 70upx;
		margin-left: 20upx;
	}
}
</style>
