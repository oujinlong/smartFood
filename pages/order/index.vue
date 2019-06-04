<template>
	<view class="order-main">
		<!-- 功能切换 -->
		<wuc-tab :tab-list="tabList" :tabCur.sync="TabCur" @change="tabChange"></wuc-tab>
		<view class="order-content bg-white padding-xs text-black">
			<scroll-view class="search-list" scroll-y @scrolltolower="loadMore()">
				<!-- 预定页面 -->
				<reservation-order v-if="TabCur === 0" :reservationList="reservationList" @refreshOrder="queryOrder"></reservation-order>
				<!-- 自取页面 -->
				<self-taking v-else-if="TabCur === 1" :selfTakingOrderList="orderList" @refreshOrder="queryOrder"></self-taking>
				<!-- 店内点单 -->
				<dined-in v-else-if="TabCur === 2" :orderList="orderList" @refreshOrder="queryOrder"></dined-in>
				<!-- 无数据状态 -->
				<view class="no_data_container uni-flex uni-column" v-if="reservationList.length == 0 && orderList.length == 0">
					<image src="../../static/img/no-data.png" style="width: 300upx;height: 300upx"></image>
					<view style="justify-content:center;font-size: 40rpx;margin-top: 20rpx ">No data</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import WucTab from '@/components/wuc-tab/wuc-tab.vue';
import reservationOrder from './child/reservationOrderDetail.vue';
import dinedIn from './child/orderDetail.vue';
import selfTaking from './child/selfTakingOrder.vue';
export default {
	name: '',
	onLoad(e) {
		this.tabIndex = e.tabIndex || undefined;
		if (this.tabIndex) {
			this.TabCur = Number(this.tabIndex);
		}
	},
	data() {
		return {
			tabList: [{ name: 'Reservation' }, { name: 'Self-taking' }, { name: 'Dined-In' }],
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
				userId: 40,
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
				userId: 40
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
		this.queryOrder();
	},
	computed: {
		...mapGetters({})
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
