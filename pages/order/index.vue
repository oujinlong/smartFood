<template>
	<view class="order-main">
		<!-- 功能切换 -->
		<wuc-tab :tab-list="tabList" :tabCur.sync="TabCur" @change="tabChange" :changeColor="false"></wuc-tab>
		<view class="order-content bg-white padding-xs text-black">
			<scroll-view class="search-list" scroll-y @scrolltolower="loadMore()">
				<!-- 预定页面 -->
				<reservation-order v-if="TabCur === 0" :reservationList="reservationList" @refreshOrder="refreshOrder"></reservation-order>
				<!-- 自取页面 -->
				<self-taking v-else-if="TabCur === 1" :selfTakingOrderList="orderList" @refreshOrder="refreshOrder"></self-taking>
				<!-- 店内点单 -->
				<dined-in v-else-if="TabCur === 2" :orderList="orderList" @refreshOrder="refreshOrder"></dined-in>
				<!-- 无数据状态 -->
				<view class="no_data_container uni-flex uni-column" v-if="isNoDate">
					<image src="../../static/img/no-data.png" style="width: 300upx;height: 300upx"></image>
					<view style="justify-content:center;font-size: 40upx;margin-top: 20upx ">{{ i18n.Nodata }}</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import WucTab from '@/components/wuc-tab/wuc-tab.vue';
import reservationOrder from './child/reservationOrder.vue';
import dinedIn from './child/dinedinOrder.vue';
import selfTaking from './child/selfTakingOrder.vue';
export default {
	name: '',
	onLoad(e) {
		this.tabIndex = e.tabIndex || undefined;
		if (this.tabIndex) {
			this.TabCur = Number(this.tabIndex);
		}
		uni.startPullDownRefresh();
	},
	data() {
		return {
			TabCur: 0,
			currPage: 1,
			pageSize: 5,
			totalPage: 0,
			reservationList: [],
			orderList: [],
			tabIndex: undefined
		};
	},
	props: {},
	methods: {
		refreshOrder() {
			uni.startPullDownRefresh();
		},
		onPullDownRefresh() {
			this.queryOrder(true);
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		tabChange(index) {
			this.TabCur = index;
			this.currPage = 1;
			this.queryOrder();
		},
		loadMore() {
			if (this.currPage < this.totalPage) {
				this.currPage++;
				this.queryOrder();
			}
		},
		queryOrder(value) {
			if (value) {
				this.currPage = 1;
			}
			if (this.TabCur === 0) {
				this.queryReservationList();
			} else {
				this.queryOrderList();
			}
		},
		queryOrderList() {
			//订单列表查询（1-自取Self-taking，2-店内Dined-In）
			const param = {
				curpage: this.currPage,
				pageSize: this.pageSize,
				userId: this.userInfo.userId,
				type: this.TabCur
			};
			this.$request
				.get('/entry/wxapp/myorder', {
					data: param
				})
				.then(res => {
					this.totalPage = res.page.totalPage;
					if (this.currPage === 1) {
						this.orderList = res.page.list;
					} else {
						//多页数据
						this.orderList = [...this.orderList, ...res.page.list];
					}
				})
				.catch(error => {
					console.error('error:', error);
				});
		},
		queryReservationList() {
			//预定单列表查询
			const param = {
				curpage: this.currPage,
				pageSize: this.pageSize,
				userId: this.userInfo.userId
			};
			this.$request
				.get('/entry/wxapp/myReservation', {
					data: param
				})
				.then(res => {
					this.totalPage = res.page.totalPage;
					if (this.currPage === 1) {
						this.reservationList = res.page.list;
					} else {
						this.reservationList = [...this.reservationList, ...res.page.list];
					}
				})
				.catch(error => {
					console.error('error:', error);
				});
		}
	},
	mounted() {
		wx.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: this.systemInfo.color
		});
	},
	computed: {
		...mapGetters({
			systemInfo: 'systemInfo',
			userInfo: 'userInfo'
		}),
		i18n() {
			return this.$t('index');
		},
		tabList() {
			return [{ name: this.i18n.Reservation }, { name: this.i18n.SelfTaking }, { name: this.i18n.DinedIn }];
		},
		isNoDate() {
			if (this.TabCur === 0 && this.reservationList.length === 0) {
				return true;
			} else if (this.orderList.length === 0 && this.TabCur === 1) {
				return true;
			} else if (this.orderList.length === 0 && this.TabCur === 2) {
				return true;
			} else {
				return false;
			}
		}
	},
	components: {
		WucTab,
		reservationOrder,
		dinedIn,
		selfTaking
	}
};
</script>

<style lang="scss" type="text/scss" scoped>
.order-main {
	.order-content {
		margin-top: 10upx;
		.search-list {
			height: calc(100vh - 100upx);
		}
	}
}
</style>
