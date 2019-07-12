<template>
	<view>
		<view class="coupon_item_no uni-flex uni-row justify-between" v-for="(item, index) in coupons" :key="index">
			<view class="justify-center align-center price" style="height: 100%;width: 140upx;">
				<view class="price">
					<span class="price-unit">{{ CURRENCY_SYMBOL }}</span>
					{{ item.preferential }}
				</view>
				<view style="font-size: 26upx; color: lightGray;">{{ i18n.more.available }}</view>
			</view>

			<view style="flex: 1;">
				<view class="store_name">{{ item.storeName }}</view>

				<view class="condition uni-flex uni-row">
					<view v-if="item.conditions">{{ i18n.more.upto }} <span style="padding: 0 10upx">{{ CURRENCY_SYMBOL }} {{ item.conditions }} </span> {{ i18n.more.isavailable }}</view>
					<view v-else>{{ i18n.more.Nothreshold }}</view>
					<view style="color: #de6849;text-align:right; flex:1;" @click.stop="showDetail(item)">{{ i18n.common.Detail }}</view>
				</view>
				<view class="condition uni-flex uni-row ">{{ item.startTime }}-{{ item.endTime }}</view>
			</view>
		</view>

		<popup-layer ref="popupRef" :direction="'top'" :showPop="showModal">
			<view style="padding: 40upx;position: relative;">
				<view class="modal_title uni-flex uni-row justify-between">
					<view>{{ detailCoupon.storeName }}</view>

					<view style="color: #de6849;">-{{ CURRENCY_SYMBOL }} {{ detailCoupon.preferential }}</view>
				</view>

				<view v-if="detailCoupon.conditions">
					<view>{{ i18n.more.upto }} <span style="padding: 0 10upx">{{ CURRENCY_SYMBOL }} {{ detailCoupon.conditions }}</span> {{ i18n.more.isavailable }}</view>
				</view>
				<view v-else>{{ i18n.more.Nothreshold }}</view>
				<view>{{ detailCoupon.startTime }}-{{ detailCoupon.endTime }}</view>

				<view>{{ i18n.more.Instructions }}: {{ detailCoupon.instruction }}</view>
				<view class="require-button" @click="requireCoupon" v-if="detailCoupon.voucherType">{{ i18n.more.RequireVoucher }}</view>
				<view class="require-button" @click="requireCoupon" v-else>{{ i18n.more.RequireCoupon }}</view>
			</view>
		</popup-layer>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import { uniIcon } from '@dcloudio/uni-ui';
import popupLayer from '../../../components/popup-layer/popup-layer.vue';
import CONFIG from '@/utils/config.js';
export default {
	name: '',
	data() {
		return {
			CURRENCY_SYMBOL: CONFIG.common.CURRENCY_SYMBOL,
			coupons: [],
			detailCoupon: undefined,
			showModal: false
		};
	},
	props: {},
	methods: {
		showDetail(item) {
			this.detailCoupon = item;
			this.showModal = true;
		},
		getCoupons() {
			const userId = this.userInfo.userId;
			this.coupons = [];
			this.$request
				.get('/entry/wxapp/drawCoupons?userId=' + userId)
				.then(res => {
					if (res.code === 0) {
						this.coupons = [...this.coupons, ...res.drawCoupons];
						this.$request
							.get('/entry/wxapp/drawVoucher?userId=' + userId)
							.then(res => {
								if (res.code === 0) {
									this.coupons = [...this.coupons, ...res.drawVoucher];
								}
							})
							.catch(error => {
								console.log(error);
							});
					}
				})
				.catch(error => {
					console.log(error);
				});
		},
		requireCoupon() {
			const userId = this.userInfo.userId;
			if (this.detailCoupon.voucherType) {
				this.$request
					.post('/entry/wxapp/addVoucher?vouchersId=' + this.detailCoupon.id + '&userId=' + userId)
					.then(res => {
						this.showModal = false;
						wx.showToast({
							title: 'Succeed',
							icon: 'success',
							duration: 1000
						});
						this.getCoupons();
					})
					.catch(error => {
						console.log(error);
					});
			} else if (this.detailCoupon.couponsType) {
				this.$request
					.post('/entry/wxapp/addCoupons?couponsId=' + this.detailCoupon.id + '&userId=' + userId)
					.then(res => {
						this.showModal = false;
						wx.showToast({
							title: 'Succeed',
							icon: 'success',
							duration: 1000
						});
						this.getCoupons();
					})
					.catch(error => {
						console.log(error);
					});
			}
		}
	},
	mounted() {
		this.getCoupons();
    uni.setNavigationBarTitle({
      title: this.i18n.more.CouponCollection
    })
	},
	computed: {
		...mapGetters({
			userInfo: 'userInfo'
		}),
    i18n() {
      return this.$t('index');
    },
	},
	components: {
		uniIcon,
		popupLayer
	}
};
</script>

<style lang="scss" type="text/scss" scoped>
.coupon_item_no {
	padding: 20upx;
	background-color: #ffffff;
	margin: 25upx;
	position: relative;
}
.price {
	font-size: 50upx;
	color: #de6849;
}
.price-unit {
	font-size: 25upx;
	color: #de6849;
}

.store_name {
	font-size: 28upx;
	font-weight: 800;
}
.condition {
	color: lightgrey;
	font-size: 28upx;
}
.modal_title {
	text-align: left;
	font-size: 32upx;
	color: #000000;
	font-weight: 800;
}
.require-button {
	position: absolute;
	border: 1upx solid #de6849;
	padding: 5upx;
	border-radius: 50rpx;
	right: 40upx;
	bottom: 80upx;
	background-color: #de6849;
	color: white;
}
</style>
