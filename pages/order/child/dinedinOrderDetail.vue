<template>
	<view class="order-main">
		<view class="order-header">
			<image :src="orderInfo.logo" style="width: 150upx;height: 150upx;"></image>
			<!-- <view class="order-type-name">Dined-In Order</view> -->
			<view class="order-status">{{ orderInfo.tipName || '-' }}</view>
			<view class="order-status-name">{{ orderInfo.titleName || '-'  }}</view>
			<!-- Dined-In订单状态 dnState：1,待支付，2已完成,3关闭订单 4已评价 -->
			<!--<view class="uni-flex uni-row" style="justify-content: center;" v-if="orderInfo.dnState === 1">
				<view class="blue-button" @click="payClick">Pay Now</view>
			</view> -->
			<view class="uni-flex uni-row" style="justify-content: center;" v-if="orderInfo.dnState !== 1">
				<view class="blue-button" @click="anotherOrder">{{ i18n.selfTaking.Anotherorder }}</view>
				<view class="red-button" v-if="orderInfo.dnState === 2" @click="commentOrder">{{ i18n.selfTaking.Comment }}</view>
				<!-- <view class="red-button" v-if="orderInfo.dnState === 3">Contract Us</view> -->
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
					<view class="text" style="width: 150upx;text-align: right;">{{i18n.DinedIn}}</view>
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
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">{{ i18n.selfTaking.Payment }}</view>
					<view class="text" style="width: 150upx;text-align: right;">{{ orderInfo.isYue | payMethodFilter }}</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">{{ i18n.selfTaking.TableName }}</view>
					<view class="text" style="width: 150upx;text-align: right;">{{ orderInfo.tableName }}</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">{{ i18n.selfTaking.TableNameType }}</view>
					<view class="text" style="width: 150upx;text-align: right;">{{ orderInfo.tableNameType }}</view>
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
					<view class="text" style="width: 400upx;text-align: right;">-{{ CURRENCY_SYMBOL }} {{ orderInfo.preferential }}</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd" v-if="orderInfo.taxMoney">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">{{ i18n.selfTaking.Tax }}</view>
					<view class="text" style="width: 400upx;text-align: right;">{{ CURRENCY_SYMBOL }} {{ orderInfo.taxMoney }}</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="text" style="flex: 1;">{{ i18n.selfTaking.Actualpayment }}</view>
					<view class="text" style="width: 400upx;text-align: right;">{{ CURRENCY_SYMBOL }} {{ orderInfo.money }}</view>
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
			orderInfo: {}
		};
	},
	props: {},
	methods: {
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
          let state = this.orderInfo.dnState
					if(state === 1) {
            this.$set(this.orderInfo, 'titleName', this.i18n.selfTaking.titleDineIn1)
            this.$set(this.orderInfo, 'tipName', this.i18n.selfTaking.tipDineIn1)
					} else if(state === 2 || state === 4) {
            this.$set(this.orderInfo, 'titleName', this.i18n.selfTaking.titleDineIn2)
            this.$set(this.orderInfo, 'tipName', this.i18n.selfTaking.tipDineIn2)
          } else {
            this.$set(this.orderInfo, 'titleName', this.i18n.selfTaking.titleDineIn2)
            this.$set(this.orderInfo, 'tipName', this.i18n.selfTaking.tipDineIn3)
					}
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
		...mapGetters({ systemInfo: 'systemInfo' })
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
