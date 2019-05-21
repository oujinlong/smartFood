<template>
	<view class="order-menu-main">
		<!-- 餐厅信息 -->
		<view class="uni-flex uni-column uni-list-cell-pd" style="background-color: #ce2029;padding-bottom: 0upx;">
			<view class="flex-item">
				<view class="uni-flex uni-row">
					<view class="text" style="display: flex; justify-content: center;align-items: center;">
						<image :src="storeInfo.logo" style="width: 150upx;height: 150upx;border-radius: 50%;"></image>
					</view>
					<view class="uni-flex uni-column" style="padding-left: 20upx;">
						<view class="title-name">{{ storeInfo.name || '--' }}</view>
						<view class="uni-flex uni-row title-text">announcement: {{ storeInfo.announcement || '--' }}</view>
					</view>
				</view>
			</view>
			<view class="flex-item" style="margin-top: 15upx;">
				<view class="uni-swiper-msg">
					<view class="uni-swiper-msg-icon"><image src="../../../static/img/sales.png" mode="widthFix"></image></view>
					<swiper vertical="true" autoplay="true" circular="true" interval="3000">
						<swiper-item v-for="(item, index) in reductionList" :key="index">
							<navigator style="color: white;font-size: 25upx;">{{ item.name }}</navigator>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		<!-- 功能切换 -->
		<wuc-tab :tab-list="tabList" :tabCur.sync="TabCur" @change="tabChange"></wuc-tab>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import WucTab from "@/components/wuc-tab/wuc-tab.vue";

export default {
	name: '',
	onLoad(e) {
		this.storeId = e.storeId || '';
	},
	data() {
		return {
			storeInfo: {},
			storeId: '',
			reductionList: [],
			tabList: [
			  { name: "Order Menu" },
			  { name: "Reviews" },
			  { name: "Detail" }
			],
			TabCur: 0
		};
	},
	props: {},
	methods: {
		tabChange(index) {
		  this.TabCur = index;
		},
		queryReduction() {
			//店铺满减优惠查询（滚动播放）
			const param = {
				storeId: this.storeId
			};
			this.$request
				.get('/entry/wxapp/reduction', {
					data: param
				})
				.then(res => {
					this.reductionList = res.reductions;
				})
				.catch(error => {
					console.error('error:', error);
				});
		},
		queryStoreInfo() {
			const param = {
				userId: 1,
				storeId: this.storeId
			};
			this.$request
				.get('/entry/wxapp/store', {
					data: param
				})
				.then(res => {
					this.storeInfo = res.store;
					uni.setNavigationBarTitle({
						title: this.storeInfo.name
					});
				})
				.catch(error => {
					console.error('error:', error);
				});
		}
	},
	mounted() {
		console.log(this.storeId);
		this.queryStoreInfo();
		this.queryReduction();
	},
	computed: {
		...mapGetters({})
	},
	components: {
		WucTab
	}
};
</script>

<style lang="scss" type="text/scss" scoped>
.order-menu-main {
	.title-name {
		font-size: 30upx;
		height: 40upx;
		text-align: left;
		padding: 10upx 0 20upx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
		color: white;
	}

	.title-text {
		font-size: 25upx;
		color: white;
		line-height: 35upx;
	}
}
</style>
