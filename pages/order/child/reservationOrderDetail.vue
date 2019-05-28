<template>
	<view>
		<view class="reservation-detail" v-for="(item, index) in reservationList" :key="index">
			<view class="order-name border-bottom">
				Order：{{ item.orderNum }}
				<view class="status-name" :class="'color-' + item.state" style="float:right">{{ item.state | stateFilter }}</view>
			</view>
			<view class="order-content-main border-bottom uni-flex uni-row">
				<view style="display: flex; justify-content: center;align-items: center;">
					<image :src="item.logo" style="width: 150upx;height: 150upx;border-radius: 50%;"></image>
				</view>
				<view class="uni-flex uni-column" style="padding-left: 20upx;">
					<view class="title-name">{{ item.img }}</view>
					<view class="title-text">Arrival time：{{ item.xzDate }} {{ item.yjddDate }}</view>
					<view class="title-text">Count of meals：{{ item.jcNum }}</view>
				</view>
			</view>
			<view class="order-action uni-flex uni-row">
				<view class="text" style="line-height: 65upx;flex: 1;">Table type：{{ item.tableTypeName }}</view>
				<view>
					<!-- "state":  1,待审核，2已审核,3已拒绝,4取消-->
					<view class="text color-blue" v-if="[1, 2, 5].indexOf(item.state) !== -1" @click="queryOrderDetail(item.id)">Detail</view>
					<view class="text color-red" v-if="item.ydcode !== '' && item.state === 4">Apply for refund</view>
					<view class="text color-red" v-if="[2, 4, 6, 7].indexOf(item.state) !== -1" @click="deleteOrder">Delete</view>
					<view class="text color-red" v-if="item.state == 1" @click="cancelOrder">Cancel</view>
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
				url: '/pages/home/child/reservationDetail?ydOrderId=' + ydOrderId
			});
		}
	},
	mounted() {},
	computed: {
		...mapGetters({})
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
				return '--';
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
