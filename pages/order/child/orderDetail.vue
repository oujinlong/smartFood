<template>
	<view>
		<view class="order-detail" v-for="(item, index) in orderList" :key="index">
			<view class="order-name border-bottom">
				Order：{{ item.orderNum }}
				<view class="status-name" :class="'color-' + item.dnState" style="float:right">{{ item.dnState | stateFilter }}</view>
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
					<!-- dnState：店内订单状态1,待支付，2已完成,3关闭订单 -->
					<view class="text color-gray" v-if="item.dnState == 1" @click="CancelOrder">Cancel</view>
					<view class="text color-blue" v-if="item.dnState == 1" @click="payOrder">Pay Now</view>
					<view class="text color-blue" v-if="[2, 4].indexOf(item.dnState) !== -1" @click="anotherOrder">Another order</view>
					<view class="text color-blue" v-if="item.dnState == 2" @click="commentOrder">Comment</view>
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
		orderList: {
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
			if (state === 1) {
				return 'Pending payment';
			} else if (state === 2) {
				return 'Finish';
			} else if (state === 3) {
				return 'Cancelled';
			} else if (state === 4) {
				return 'Finish';
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
			&.color-2,
			&.color-4 {
				color: #fd553a;
			}
			&.color-3 {
				color: #999;
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
