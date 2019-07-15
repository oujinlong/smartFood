<template>
	<view class="order-main">
		<view class="order-header">
			<image :src="orderInfo.logo" style="width: 150upx;height: 150upx;"></image>
			<!-- <view class="order-type-name">Self-taking Order</view> -->
			<!-- Self-taking订单状态  state：状态 1.待付款 2.等待接单 3.等待送达  4.完成  5.取消订单 6.完成评价 7.待退款 8.退款成功 9.退款失败 -->
			<view class="order-status">{{ orderInfo.tipName || '-' }}</view>
			<view class="order-status-name">{{ orderInfo.titleName || '-' }}</view>
			<view class="uni-flex uni-row" style="justify-content: center;" v-if="orderInfo.state === '1'">
				<view class="blue-button" @click="cancelPayment">{{ i18n.common.Cancel }}</view>
				<!-- <view class="red-button" @click="payClick">Pay Now</view> -->
			</view>
			<view class="uni-flex uni-row" style="justify-content: center;" v-else-if="orderInfo.state === '2'"><view class="blue-button" @click="contactStore">{{ i18n.selfTaking.Remind }}</view></view>
			<view class="uni-flex uni-row" style="justify-content: center;" v-else>
				<view class="blue-button" v-if="orderInfo.state === '3'" @click="confirmOrder">{{i18n.selfTaking.ConfirmReceipt}}</view>
				<view class="blue-button" v-if="['4', '5', '6', '7'].indexOf(orderInfo.state) !== -1" @click="anotherOrder">{{ i18n.selfTaking.Anotherorder }}</view>
				<view class="red-button" v-if="['3', '5', '7'].indexOf(orderInfo.state) !== -1" @click="contactStore">{{ i18n.common.Contactus }}</view>
				<view class="red-button" v-if="orderInfo.state === '4'" @click="commentOrder">{{ i18n.selfTaking.Comment }}</view>
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
					<view class="text" style="flex: 1;">{{ i18n.selfTaking.Type }}</view>
					<view class="text" style="width: 150upx;text-align: right;">{{i18n.SelfTaking}}</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">{{ i18n.selfTaking.OrderID }}</view>
					<view class="text" style="width: 400upx;text-align: right;">{{ orderInfo.orderNum }}</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">{{ i18n.selfTaking.OrderTime }}</view>
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
					<view class="text" style="flex: 1;">{{ i18n.selfTaking.Discount }}</view>
					<view class="text" style="width: 150upx;text-align: right;">-{{ CURRENCY_SYMBOL }} {{ orderInfo.preferential }}</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">{{ i18n.selfTaking.Tax }}</view>
					<view class="text" style="width: 150upx;text-align: right;">{{ CURRENCY_SYMBOL }} {{ orderInfo.taxMoney }}</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1; display: flex;align-items: center;" @click="contactStore">
						<image src="../../../static/img/telephone.png" style="width: 35upx;height: 35upx;"></image>
						<view style="color:#0097FF;margin-left: 10upx;">{{ i18n.selfTaking.Contract }}</view>
					</view>
					<view class="text" style="width: 400upx;text-align: right;">{{ i18n.selfTaking.Actualpayment }} {{ CURRENCY_SYMBOL }} {{ orderInfo.money }}</view>
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
    this.returnHome = e.returnHome || ''
	},
	data() {
		return {
			CURRENCY_SYMBOL: CONFIG.common.CURRENCY_SYMBOL,
			orderId: '',
			orderInfo: {},
			showPay: false,
			totalAllWithTax: 0,
      returnHome: ''
		};
	},
  onUnload() {
  	if (this.returnHome) {
      uni.navigateBack({
      	delta: 5
      })
    }
  },
	props: {},
	methods: {
		hideHandle() {
			this.showPay = false;
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
					this.totalAllWithTax = res.orderInfo.money;
					let state = this.orderInfo.state
					if (state === '1') {
            this.$set(this.orderInfo, 'titleName', this.i18n.selfTaking.title1)
            this.$set(this.orderInfo, 'tipName', this.i18n.selfTaking.tip1)
          }else if (state === '2') {
            this.$set(this.orderInfo, 'titleName', this.i18n.selfTaking.title2)
            this.$set(this.orderInfo, 'tipName', this.i18n.selfTaking.tip2)
          }else if (state === '3') {
            this.$set(this.orderInfo, 'titleName', this.i18n.selfTaking.title3)
            this.$set(this.orderInfo, 'tipName', this.i18n.selfTaking.tip3)
          }else if (state === '4' || state === '6') {
            this.$set(this.orderInfo, 'titleName', this.i18n.selfTaking.title4)
            this.$set(this.orderInfo, 'tipName', this.i18n.selfTaking.tip4)
          }else if (state === '5') {
            this.$set(this.orderInfo, 'titleName', this.i18n.selfTaking.title5)
            this.$set(this.orderInfo, 'tipName', this.i18n.selfTaking.tip5)
          }else if (state === '7') {
            this.$set(this.orderInfo, 'titleName', this.i18n.selfTaking.title7)
            this.$set(this.orderInfo, 'tipName', this.i18n.selfTaking.tip7)
          }else if (state === '8') {
            this.$set(this.orderInfo, 'titleName', this.i18n.selfTaking.title8)
            this.$set(this.orderInfo, 'tipName', this.i18n.selfTaking.tip8)
          }else if (state === '9') {
            this.$set(this.orderInfo, 'titleName', this.i18n.selfTaking.title9)
            this.$set(this.orderInfo, 'tipName', this.i18n.selfTaking.tip9)
          }
				})
				.catch(error => {
					console.error('error:', error);
				});
		},
		anotherOrder() {
			uni.navigateTo({
				url: '/pages/home/store/index?storeId=' + this.orderInfo.storeId + '&orderId=' + this.orderInfo.orderId
			});
		},
		commentOrder() {
			uni.navigateTo({
				url: '/pages/order/child/commentOrder?storeId=' + this.orderInfo.storeId + '&orderId=' + this.orderInfo.orderId
			});
		},
		cancelPayment() {
			let that = this;
			wx.showModal({
        title: that.i18n.common.Notice,
        content: that.i18n.reservation.Cancelthereservation,
        cancelText: that.i18n.common.Cancel,
        confirmText: that.i18n.common.Yes,
				success(res) {
					if (res.confirm) {
						that.$request
							.post('/entry/wxapp/cancelOrder?orderId=' + that.orderId)
							.then(res => {
								wx.showToast({
									title: that.i18n.reservation.Cancelled,
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
									title: that.i18n.Tryagainlater,
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
		confirmOrder() {
			// 确认收货
			let that = this;
			wx.showModal({
        title: that.i18n.common.Notice,
				content: that.i18n.selfTaking.Confirmtheorder,
        cancelText: that.i18n.common.Cancel,
        confirmText: that.i18n.common.Yes,
				success(res) {
					if (res.confirm) {
						that.$request
							.post('/entry/wxapp/complete?orderId=' + that.orderId)
							.then(res => {
								wx.showToast({
									title: that.i18n.common.Successful,
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
									title: that.i18n.Tryagainlater,
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
		wx.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: this.systemInfo.color
		});
    uni.setNavigationBarTitle({
      title: this.i18n.common.OrderDetail
    })
	},
	computed: {
		...mapGetters({
			systemInfo: 'systemInfo'
		}),
    i18n() {
      return this.$t('index');
    }
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
