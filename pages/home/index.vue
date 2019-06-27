<template>
	<view class="search-main">
		<view class="search-container">
			<image :src="backgroundImg" style="width: 100%;height: 100%;"></image>
			<view class="search-button uni-flex uni-row" style="position: absolute;">
				<image src="../../static/img/searchIcon.png" class="search-icon"></image>
				<view class="search-text" @click="searchClick()">Search</view>
			</view>
		</view>
		<!-- menu -->
		<view>
			<view style="position: relative;height: 104upx;">
				<choose-cade style="position: absolute;top: -104upx;height: 104upx;width: 100%;" :list="list" @chooseLike="chooseLike()"></choose-cade>
			</view>

			<view class="bg-white padding text-black">
				<scroll-view class="search-list" scroll-y @scrolltolower="loadMore()">
					<block v-for="(item, index) in storeList" :key="index">
						<view class="uni-tab-bar-loading">
							<view class="uni-flex uni-row" @click="storeDetailClick(item)">
								<view style="display: flex; justify-content: center;align-items: center;">
									<image :src="item.logo" style="width: 150upx;height: 150upx;border-radius: 50%;"></image>
								</view>
								<view class="uni-flex uni-column" style="padding-left: 20upx;">
									<view class="title-name">{{ item.name || '-' }}</view>
									<view class="uni-flex uni-row">
										<view class="title-time" style="margin-right: 20upx;">Open Hours:</view>
										<view style="flex: 1;">
											<view class="title-time">Weekday {{ item.weekday || '-' }}</view>
											<view class="title-time">Weekend {{ item.weekend || '-' }}</view>
										</view>
									</view>
									<view class="title-text">Restaurant Category: {{ item.categoryDesc }}</view>
									<view class="title-text">Floor,Direction: {{ item.floorDesc }},{{ item.directionDesc }}</view>
								</view>
							</view>
						</view>
					</block>
					<view class="no_data_container uni-flex uni-column" v-if="storeList.length == 0">
						<image src="../../static/img/no-data.png" style="width: 300upx;height: 300upx"></image>
						<view style="justify-content:center;font-size: 40upx;margin-top: 20upx ">No data</view>
					</view>
				</scroll-view>
			</view>
		</view>

		<!-- 登录 -->
		<deng-lu v-if="openId.length === 0"></deng-lu>
	</view>
</template>

