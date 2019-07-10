<template>
	<view class="container">
		<view class="coupon_item_no uni-flex uni-row justify-between align-center" v-if="choose" @click="disableCouponsHandle">
			<label style="font-size: 36upx;font-weight: 800;">{{ i18n.more.Nocoupons }}</label>
			<uni-icon size="20" :type="selectType" color="#68c834"></uni-icon>
		</view>

		<view class="coupon_item_no uni-flex uni-row justify-between" v-for="(item, index) in coupons" :key="index" @click="itemClickHandle(item)">
			<view class="justify-center align-center price" style="height: 100%;width: 140upx;">
				<view class="price">
					<span class="price-unit">{{ CURRENCY_SYMBOL }}</span>
					{{ item.preferential }}
				</view>

				<view style="font-size: 26upx; color: lightGray;">{{ checkAvisible(item) ? 'available' : 'unavailable' }}</view>
			</view>

			<view style="flex: 1;">
				<view class="store_name">{{ item.storeName }}</view>

				<view class="condition uni-flex uni-row justify-between">
					<view v-if="item.conditions">{{ i18n.more.upto }} <span style="padding: 0 10upx">{{ CURRENCY_SYMBOL }} {{ item.conditions }} </span> {{ i18n.more.isavailable }}</view>
					<view v-else>{{ i18n.more.Nothreshold }}</view>
					<view style="color: #de6849;text-align:right; flex:1;" @click.stop="showDetail(item)">{{ i18n.common.Detail }}</view>
				</view>

				<view class="condition uni-flex uni-row justify-between">{{ item.startTime }}-{{ item.endTime }}</view>

				<view class="cover_view" v-if="!checkAvisible(item) && choose" />
			</view>
		</view>

		<popup-layer ref="popupRef" :direction="'top'" v-model="showModal">
			<view style="padding: 40upx;">
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
			</view>
		</popup-layer>
	</view>
</template>

<script>
import { uniIcon } from '@dcloudio/uni-ui';
import popupLayer from '../../../components/popup-layer/popup-layer.vue';
import { mapGetters } from 'vuex';
import CONFIG from '@/utils/config.js';
export default {
	components: {
		uniIcon,
		popupLayer
	},
	computed: {
		selectType() {
			return this.selfTakingInfo.coupon ? 'circle' : 'checkbox-filled';
		},
		...mapGetters({
			selfTakingInfo: 'selfTakingInfo',
			userInfo: 'userInfo'
		}),
    i18n() {
      return this.$t('index');
    },
		storeInfo() {
			return this.selfTakingInfo ? this.selfTakingInfo.storeInfo : {};
		},
		goodsInfo() {
			return this.selfTakingInfo ? this.selfTakingInfo.goodsInfo : [];
		},
		totalPrice() {
			if (this.goodsInfo) {
				let price = 0;
				this.goodsInfo.forEach(item => {
					price += item.money * item.count;
				});
				return price;
			} else {
				return 0;
			}
		}
	},
	data() {
		return {
			CURRENCY_SYMBOL: CONFIG.common.CURRENCY_SYMBOL,
			coupons: [],
			selectCoupon: undefined,
			detailCoupon: undefined,
			showModal: false,
			choose: false
		};
	},
	onLoad(e) {
		this.choose = e.choose === 'true' ? true : false;
		this.getCoupons();
	},
	methods: {
		getCoupons() {
			const userId = this.userInfo.userId;
			this.coupons = [];
			let url1 = '/entry/wxapp/coupons?userId=' + userId;
			let url2 = '/entry/wxapp/voucher?userId=' + userId;
			if (this.choose) {
				url1 = url1 + '&storeId=' + this.selfTakingInfo.storeInfo.id;
				url2 = url2 + '&storeId=' + this.selfTakingInfo.storeInfo.id;
			}
			console.log(url1, url2);
			this.$request
				.get(url1)
				.then(res => {
					if (res.code === 0) {
						this.coupons = [...this.coupons, ...res.myCoupons];
						this.$request
							.get(url2)
							.then(res => {
								if (res.code === 0) {
									this.coupons = [...this.coupons, ...res.myVoucher];
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
		disableCouponsHandle() {
			let info = { ...this.selfTakingInfo };
			info.coupon = null;
			this.$store.commit('setSelfTakingInfo', info);
			uni.navigateBack({});
		},
		showDetail(item) {
			this.detailCoupon = item;
			this.$refs.popupRef.show();
		},
		checkAvisible(item) {
			const avisible = parseFloat(item.preferential) <= this.totalPrice && item.storeId.toString() === this.storeInfo.id.toString();
			return avisible;
		},
		itemClickHandle(item) {
			if (this.choose === false) {
				return;
			}
			const avisible = this.checkAvisible(item);
			console.log(avisible);
			if (!avisible) {
				uni.showToast({
					title: 'Not available',
					icon: 'none',
					duration: 1500
				});
				return;
			}
			// 选择优惠券
			let info = { ...this.selfTakingInfo };
			info.coupon = item;
			this.$store.commit('setSelfTakingInfo', info);
			uni.navigateBack({});
		}
	}
};
</script>

<style lang="scss" type="text/scss" scoped>
page {
	width: 100vw;
	height: 100vh;
	background-color: #e5e5e5;
}

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

.disable {
	background-color: red;
}
.cover_view {
	background-color: rgba(211, 211, 211, 0.5);
	width: 100%;
	height: 100%;
	display: flex;
	flex: 1;
	position: absolute;
	left: 0;
	top: 0;
}
.active {
	border: #de6849 1.6upx solid;
}
</style>
