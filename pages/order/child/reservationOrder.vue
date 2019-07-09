<template>
	<view>
		<view class="reservation-detail" v-for="(item, index) in reservationList" :key="index">
			<view class="order-name border-bottom">
				{{ i18n.OrderID }}：{{ item.orderNum }}
				<view class="status-name" :class="'color-' + item.state" style="float:right">{{ item.state | stateFilter }}</view>
			</view>
			<view class="order-content-main border-bottom uni-flex uni-row" @click="queryOrderDetail(item.id)">
				<view style="display: flex; justify-content: center;align-items: center;"><image :src="item.logo" style="width: 150upx;height: 150upx;border-radius: 50%;"></image></view>
				<view class="uni-flex uni-column" style="padding-left: 20upx;">
					<view class="title-name">{{ item.img }}</view>
					<view class="title">{{ item.name }}</view>
					<view class="title-text">{{ i18n.ArrivalTime }}：{{ item.xzDate }} {{ item.yjddDate }}</view>
					<view class="title-text">{{ i18n.Countofmeals }}：{{ item.jcNum }}</view>
				</view>
			</view>
			<view class="order-action uni-flex uni-row">
				<view class="text" style="line-height: 65upx;flex: 1;">{{ i18n.Tabletype }}：{{ item.tableTypeName }}</view>
				<view>
					<!-- "state": 1待审核,2已审核,3已拒绝（不会出现3状态）,4取消 5商家审核 6 商家已退款 7 商家已拒绝退款-->
					<view class="color-blue" v-if="[1, 2, 5].indexOf(item.state) !== -1" @click="queryOrderDetail(item.id)">{{ i18n.Detail }}</view>
					<view class="color-red" v-if="item.ydcode !== '' && item.state === 4" @click="refundClick(item.id)">{{ i18n.reservation.Applyforrefund }}</view>
					<view class="color-red" v-if="[2, 4, 6, 7].indexOf(item.state) !== -1" @click="deleteOrder(item.id)">{{ i18n.reservation.Delete }}</view>
					<view class="color-red" v-if="item.state == 1" @click="cancelOrder(item.id)">{{ i18n.reservation.Cancel }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	name: '',
	data() {
		return {};
	},
	props: {
		reservationList: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	methods: {
		queryOrderDetail(ydOrderId) {
			uni.navigateTo({
				url: '/pages/order/child/reservationOrderDetail?ydOrderId=' + ydOrderId
			});
		},
		refundClick(ydOrderId) {
			//申请退款
			let that = this;
			wx.showModal({
				title: this.i18n.common.Notice,
				content: this.i18n.reservation.Doyouneedtoapplyforarefund,
				cancelText: this.i18n.common.Cancel,
				confirmText: this.i18n.common.Yes,
				success(res) {
					if (res.confirm) {
						const param = {
							orderId: ydOrderId
						};
						that.$request
							.post('/entry/wxapp/ydRefund?orderId=' + ydOrderId, {
								data: param
							})
							.then(res => {
								wx.showToast({
									title: this.i18n.Refunded,
									icon: 'success',
									duration: 1000
								});
								setTimeout(function() {
									that.$emit('refreshOrder', true);
								}, 1000);
							})
							.catch(error => {
								console.error('error:', error);
								wx.showToast({
									title: this.i18n.Tryagainlater,
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
		deleteOrder(ydOrderId) {
			let that = this;
			wx.showModal({
				title: this.i18n.common.Notice,
				content: this.i18n.reservation.Deletethereservation,
				cancelText: this.i18n.common.Cancel,
				confirmText: this.i18n.common.Yes,
				success(res) {
					if (res.confirm) {
						const param = {
							orderId: ydOrderId
						};
						that.$request
							.post('/entry/wxapp/delYd?orderId=' + ydOrderId, {
								data: param
							})
							.then(res => {
								wx.showToast({
									title: this.i18n.Deleted,
									icon: 'success',
									duration: 1000
								});
								setTimeout(function() {
									that.$emit('refreshOrder', true);
								}, 1000);
							})
							.catch(error => {
								console.error('error:', error);
								wx.showToast({
									title: this.i18n.Tryagainlater,
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
		cancelOrder(ydOrderId) {
			let that = this;
			wx.showModal({
				title: this.i18n.common.Notice,
				content: this.i18n.reservation.Cancelthereservation,
				cancelText: this.i18n.common.Cancel,
				confirmText: this.i18n.common.Yes,
				success(res) {
					if (res.confirm) {
						const param = {
							orderId: ydOrderId
						};
						that.$request
							.post('/entry/wxapp/cancelReservation?orderId=' + ydOrderId, {
								data: param
							})
							.then(res => {
								wx.showToast({
									title: this.i18n.reservation.Cancelled,
									icon: 'success',
									duration: 1000
								});
								setTimeout(function() {
									that.$emit('refreshOrder', true);
								}, 1000);
							})
							.catch(error => {
								console.error('error:', error);
								wx.showToast({
									title: this.i18n.Tryagainlater,
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
	mounted() {},
	computed: {
		...mapGetters({}),
		i18n() {
			return this.$t('index');
		}
	},
	filters: {
		stateFilter(state) {
			if (state === 1) {
				return 'Reserving';
			} else if (state === 2) {
				return 'Reserved';
			} else if (state === 4) {
				return 'Cancelled';
			} else if (state === 5) {
				return 'Pending refund';
			} else if (state === 6) {
				return 'Refund successful';
			} else if (state === 7) {
				return 'Refund failed';
			} else {
				return '-';
			}
		}
	},
	components: {}
};
</script>

<style lang="scss" type="text/scss" scoped>
.reservation-detail {
	box-shadow: 0 0 10px 0 rgba(105, 126, 255, 0.15);
	border: 1px solid #dddee1;
	border-radius: 10upx;
	padding: 10upx 20upx;
	margin-bottom: 20upx;
	.order-name {
		.status-name {
			color: #0097ff;
			&.color-4 {
				color: #999;
			}
			&.color-5 {
				color: #999;
			}
			&.color-7 {
				color: #ff4040;
			}
		}
	}
	.order-content-main {
		padding: 20upx 0;
	}
	.order-action {
		padding: 20upx 0 10upx;
		.color-blue {
			float: right;
			border-radius: 25upx;
			font-size: 24upx;
			padding: 10upx 20upx;
			text-align: center;
			color: #0097ff;
			border: 1upx solid #0097ff;
			margin-left: 20upx;
		}
		.color-red {
			float: right;
			border-radius: 25upx;
			font-size: 24upx;
			padding: 10upx 20upx;
			text-align: center;
			color: #ff4040;
			border: 1upx solid #ff4040;
			margin-left: 20upx;
		}
	}
}
.border-bottom {
	border-bottom: 1rpx solid #eeeeee;
}
.title-name {
	font-size: 30upx;
	text-align: left;
}
.title-text {
	color: #b0b0b0;
}
</style>