<script>
import { ChooseCade } from '../../components/choose-Cade/choose-Cade.vue';
import { mapGetters } from 'vuex';
import DengLu from '../../components/ah-denglu/denglu.vue';
export default {
	name: '',
	data() {
		return {
			list: [
				{
					name: 'Location',
					value: 'floorLevel'
				},
				{
					name: '	Promotion',
					value: ''
				},
				{
					name: '	Categories',
					value: 'categories'
				}
			],
			TabCur: 0,
			storeList: [],
			pageSize: 10,
			pageNo: 1,
			currentPageNo: 1,
			totalPage: 0,
			floorLevel: '',
			direction: '',
			categories: '',
			floorLevelParam: [],
			directionParam: [],
			categoriesParam: [],
			backgroundColor: '',
			backgroundImg: ''
		};
	},

	props: {},
	onLoad(e) {
		uni.startPullDownRefresh();
	},
	methods: {
		onPullDownRefresh() {
			this.getConfig();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		loadMore() {
			if (this.currentPageNo < this.totalPage) {
				this.currentPageNo++;
				this.pageChange(this.currentPageNo);
			}
		},
		pageChange(pageNo) {
			const param = {
				pageNo: pageNo,
				pageSize: this.pageSize,
				floorLevel: this.floorLevel,
				direction: this.direction,
				categories: this.categories
			};
			this.$request
				.get('/entry/wxapp/queryStore', {
					data: param
				})
				.then(res => {
					res.page.list.forEach(storeItem => {
						let cate = this.getCategoryFilter(storeItem.categories);
						let floor = this.getFloorFilter(storeItem.floorLevel);
						let direction = this.getDirectionFilter(storeItem.direction);
						this.$set(storeItem, 'categoryDesc', cate);
						this.$set(storeItem, 'floorDesc', floor);
						this.$set(storeItem, 'directionDesc', direction);
					});
					this.storeList = [...this.storeList, ...res.page.list];
				})
				.catch(error => {
					console.error('error:', error);
				});
		},
		queryStoreList() {
			const param = {
				pageNo: this.pageNo,
				pageSize: this.pageSize,
				floorLevel: this.floorLevel ? this.floorLevel : '',
				direction: this.direction ? this.direction : '',
				categories: this.categories ? this.categories : ''
			};
			this.$request
				.get('/entry/wxapp/queryStore', {
					data: param
				})
				.then(res => {
					this.storeList = res.page.list;
					this.currentPageNo = res.page.currPage;
					this.totalPage = res.page.totalPage;
					this.storeList.forEach(storeItem => {
						let cate = this.getCategoryFilter(storeItem.categories);
						let floor = this.getFloorFilter(storeItem.floorLevel);
						let direction = this.getDirectionFilter(storeItem.direction);
						this.$set(storeItem, 'categoryDesc', cate);
						this.$set(storeItem, 'floorDesc', floor);
						this.$set(storeItem, 'directionDesc', direction);
					});
				})
				.catch(error => {
					console.error('error:', error);
				});
		},
		searchClick() {
			uni.navigateTo({
				url: '/pages/home/store/searchStore'
			});
		},
		chooseLike(tabName, index1, index2) {
			this.floorLevel = '';
			this.direction = '';
			this.categories = '';
			if (tabName === 'floorLevel') {
				this.floorLevel = index1;
				this.direction = index2;
			} else {
				this.categories = index1;
			}
			this.queryStoreList();
		},
		storeDetailClick(item) {
			uni.navigateTo({
				url: '/pages/home/store/index?storeId=' + item.id
			});
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
					this.queryStoreList();
				})
				.catch(error => {
					console.error(error);
				});
		},
		querySystem() {
			this.$request
				.get('/entry/wxapp/system')
				.then(res => {
					this.backgroundColor = res.system.color;
					this.backgroundImg = res.system.linkLogo;
					uni.setNavigationBarTitle({
						title: res.system.linkName
					});
					wx.setNavigationBarColor({
						frontColor: '#ffffff',
						backgroundColor: res.system.color
					});
					this.$store.commit('setSystemInfo', res.system);
				})
				.catch(error => {
					console.error(error);
				});
		}
	},
	mounted() {
		this.querySystem();
	},
	computed: {
		...mapGetters({
			openId: 'openId'
		})
	},
	components: {
		ChooseCade,
		DengLu
	},
	filters: {}
};
</script>

<style lang="scss">
.search-main {
	height: 100vh;

	.search-container {
		position: relative;
		height: 400upx;
		.search-button {
			position: absolute;
			width: 80%;
			top: 60%;
			left: 7%;
			background-color: #ffffff;
			padding: 20upx;
			height: 40upx;
			border-radius: 40upx;

			.search-icon {
				height: 40upx;
				width: 40upx;
				margin-right: 10upx;
			}

			.search-text {
				flex: 1;
				line-height: 40upx;
				color: #80838f;
			}
		}
	}

	.search-list {
		height: calc(100vh - 350upx);
	}

	.title-name {
		font-size: 30upx;
		line-height: 30upx;
		text-align: left;
		margin-bottom: 5upx;
	}

	.title-text {
		font-size: 24upx;
		color: #324057;
		line-height: 32upx;
	}

	.title-time {
		font-size: 22upx;
		color: #80838f;
	}

	.no_data_container {
		justify-content: center;
		align-items: center;
		height: 100%;
	}
}
</style>
