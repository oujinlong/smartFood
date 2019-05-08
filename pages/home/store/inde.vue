<template>
	<view class="home-container">
		<!-- picture -->
		<uni-swiper-dot :info="info" :current="current" field="content">
			<swiper class="swiper-box" autoplay="true" @change="change">
				<swiper-item v-for="(item ,index) in info" :key="index">
					<view class="swiper-item">
						<image :src="item.url" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>

		<!-- function -->
		<view class="uni-flex uni-row function-content" style="flex-wrap: wrap;">
			<view class="text function-item">
				<view class="item-content uni-flex uni-row">
					<view style="flex: 1">
						<view class="item-title">Reservation</view>
						<view class="item-detail">Table Reservation</view>
					</view>
					<image src="../../static/img/reservation.png" class="function-icon"></image>
				</view>
			</view>
			<view class="text function-item">
				<view class="item-content uni-flex uni-row">
					<view style="flex: 1">
						<view class="item-title">Scan</view>
						<view class="item-detail">Scan QRcode</view>
					</view>
					<image src="../../static/img/qrcode.png" class="function-icon"></image>
				</view>
			</view>
			<view class="text function-item">
				<view class="item-content uni-flex uni-row">
					<view style="flex: 1">
						<view class="item-title">Menu</view>
						<view class="item-detail">Order Menu</view>
					</view>
					<image src="../../static/img/orderList.png" class="function-icon"></image>
				</view>
			</view>
			<view class="text function-item">
				<view class="item-content uni-flex uni-row">
					<view style="flex: 1">
						<view class="item-title">Payment</view>
						<view class="item-detail">Payment</view>
					</view>
					<image src="../../static/img/payment.png" class="function-icon"></image>
				</view>
			</view>
		</view>

		<!--Merchants Info-->
		<view class="uni-list" style="margin-bottom: 20urp;">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-column">
					<view class="flex-item" style="color: #596071;">Merchants Info</view>
					<view class="flex-item">
						<view class="uni-flex uni-row title_view">
							<view class="text" style="width: 220upx;height: 220upx;display: flex; justify-content: center;align-items: center;">
								<image src="../../static/img/logo.jpg" style="width: 150upx;height: 150upx;border-radius: 50%;"></image>
							</view>
							<view class="uni-flex uni-column" style="padding-left: 10upx;">
								<view class="title-name">Pavilion KL</view>
								<view class="uni-flex uni-row title-text">$100/perosen</view>
								<view class="uni-flex uni-row title-text">Announcement: Dine in,take away & table reservation</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row">
					<view class="title-content" style="margin-right: 20upx;">Business hours</view>
					<view class="title-content">8:00-23:00</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row">
					<view class="title-content" style="margin-right: 20upx;">Telephone</view>
					<view class="title-content">60321411123</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row">
					<view class="title-content" style="margin-right: 20upx;">Address</view>
					<view class="title-content">C3.04.00 Level 3 Pavilion KL,168 Jalan Bukit Bintang,55100 Kuala Lumpur</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="title-content">Environment</view>
			</view>
		</view>

		<!-- menu -->
		<view style="margin-top: 20upx;">
			<wuc-tab :tab-list="tabList" :tabCur.sync="TabCur" tab-class="text-center bg-white" select-class="text-blue" @change="tabChange">
			</wuc-tab>
			<view class="bg-white padding text-black" style="margin-top: 10upx;">
				<order-menu></order-menu>
				{{tabList[TabCur].name}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		uniSwiperDot,
		uniList,
		uniListItem
	} from '@dcloudio/uni-ui'
	import {
		WucTab
	} from "@/components/wuc-tab/wuc-tab.vue";
	import OrderMenu from './child/orderMenu.vue'
	export default {
		components: {
			uniSwiperDot,
			uniList,
			uniListItem,
			WucTab,
			OrderMenu
		},
		data() {
			return {
				info: [{
						url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/shuijiao.jpg',
						content: '内容 A'
					},
					{
						url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/muwu.jpg',
						content: '内容 B'
					},
					{
						url: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/cbd.jpg',
						content: '内容 C'
					},
				],
				current: 0,
				tabList: [{
						name: "Order Memus"
					},
					{
						name: "Comments"
					}
				],
				TabCur: 0
			}
		},
		mounted() {
			this.queryAd()
		},
		methods: {
			change(e) {
				this.current = e.detail.current;
			},
			tabChange(index) {
				this.TabCur = index;
			},
			queryAd() {
				const param = {
					pageNo: 'name',
					pageSize: 10,
					searchText: '11'
				}
				this.$request
					.get("/entry/wxapp/searchStore", {
						data: param
					})
					.then(res => {
						console.log(res);
					})
					.catch(error => {
						console.error('error:', error);
					});
			}
		}
	}
</script>

<style lang="scss">
	.home-container {
		background-color: #F4F4F4;

		.title-name {
			font-size: 40upx;
			height: 60upx;
			text-align: left;
			padding: 20upx 0 10upx;
		}

		.title-text {
			font-size: 25upx;
			color: #80838F;
		}

		.title-content {
			font-size: 28upx;
			color: #80838F;
		}

		.swiper-box {
			height: 400upx;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			background: #eee;
			color: #fff;
		}

		.swiper-item image {
			width: 100%;
			height: 100%;
		}

		.function-content {
			padding: 20upx 0upx 0upx;

			.function-item {
				width: 50%;

				.item-content {
					background-color: white;
					border-radius: 10upx;
					margin: 0upx 15upx 20upx;
					padding: 20upx;

					.item-title {
						margin-bottom: 20upx;
						line-height: 28upx;
					}

					.item-detail {
						font-size: 25upx;
						line-height: 25upx;
						color: #80838F;
					}
				}
			}

			.function-icon {
				width: 50upx;
				height: 50upx;
				margin-top: 11upx;
			}
		}
	}
</style>
