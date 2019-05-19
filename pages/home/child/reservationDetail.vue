<template>
	<view class="reservation-mian">
		<!-- 标题 -->
		<view class="reservation-title" style="position: relative;">
			<image :src="reservationInfo.logo" style="width: 80upx;height: 80upx;position: absolute;top: 20rpx;left: 12%;border-radius: 50%;"></image>
			Confirmation in progress
		</view>
		<!-- 预定内容 -->
		<view class="reservation-detail">
			<view class="reservation-name">{{ reservationInfo.name }}</view>
			<view style="padding: 20upx 0;">
				<view class="reservation-value">Time: {{ reservationInfo.createdTime }}</view>
				<view class="reservation-value">Number of people: {{ reservationInfo.jcNum }}</view>
				<view class="reservation-value">Table type: {{ reservationInfo.tableTypeName }}</view>
				<view class="reservation-value">Name: {{ reservationInfo.linkName }}</view>
				<view class="reservation-value">Phone: {{ reservationInfo.linkTel }}</view>
				<view class="reservation-value">Remark: {{ reservationInfo.remark }}</view>
			</view>
		</view>
		<!-- 预定流程 -->
		<view class="reservation-progress">
			<view class="title">Detail</view>
			<view class="progress-detail"><uni-steps :options="prpgressList" direction="column" :active="2"></uni-steps></view>
			<view class="uni-flex uni-row">
				<view class="red-border-button" @click="isShowDialog = true">Cancel</view>
				<view class="red-button red-border-button" @click="contactStorePhone">Contact us</view>
			</view>
		</view>
		<!-- 取消弹框 -->
		<uni-popup :show="isShowDialog" position="middle" mode="fixed" @hidePopup="isShowDialog = false" class="cancel-dialog">
			<view class="title">Tips</view>
			<view class="small-title">Confirm to cancel this order ?</view>
			<view class="uni-flex uni-row" style="width: 100%;">
				<view class="cancel-button" @click="isShowDialog = false">Cancel</view>
				<view class="confirm-button" @click="cancelReservation">Confirm</view>
			</view>
		</uni-popup>
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
			prpgressList: [
				{
					title: 'Reservation request is received',
					desc: '2019-04-12 10:33:51'
				},
				{
					title: 'Confirmation in progress',
					desc: '2019-04-12 10:33:51'
				},
				{
					title: 'Reservation is responded',
					desc: '2019-04-12 10:33:51'
				}
			],
			isShowDialog: false
		};
	},
	props: {},
	methods: {
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
				});
		},
		cancelReservation() {
			uni.navigateTo({
				url: '/pages/home/store/index?storeId=' + 3
			});
			// const param = {
			// 	orderId: this.ydOrderId
			// };
			// this.$request
			// 	.get('/entry/wxapp/cancelReservation', {
			// data: param
			// 	})
			// 	.then(res => {
			// 		uni.navigateTo({
			// 			url: '/pages/home/store/index?storeId=' + 3
			// 		});
			// 	})
			// 	.catch(error => {
			// 		console.error('error:', error);
			// 	});
		},
		showCancleDialog() {
			this.isShowDialog = true;
		},
		contactStorePhone() {
			wx.makePhoneCall({
				phoneNumber: this.reservationInfo.tel
			})
		}
	},
	mounted() {
		this.queryReservationInfo();
	},
	computed: {
		...mapGetters({})
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
