<template>
	<view>
		<view class="coupon_item_no uni-flex uni-row justify-between" v-for="(item, index) in coupons" :key="index" @click="itemClickHandle(item)">
			<view class="uni-flex uni-column justify-center align-center price" style="height: 100%;width: 140upx;">
				<view class="price">${{ item.preferential }}</view>

				<view style="font-size: 26upx; color: lightGray;">{{ checkAvisible(item) ? 'available' : 'unavailable' }}</view>
			</view>

			<view>
				<view class="store_name">{{ item.storeName }}</view>

				<view class="condition uni-flex uni-row justify-between">
					<view v-if="item.conditions">up to ${{ item.conditions }} is available</view>
					<view v-else>No threshold</view>

					<view style="color: #de6849;" @click.stop="showDetail(item)">Detail</view>
				</view>

				<view class="condition uni-flex uni-row justify-between">{{ item.startTime }}-{{ item.endTime }}</view>

				<view class="cover_view" v-if="!checkAvisible(item)" />
			</view>
		</view>

		<popup-layer ref="popupRef" :direction="'top'" v-model="showModal">
			<view style="padding: 40upx;">
				<view class="modal_title uni-flex uni-row justify-between">
					<view>{{ detailCoupon.storeName }}</view>

					<view style="color: #de6849;">-${{ detailCoupon.preferential }}</view>
				</view>

				<view v-if="detailCoupon.conditions">
					<view>up to ${{ detailCoupon.conditions }} is available</view>
				</view>
				<view v-else>No threshold</view>
				<view>{{ detailCoupon.startTime }}-{{ detailCoupon.endTime }}</view>

				<view>Instructions: {{ detailCoupon.instruction }}</view>
			</view>
		</popup-layer>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	name: '',
	data() {
		return {};
	},
	props: {},
	methods: {},
	mounted() {},
	computed: {
		...mapGetters({
			userInfo: 'userInfo'
		}),
		selectType () {
		  return this.selfTakingInfo.coupon ? 'circle' : 'checkbox-filled'
		},
	},
	components: {}
};
</script>

<style lang="scss" type="text/scss" scoped></style>
