<template>
	<view class="order-main">
		<!-- 功能切换 -->
		<wuc-tab :tab-list="tabList" :tabCur.sync="TabCur" @change="tabChange"></wuc-tab>

		<view class="order-content bg-white padding-xs text-black">
			<scroll-view class="search-list" scroll-y @scrolltolower="loadMore()">
				<view class="reservation-detail" v-for="(item,index) in reservationList" :key="index">
					<view class="order-name border-bottom">
						Order：{{item.orderNum}}
						<view class="status-name" style="float:right">Reserved</view>
					</view>
					<view class="order-content-main border-bottom uni-flex uni-row">
						<view style="display: flex; justify-content: center;align-items: center;">
							<image src="../../static/logo.png" style="width: 150upx;height: 150upx;border-radius: 50%;"></image>
						</view>
						<view class="uni-flex uni-column" style="padding-left: 20upx;">
							<view class="title-name">Michelangelo’s Restaurant & Bar</view>
							<view class="title-text">Arrival time：2019-04-12 12:00</view>
							<view class="title-text">Count of meals：1</view>
						</view>
					</view>
					<view class="order-action uni-flex uni-row">
						<view class="text" style="line-height: 65upx;flex: 1;">Table type：Table for 10</view>
						<view class="text delete-icon">Delete</view>
						<view class="text delete-icon detail-icon">Detail</view>
					</view>
				</view>
				<!-- 无数据状态 -->
<!-- 				<view class="no_data_container uni-flex uni-column">
					<image src="../../static/img/no-data.png" style="width: 300upx;height: 300upx"></image>
					<view style="justify-content:center;font-size: 40rpx;margin-top: 20rpx ">No data</view>
				</view> -->
			</scroll-view>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import WucTab from '@/components/wuc-tab/wuc-tab.vue';
export default {
	name: '',
	data() {
		return {
			tabList: [{ name: 'Reservation' }, { name: 'Dined-In' }, { name: 'Self-taking' }],
			TabCur: 0,
			currPage: 1,
			pageSize: 5,
			totalPage: 0,
			reservationList: []
		};
	},
	props: {},
	methods: {
		tabChange(index) {
			this.TabCur = index;
		},
		loadMore() {
			console.log(1111)
		},
		queryOrder() {
			if(this.TabCur === 0) {
				this.queryReservationList()
			}
		},
		queryReservationList() {
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
					this.reservationList = res.page.list;
				});
		}
	},
	mounted() {
		this.queryOrder()
	},
	computed: {
		...mapGetters({})
	},
	components: { WucTab }
};
</script>

<style lang="scss" type="text/scss" scoped>
.order-main {
	.order-content {
		margin-top: 10upx;
		.search-list {
			height: calc(100vh - 100upx);
			.reservation-detail {
				box-shadow: 0 0 10px 0 rgba(105, 126, 255, 0.15);
				border: 1px solid #dddee1;
				border-radius: 10upx;
				padding: 10upx 20upx;
				margin-bottom: 20upx;
				.order-name {
					.status-name {
						color: #0097ff;
					}
				}
				.order-content-main {
					padding: 20upx 0;
				}
				.order-action {
					padding: 20upx 0 10upx;
					.delete-icon {
						float: right;
						color: #ff4040;
						border: 1upx solid #ff4040;
						border-radius: 25upx;
						font-size: 24upx;
						padding: 10rpx 0;
						width: 120rpx;
						text-align: center;
					}
					.detail-icon {
						color: #0097ff;
						border: 1upx solid #0097ff;
						margin-left:20rpx;
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
		}
	}
}
</style>
