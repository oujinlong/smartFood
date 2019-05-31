<template>
	<view>
		<view class="order-detail" v-for="(item, index) in selfTakingOrderList" :key="index">
			<view class="order-name border-bottom">
				Order：{{ item.orderNum }}
				<view class="status-name" :class="'color-' + item.state" style="float:right">{{ item.state | stateFilter }}</view>
			</view>
			<view class="order-content-main border-bottom uni-flex uni-row">
				<view style="display: flex; justify-content: center;align-items: center;"><image :src="item.logo" style="width: 100upx;height: 100upx;border-radius: 50%;"></image></view>
				<view class="uni-flex uni-column" style="padding-left: 20upx;">
					<view class="title-name">{{ item.name }}</view>
					<view class="title-text">{{ item.goods[0].name }}.etc Total: {{ item.goods.length }}</view>
				</view>
			</view>
			<view class="order-action uni-flex uni-row">
				<view class="text" style="line-height: 65upx;flex: 1;">Total: {{CURRENCY_SYMBOL}} {{ item.money }}</view>
				<view>
					<!-- state 1.待付款 2.等待接单 3.等待送达  4.完成  5.取消订单 6.完成评价 7.待退款 8.退款成功 9.退款失败-->
					<view class="color-gray" v-if="item.state == 1" @click="cancelOrder">Cancel</view>
					<view class="color-blue" v-if="item.state == 1" @click="payOrder">Pay Now</view>
					<view class="color-red" v-if="(item.state == 2 && item.isYue == 2) || (item.state == 3 && item.isYue == 2)">Apply for refund</view>
					<view class="color-blue" v-if="item.state == 2" @click="remindOrder">Remind</view>
					<view class="color-gray" v-if="item.state == 3" @click="remindingOrder">Remming</view>
					<view class="color-blue" v-if="item.state == 3" @click="comfirmOrder">Confirm</view>
					<view class="color-blue" v-if="item.state == 4" @click="commentOrder">Comment</view>
					<view class="color-blue" v-if="['4', '6'].indexOf(item.state) !== -1" @click="anotherOrder">Another order</view>
					<view class="color-red" v-if="['4', '5', '6', '8', '9'].indexOf(item.state) !== -1" @click="deleteOrder">Delete</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import CONFIG from '@/utils/config.js';

export default {
	name: '',
	data() {
		return {
			CURRENCY_SYMBOL: CONFIG.common.CURRENCY_SYMBOL
		};
	},
	props: {
		selfTakingOrderList: {
			type: Array,
			default() {
				return [];
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
			if (state === '1') {
				return 'Pending payment';
			} else if (state === '2') {
				return 'Order pending';
			} else if (state === '3') {
				return 'In delivery';
			} else if (state === '4') {
				return 'Finished';
			} else if (state === '5') {
				return 'Cancelled';
			} else if (state === '6') {
				return 'Finished';
			} else if (state === '7') {
				return 'Pedding refund';
			} else if (state === '8') {
				return 'Refund successful';
			} else if (state === '9') {
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
.order-detail {
	box-shadow: 0 0 10px 0 rgba(105, 126, 255, 0.15);
	border: 1px solid #dddee1;
	border-radius: 10upx;
	padding: 10upx 20upx;
	margin-bottom: 20upx;
	.order-name {
		.status-name {
			color: #0097ff;
			&.color-4,
			&.color-6,
			&.color-5,
			&.color-7 {
				color: #999;
			}
			&.color-9 {
				color: #ff4040;
			}
		}
	}
	.order-content-main {
		padding: 20upx 0;
	}
	.order-action {
		padding: 20upx 0 10upx;
		.color-gray {
			float: right;
			border-radius: 25upx;
			font-size: 24upx;
			padding: 10upx 20upx;
			text-align: center;
			color: #999;
			border: 1upx solid #999;
			margin-left: 20upx;
		}
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
