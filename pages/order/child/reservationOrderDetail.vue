<template>
	<view class="reservation-mian">
		<!-- 标题 -->
		<view class="reservation-title uni-flex uni-row" style="justify-content: center;" v-bind:style="{ backgroundColor: systemInfo.color }">
			<image :src="reservationInfo.logo" style="width: 80upx;height: 80upx;border-radius: 50%;margin: 20upx 20upx 0 0"></image>
			<view style="line-height: 120upx;">{{ progressList[activeStep].title }}</view>
		</view>
		<!-- 预定内容 -->
		<view class="reservation-detail">
			<view class="reservation-name">{{ reservationInfo.name }}</view>
			<view style="padding: 20upx 0;">
				<view class="reservation-value">{{ i18n.common.Time }}: {{ reservationInfo.createdTime }}</view>
				<view class="reservation-value">{{ i18n.reservation.Numberofpeople }}: {{ reservationInfo.jcNum }}</view>
				<view class="reservation-value">{{ i18n.Tabletype }}: {{ reservationInfo.tableTypeName }}</view>
				<view class="reservation-value">{{ i18n.common.Name }}: {{ reservationInfo.linkName }}</view>
				<view class="reservation-value">{{ i18n.common.Phone }}: {{ reservationInfo.linkTel }}</view>
				<view class="reservation-value">{{ i18n.common.Remark }}: {{ reservationInfo.remark }}</view>
			</view>
		</view>
		<!-- 预定流程 -->
		<view class="reservation-progress">
			<view class="title">{{ i18n.common.Detail }}</view>
			<view class="progress-detail"><uni-steps :options="progressList" direction="column" :active="activeStep"></uni-steps></view>
			<view class="uni-flex uni-row">
				<view class="red-border-button" v-if="isShowCancel" v-bind:style="{ 'border-color': systemInfo.color }" @click="cancelPayment">{{ i18n.common.Cancel }}</view>
				<view class="red-button red-border-button" @click="contactStorePhone" v-bind:style="{ backgroundColor: systemInfo.color }">{{ i18n.common.Contactus }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import { uniSteps, uniPopup } from '@dcloudio/uni-ui';
export default {
	name: '',
	onLoad(e) {
		this.ydOrderId = e.ydOrderId || '';
	},
	data() {
		return {
			ydOrderId: '',
			reservationInfo: {},
			activeStep: 0,
			textButtonDesc: '',
			isShowCancel: false
		};
	},
	props: {},
	methods: {
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
		queryReservationInfo() {
			const param = {
				ydOrderId: this.ydOrderId
			};
			this.$request
				.get('/entry/wxapp/reservationInfo', {
					data: param
				})
				.then(res => {
					this.reservationInfo = res.ydOrder;
					const state = this.reservationInfo.state;
					const createdTime = this.reservationInfo.createdTime;
					this.progressList.forEach(item => {
						item.desc = createdTime;
					});
					// State: 1,待审核，2已审核,3已拒绝（不会出现3状态）,4取消 5商家审核 6 商家已退款 7 商家已拒绝退款
					if (state === 1 || state === 2) {
						this.progressList.push({ title: this.i18n.reservation.Reservationsuccessfully });
						if (state === 1) {
							this.activeStep = 1;
							this.isShowCancel = true;
						} else {
							this.activeStep = 2;
							this.textButtonDesc = '';
						}
					} else if (state === 4) {
						this.progressList.push({ title: this.i18n.reservation.Reservationiscancelled });
						this.activeStep = 2;
					} else {
						this.progressList.push({ title: this.i18n.reservation.Returnapplication });
						if (state === 5) {
							this.progressList.push({ title: this.i18n.reservation.Returnrequestreview });
						} else if (state === 6) {
							this.progressList.push({ title: this.i18n.reservation.Refundsuccessfully });
						} else if (state === 7) {
							this.progressList.push({ title: this.i18n.reservation.Refundfailed });
						}
						this.activeStep = 3;
					}
				});
		},
		contactStorePhone() {
			wx.makePhoneCall({
				phoneNumber: this.reservationInfo.tel
			});
		}
	},
	mounted() {
		this.queryReservationInfo();
		wx.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: this.systemInfo.color
		});
	},
	computed: {
		...mapGetters({
			systemInfo: 'systemInfo'
		}),
		i18n() {
			return this.$t('index');
		},
		progressList() {
			return [
				{
					title: this.i18n.reservation.Reservationrequestisreceived,
					desc: ''
				},
				{
					title: this.i18n.reservation.Confirmationinprogress,
					desc: ''
				}
			];
		}
	},
	components: {
		uniSteps,
		uniPopup
	}
};
</script>

<style lang="scss" type="text/scss" scoped>
.reservation-mian {
	.reservation-title {
		color: white;
		background-color: #ce2029;
		height: 120upx;
		text-align: center;
		line-height: 120upx;
		font-size: 32upx;
	}
	.reservation-detail {
		margin-top: 10upx;
		background-color: white;
		padding: 0 20upx 20upx;
		.reservation-name {
			font-size: 32upx;
			padding: 10rpx 0;
			border-bottom: 1px solid #e7e7e8;
		}
		.reservation-value {
			color: #999;
		}
	}
	.reservation-progress {
		margin-top: 20upx;
		padding: 0 20upx 40upx;
		background-color: white;
		.title {
			font-size: 32upx;
			padding: 10rpx 0;
			border-bottom: 1px solid #e7e7e8;
			text-align: center;
		}
		.progress-detail {
			padding: 30upx 0;
		}
		.red-border-button {
			flex: 1;
			border: 1px solid #ce2029;
			border-radius: 10upx;
			text-align: center;
			margin: 0 10rpx;
			color: #ce2029;
			padding: 5upx 0;
		}
		.red-button {
			background-color: #ce2029;
			color: white;
		}
	}
	.cancel-dialog {
		/deep/ .uni-popup-middle.uni-popup-fixed {
			padding: 0;
			width: 85%;
		}
		.title {
			padding: 30upx 0 10upx;
			font-weight: bold;
			font-size: 32upx;
		}
		.small-title {
			color: #80838f;
			padding-bottom: 30upx;
		}
		.cancel-button {
			padding: 15upx 0;
			flex: 1;
			text-align: center;
			font-weight: bold;
			width: 50%;
			border-top: 1px solid #e7e7e8;
			border-right: 1px solid #e7e7e8;
		}
		.confirm-button {
			padding: 15upx 0;
			flex: 1;
			text-align: center;
			font-weight: bold;
			color: #576b95;
			width: 50%;
			border-top: 1px solid #e7e7e8;
		}
	}
}
</style>
