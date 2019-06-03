<template>
	<view class="home-container">
		<!-- picture -->
		<uni-swiper-dot :info="info" :current="current" field="content">
			<swiper class="swiper-box" autoplay="true" @change="change">
				<swiper-item v-for="(item, index) in info" :key="index">
					<view class="swiper-item"><image :src="item.logo" mode="aspectFill"></image></view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>

		<!-- function -->
		<view class="uni-flex uni-row function-content" style="flex-wrap: wrap;">
			<view class="text function-item" v-if="storeInfo.isYy == 1" @click="goTableReservation()">
				<view class="item-content uni-flex uni-row">
					<view style="flex: 1">
						<view class="item-title">Reservation</view>
						<view class="item-detail">Table Reservation</view>
					</view>
					<image src="../../../static/img/reservation.png" class="function-icon"></image>
				</view>
			</view>
			<view class="text function-item" v-if="storeInfo.isDn == 1">
				<view class="item-content uni-flex uni-row">
					<view style="flex: 1">
						<view class="item-title">Scan</view>
						<view class="item-detail">Scan QRcode</view>
					</view>
					<image src="../../../static/img/qrcode.png" class="function-icon"></image>
				</view>
			</view>
			<view class="text function-item" v-if="storeInfo.isWm == 1" @click="goOrderMenu">
				<view class="item-content uni-flex uni-row">
					<view style="flex: 1">
						<view class="item-title">Menu</view>
						<view class="item-detail">Order Menu</view>
					</view>
					<image src="../../../static/img/orderList.png" class="function-icon"></image>
				</view>
			</view>
			<view class="text function-item" v-if="storeInfo.isPd == 1">
				<view class="item-content uni-flex uni-row">
					<view style="flex: 1">
						<view class="item-title">Payment</view>
						<view class="item-detail">Payment</view>
					</view>
					<image src="../../../static/img/payment.png" class="function-icon"></image>
				</view>
			</view>
		</view>

		<!--Merchants Info-->
		<view class="uni-list" style="margin-bottom: 20urp;">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-column">
					<view class="flex-item" style="color: #596071;margin-bottom: 10upx;">Merchants Info</view>
					<view class="flex-item">
						<view class="uni-flex uni-row">
							<view class="text" style="display: flex; justify-content: center;align-items: center;">
								<image :src="storeInfo.logo" style="width: 150upx;height: 150upx;border-radius: 50%;"></image>
							</view>
							<view class="uni-flex uni-column" style="padding-left: 20upx;">
								<view class="title-name">{{ storeInfo.name || '-' }}</view>
								<view class="uni-flex uni-row title-text">Announcement: {{ storeInfo.announcement || '-' }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row">
					<view class="title-content" style="margin-right: 20upx;">Open Hours</view>
					<view class="title-content">
						<view class="title-time">Weekday {{storeInfo.weekday || '-'}}</view>
						<view class="title-time">Weekend {{storeInfo.weekend || '-' }}</view>
					</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="title-content" style="margin-right: 20upx;">Restaurant Category</view>
					<view class="title-content" style="flex: 1;">{{ storeInfo.categoryDesc || '-'}}</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="title-content" style="margin-right: 20upx;">Floor,Direction</view>
					<view class="title-content" style="flex: 1;">{{ storeInfo.floorDesc || '-'}},{{ storeInfo.directionDesc || '-'}}</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="title-content" style="margin-right: 20upx;">Telephone</view>
					<view class="title-content" style="flex: 1;">{{ storeInfo.tel || '-'}}</view>
					<uni-icon size="20" type="arrowright" color="#80838F" class="arrow-right-icon" @click="clickTel()"></uni-icon>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="title-content" style="margin-right: 20upx;">Address</view>
					<view class="title-content" style="flex: 1;">{{ storeInfo.address || '-'}}</view>
					<uni-icon size="20" type="arrowright" color="#80838F" class="arrow-right-icon"></uni-icon>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="title-content" style="flex: 1;">About Us</view>
				<uni-icon size="20" type="arrowright" color="#80838F" class="arrow-right-icon"></uni-icon>
			</view>
		</view>
	</view>
</template>

<script>
import { uniSwiperDot, uniList, uniListItem, uniIcon } from '@dcloudio/uni-ui';
export default {
	onLoad(e) {
		this.storeId = e.storeId || '';
	},
	components: {
		uniSwiperDot,
		uniList,
		uniListItem,
		uniIcon
	},
	data() {
		return {
			info: [],
			current: 0,
			storeId: '',
			storeInfo: {},
			floorLevelParam: [],
			directionParam: [],
			categoriesParam: []
		};
	},
	mounted() {
		this.queryAd();
		this.getConfig();
	},
	methods: {
		change(e) {
			this.current = e.detail.current;
		},
		getCategoryFilter(value) {
			if (value && value !== undefined && value !== null) {
				let list = this.categoriesParam.filter(item => {
					if (item.paramValue === value) {
						return item;
					}
				});
				return list[0].remark;
			} else {
				return '--';
			}
		},
		getDirectionFilter(value) {
			if (value && value !== undefined && value !== null) {
				let list = this.directionParam.filter(item => {
					if (item.paramValue === value) {
						return item;
					}
				});
				return list[0].remark;
			} else {
				return '--';
			}
		},
		getFloorFilter(value) {
			if (value && value !== undefined && value !== null) {
				let list = this.floorLevelParam.filter(item => {
					if (item.paramValue === value) {
						return item;
					}
				});
				return list[0].remark;
			} else {
				return '--';
			}
		},
		getConfig() {
			this.floorLevelParam = [];
			this.directionParam = [];
			this.categoriesParam = [];
			let p1 = new Promise((resolve, reject) => {
				this.$request
					.get('/entry/wxapp/getParams', {
						data: {
							param: 'floorLevel'
						}
					})
					.then(res => {
						this.floorLevelParam = res.params;
						resolve(res.params);
					});
			});

			let p2 = new Promise((resolve, reject) => {
				this.$request
					.get('/entry/wxapp/getParams', {
						data: {
							param: 'direction'
						}
					})
					.then(res => {
						this.directionParam = res.params;
						resolve(res.params);
					});
			});

			let p3 = new Promise((resolve, reject) => {
				this.$request
					.get('/entry/wxapp/getParams', {
						data: {
							param: 'categories'
						}
					})
					.then(res => {
						this.categoriesParam = res.params;
						resolve(res.params);
					});
			});
			Promise.all([p1, p2, p3])
				.then(res => {
					this.queryStoreInfo();
				})
				.catch(error => {
					console.error(error);
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
					let cate = this.getCategoryFilter(this.storeInfo.categories);
					let floor = this.getFloorFilter(this.storeInfo.floorLevel);
					let direction = this.getDirectionFilter(this.storeInfo.direction);
					this.$set(this.storeInfo, 'categoryDesc', cate);
					this.$set(this.storeInfo, 'floorDesc', floor);
					this.$set(this.storeInfo, 'directionDesc', direction);
					if (this.storeInfo.name && this.storeInfo.name !== '') {
						uni.setNavigationBarTitle({
							title: this.storeInfo.name
						});
					}
				})
				.catch(error => {
					console.error('error:', error);
				});
		},
		queryAd() {
			this.$request
				.get('/entry/wxapp/ad2')
				.then(res => {
					this.info = res.adList;
				})
				.catch(error => {
					console.error('error:', error);
				});
		},
		clickTel() {
			wx.makePhoneCall({
				phoneNumber: this.storeInfo.tel
			});
		},
		goTableReservation() {
			uni.navigateTo({
				url: '/pages/home/child/tableReservation?storeId=' + this.storeId
			});
		},
		goOrderMenu() {
			console.log('storeId:', this.storeId);
			uni.navigateTo({
				url: '../child/menu/orderMenu?storeId=' + this.storeId
			});
		}
	}
};
</script>

<style lang="scss">
.home-container {
	background-color: #f4f4f4;

	.title-name {
		font-size: 30upx;
		height: 40upx;
		text-align: left;
		padding: 10upx 0 20upx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.title-text {
		font-size: 25upx;
		color: #80838f;
		line-height: 35upx;
	}

	.title-content {
		font-size: 28upx;
		color: #80838f;
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

	.arrow-right-icon {
		display: flex;
		justify-content: center;
		align-items: center;
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
					color: #80838f;
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
