<template>
	<view class="order-main">
		<view class="order-header">
			<image src="http://lsl-1257417616.cos.ap-shanghai.myqcloud.com/201905281324451.png" style="width: 150upx;height: 150upx;"></image>
			<view class="order-type-name">Dined-In Order</view>
			<view class="order-status">正在制作中，请你耐心等待</view>
			<view class="order-status-name">商家制作中</view>
			<view class="uni-flex uni-row" style="justify-content: center;">
				<view class="blue-button">提醒商家</view>
				<view class="red-button">联系商家</view>
			</view>
		</view>

		<view class="uni-list" style="margin-top: 20upx;">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row">
					<image src="http://lsl-1257417616.cos.ap-shanghai.myqcloud.com/201905281324451.png" style="width: 70upx;height: 70upx;"></image>
					<view class="store-name">Michelangelo’s Restaurant & Bar1</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">类型</view>
					<view class="text" style="width: 150upx;text-align: right;">堂内</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">Order ID</view>
					<view class="text" style="width: 400upx;text-align: right;">{{ orderId }}</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">Order Time</view>
					<view class="text" style="width: 400upx;text-align: right;">2019-06-05 20:21:40</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">Payment</view>
					<view class="text" style="width: 150upx;text-align: right;">Balance</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">桌号类型</view>
					<view class="text" style="width: 150upx;text-align: right;">卡座</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">桌号</view>
					<view class="text" style="width: 150upx;text-align: right;">卡座1</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd" v-for="(foodItem, foodIndex) in foodInfoList" :key="foodIndex">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">{{ foodItem.name }}</view>
					<view class="text" style="width: 60upx;">×{{ foodItem.amount }}</view>
					<view class="text" style="width: 150upx;text-align: right;">{{ CURRENCY_SYMBOL }} {{ foodItem.price }}</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">优惠</view>
					<view class="text" style="width: 400upx;text-align: right;">-{{ CURRENCY_SYMBOL }} 0.00</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">实付</view>
					<view class="text" style="width: 400upx;text-align: right;">{{ CURRENCY_SYMBOL }} 40.00</view>
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
	onLoad(e) {
		this.orderId = e.orderId || '';
	},
	data() {
		return {
			CURRENCY_SYMBOL: CONFIG.common.CURRENCY_SYMBOL,
			orderId: '',
			foodInfoList: [
				{
					name: 'Bruschetta Al Pomodoro',
					amount: '1',
					price: '14.00'
				},
				{
					name: 'Calamari Fritti',
					amount: '1',
					price: '28.00'
				}
			]
		};
	},
	props: {},
	methods: {},
	mounted() {},
	computed: {
		...mapGetters({})
	},
	components: {}
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
