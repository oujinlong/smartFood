<template>
	<view>
		<view class="order-detail" v-for="(item, index) in orderList" :key="index">
			<view class="order-name border-bottom">
				Order：{{ item.orderNum }}
				<view class="status-name" :class="'color-' + item.state" style="float:right">{{ item.state | stateFilter }}</view>
			</view>
			<view class="order-content-main border-bottom uni-flex uni-row">
				<view style="display: flex; justify-content: center;align-items: center;">
					<image :src="item.logo" style="width: 150upx;height: 150upx;border-radius: 50%;"></image>
				</view>
				<view class="uni-flex uni-column" style="padding-left: 20upx;">
					<view class="title-name">{{ item.name }}</view>
					<view class="title-text">{{ item.goods[0].name }}.etc Total: {{ item.goods.length }}</view>
				</view>
			</view>
			<view class="order-action uni-flex uni-row">
				<view class="text" style="line-height: 65upx;flex: 1;">Total: ${{ item.money }}</view>
<!-- 				<view>
					<view class="text default-color color-red" v-if="item.ydcode !== '' && item.state === 4">Apply for refund</view>
					<view class="text color-blue" style="margin-left: 20upx;" :class="{ 'default-color': item.state === 4 }">{{ item.state | buttonFilter1 }}</view>
					<view class="text default-color" :class="{ 'color-red': item.state === 1 || item.state === 2 || item.state === 5 || item.state === 6 }">
						{{ item.state | buttonFilter2 }}
					</view>
				</view> -->
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
		orderList: {
			type: Array,
			default() {
				return [];
			}
		},
		orderType: {
			type: Number,
			default() {
				return 0;
			}
		}
	},
	methods: {},
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
		},
		buttonFilter1(state) {
			if (state === 1) {
				return 'Detail';
			} else if (state === 2) {
				return 'Detail';
			} else if (state === 4) {
				return 'Cancelled';
			} else if (state === 5) {
				return 'Detail';
			} else if (state === 6) {
				return 'Refunded';
			} else if (state === 7) {
				return 'Rejected';
			} else {
				return '--';
			}
		},
		buttonFilter2(state) {
			if (state === 1) {
				return 'Cancel';
			} else if (state === 2) {
				return 'Delete';
			} else if (state === 4) {
				return 'Delete';
			} else if (state === 5) {
				return 'Pending review';
			} else if (state === 6) {
				return 'Refund failed';
			} else if (state === 7) {
				return 'Rejected';
			} else {
				return '--';
			}
		}
	},
	components: {}
};
</script>

<style lang="scss" type="text/scss" scoped>
.order-detail {
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
		.default-color {
			float: right;
			color: #999;
			border: 1upx solid #999;
			border-radius: 25upx;
			font-size: 24upx;
			padding: 10upx 20upx;
			text-align: center;
		}
		.color-blue {
			float: right;
			border-radius: 25upx;
			font-size: 24upx;
			padding: 10upx 20upx;
			text-align: center;
			color: #0097ff;
			border: 1upx solid #0097ff;
		}
		.color-red {
			float: right;
			border-radius: 25upx;
			font-size: 24upx;
			padding: 10upx 20upx;
			text-align: center;
			color: #ff4040;
			border: 1upx solid #ff4040;
		}
		.delete-icon {
			float: right;
			color: #ff4040;
			border: 1upx solid #ff4040;
			border-radius: 25upx;
			font-size: 24upx;
			padding: 10upx 20upx;
			text-align: center;
		}
		.detail-icon {
			color: #0097ff;
			border: 1upx solid #0097ff;
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
