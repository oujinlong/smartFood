<template>
	<view>
		<view class="order-detail" v-for="(item, index) in orderList" :key="index">
			<view class="order-name border-bottom">
				{{ i18n.OrderID }}：{{ item.orderNum }}
				<view class="status-name" :class="'color-' + item.dnState" style="float:right">{{ item.stateName || '-' }}</view>
			</view>
			<view class="order-content-main border-bottom uni-flex uni-row" @click="goOrderDetail(item.id)">
				<view style="display: flex; justify-content: center;align-items: center;"><image :src="item.logo" style="width: 100upx;height: 100upx;border-radius: 50%;"></image></view>
				<view class="uni-flex uni-column" style="padding-left: 20upx;">
					<view class="title-name">{{ item.name }}</view>
					<view class="title-text">{{ item.goods[0].name }} {{ i18n.selfTaking.etc }} {{ i18n.selfTaking.Total }}: {{ item.goods.length }}</view>
				</view>
			</view>
			<view class="order-action uni-flex uni-row">
				<view class="text" style="line-height: 65upx;flex: 1;">{{ i18n.selfTaking.TotalAmount }}: {{ CURRENCY_SYMBOL }} {{ item.money }}</view>
				<view>
					<!-- dnState：店内订单状态1,待支付，2已完成,3关闭订单 4已评价 -->
					<view class="text color-gray" v-if="item.dnState == 1" @click="cancelOrder(item.id)">{{ i18n.common.Cancel }}</view>
					<!-- <view class="text color-blue" v-if="item.dnState == 1" @click="goOrderDetail(item.id)">Pay Now</view> -->
					<view class="text color-blue" v-if="[2, 4].indexOf(item.dnState) !== -1" @click="anotherOrder(item.storeId)">{{ i18n.selfTaking.Anotherorder }}</view>
					<view class="text color-blue" v-if="item.dnState == 2" @click="commentOrder(item.storeId,item.id)">{{ i18n.selfTaking.Comment }}</view>
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
	watch: {
    orderList(value) {
      if(value && value.length > 0) {
        value.forEach(dinnedInItem => {
          console.log(dinnedInItem.dnState)
          switch (dinnedInItem.dnState) {
            case '1':
              this.$set(dinnedInItem, 'stateName', this.i18n.selfTaking.PendingPaymentFilter)
              break
            case '2':
              this.$set(dinnedInItem, 'stateName', this.i18n.selfTaking.FinishedFilter)
              break
            case '3':
              this.$set(dinnedInItem, 'stateName', this.i18n.selfTaking.CancelledFilter)
              break
            case '4':
              this.$set(dinnedInItem, 'stateName', this.i18n.selfTaking.FinishedFilter)
              break
          }

        })
      }
    }
	},
	methods: {
		cancelOrder(orderId) {
			let that = this;
			wx.showModal({
        title: that.i18n.common.Notice,
        content: that.i18n.reservation.Cancelthereservation,
        cancelText: that.i18n.common.Cancel,
        confirmText: that.i18n.common.Yes,
				success(res) {
					if (res.confirm) {
						const param = {
							orderId: orderId
						};
						that.$request
							.post('/entry/wxapp/cancelOrder?orderId=' + orderId, {
								data: param
							})
							.then(res => {
								wx.showToast({
									title: that.i18n.reservation.Cancelled,
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
		commentOrder(storeId,orderId) {
			const url = '/pages/order/child/commentOrder?storeId=' + storeId + '&orderId='+ orderId
			uni.navigateTo({
				url: url
			});
		},
		anotherOrder(storeId) {
			uni.navigateTo({
				url: '/pages/home/store/index?storeId=' + storeId
			});
		},
		goOrderDetail(orderId) {
			uni.navigateTo({
				url: '/pages/order/child/dinedinOrderDetail?orderId=' + orderId
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
