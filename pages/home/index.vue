<template>
	<view class="search-main">
		<scroll-view class="search-list" scroll-y @scrolltolower="loadMore()" upper-threshold="150" @scroll="upperClick" @scrolltoupper="upper">
			<view class="search-container" v-show="isShowTop">
				<image :src="backgroundImg" style="width: 100%;height: 100%;"></image>
				<view class="search-button uni-flex uni-row" style="position: absolute;" @click="searchClick()">
					<image src="../../static/img/searchIcon.png" class="search-icon"></image>
					<view class="search-text">{{ i18n.search }}</view>
				</view>
			</view>
			<!-- menu -->
			<view class="choose-content" :class="{ 'choose-top': isClick }">
				<view style="position: relative;height: 104upx;background-color: white;" :class="{'is-choose-top': !isShowTop}">
					<choose-cade class="choose-cade" :list="list" @chooseLike="chooseLike()" @clickTop="clickTop" @close="cancelTop" :isPromotion="isPromotion"></choose-cade>
					<view class="promotion-title" @click="clickPromotion" :class="{ 'promotion-click': isPromotion }">
						{{ i18n.promotion }}
						<image src="../../static/img/promotion.png" class="promotion-icon"></image>
					</view>
				</view>
				<view class="bg-white padding text-black" style="padding-top: 0;" :class="{'is-content-top': !isShowTop}">
					<block v-for="(item, index) in storeList" :key="index">
						<view class="uni-tab-bar-loading">
							<view class="uni-flex uni-row" @click="storeDetailClick(item)">
								<view style="display: flex; justify-content: center;align-items: center;">
									<image :src="item.logo" style="width: 150upx;height: 150upx;border-radius: 50%;"></image>
								</view>
								<view class="uni-flex uni-column" style="padding-left: 20upx;">
									<view class="title-name">{{ item.name || '-' }}</view>
									<view class="uni-flex uni-row">
										<view class="title-time" style="margin-right: 20upx;">{{ i18n.openHours }}:</view>
										<view style="flex: 1;">
											<view class="title-time">{{ i18n.Weekday }} {{ item.weekdayView || '-' }}</view>
											<view class="title-time">{{ i18n.Weekend }} {{ item.weekendView || '-' }}</view>
										</view>
									</view>
									<view class="title-time">{{ i18n.RestaurantCategory }}: {{ item.categoryDesc }}</view>
									<view class="title-time">{{ i18n.FloorDirection }}: {{ item.floorDesc }},{{ item.directionDesc }}</view>
								</view>
							</view>
						</view>
					</block>
					<view class="no_data_container uni-flex uni-column nodata-content" v-if="storeList.length == 0">
						<image src="../../static/img/no-data.png" style="width: 300upx;height: 300upx"></image>
						<view style="justify-content:center;font-size: 40upx;margin-top: 20upx ">{{ i18n.Nodata }}</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 登录 -->
		<deng-lu v-if="openId.length === 0"></deng-lu>
    
    <maskAndContent
		type="twoDimensionSwiper" 
		:imageArray="adImages" 
		ref="maskAndContent"
		 @tapImage="tapImage" 
		 hideTabBar
		 everyTimeCountSwiperHeight
     :closeContent = "closeTip"
 		 :dataSet="adDataSet"
     ></maskAndContent>
	</view>
</template>

<script>
import { ChooseCade } from '../../components/choose-Cade/choose-Cade.vue';
import { mapGetters } from 'vuex';
import DengLu from '../../components/ah-denglu/denglu.vue';
import maskAndContent from '../../components/QS-maskAndContent/QS-maskAndContent.vue'
export default {
	name: '',
	data() {
		return {
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
			backgroundImg: '',
			isClick: false,
			isPromotion: false,
      adDataSet: {
					previous_margin: '10px',
					next_margin: '10px',
					indicator_dots: true,
					indicator_active_color: '#fff'
				},
			ads: [],
      showAds: false,
      isShowTop: true
		};
	},
	props: {},
	onLoad(e) {
		uni.startPullDownRefresh();
	},
	methods: {
    upper(event) {
      this.isShowTop = true
			console.log(event)
		},
    upperClick(event) {
			if(event.detail.scrollTop > 150) {
			  this.isShowTop = false
      }
		},
    openMaskAndContent() {
				this.$refs.maskAndContent.show();
			},
			tapImage(obj) {
        const index = obj.index
        const storeId = this.ads[index].src
        uni.navigateTo({
        	url: 'store/index?storeId=' + storeId
        })
        this.$refs.maskAndContent.hide()
			},
		onPullDownRefresh() {
			this.getConfig()
      this.loadScreenAd()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		clickTop() {
			this.isClick = true;
			this.isPromotion = false;
		},
		cancelTop() {
			this.isClick = false;
		},
		mergestoreList() {
			this.storeList.forEach(storeItem => {
				let cate = this.getCategoryFilter(storeItem.categories);
				let floor = this.getFloorFilter(storeItem.floorLevel);
				let direction = this.getDirectionFilter(storeItem.direction);
				this.$set(storeItem, 'categoryDesc', cate);
				this.$set(storeItem, 'floorDesc', floor);
				this.$set(storeItem, 'directionDesc', direction);
			});
		},
		clickPromotion() {
			this.isPromotion = true;
			this.currentPageNo = 1;
			const param = {
				pageNo: this.pageNo,
				pageSize: this.pageSize
			};
			this.$request
				.get('/entry/wxapp/storeList', {
					data: param
				})
				.then(res => {
					this.storeList = res.page.list;
					this.currentPageNo = res.page.currPage;
					this.totalPage = res.page.totalPage;
					this.mergestoreList();
				})
				.catch(error => {
					console.error('error:', error);
				});
		},
		loadMore() {
			if (this.currentPageNo < this.totalPage) {
				this.currentPageNo++;
				if (this.isPromotion) {
					this.promotionPageChange(this.currentPageNo);
				} else {
					this.pageChange(this.currentPageNo);
				}
			}
		},
		promotionPageChange(pageNo) {
			const param = {
				pageNo: pageNo,
				pageSize: this.pageSize
			};
			this.$request
				.get('/entry/wxapp/storeList', {
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
		pageChange(pageNo) {
			const param = {
				pageNo: pageNo,
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
					this.mergestoreList();
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
				if (list.length === 0) {
					return '-';
				} else {
					return list[0].remark;
				}
			} else {
				return '-';
			}
		},
		getDirectionFilter(value) {
			if (value && value !== undefined && value !== null) {
				let list = this.directionParam.filter(item => {
					if (item.paramValue === value) {
						return item;
					}
				});
				if (list.length === 0) {
					return '-';
				} else {
					return list[0].remark;
				}
			} else {
				return '-';
			}
		},
		getFloorFilter(value) {
			if (value && value !== undefined && value !== null) {
				let list = this.floorLevelParam.filter(item => {
					if (item.paramValue === value) {
						return item;
					}
				});
				if (list.length === 0) {
					return '-';
				} else {
					return list[0].remark;
				}
			} else {
				return '-';
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
		},
    loadScreenAd () {
      this.$request.get('/entry/wxapp/openScreenAd')
      .then(res => {
        if (res.code === 0 && res.adList && res.adList.length > 0) {
          this.ads = res.adList
          this.openMaskAndContent()
        }
      }).catch(error => {
        
      })
    }
	},
	mounted() {
		this.querySystem();
    wx.setTabBarItem({
			index: 0,
			text: this.i18n.common.Home
		})
    wx.setTabBarItem({
      index: 1,
      text: this.i18n.common.Order
    })
    wx.setTabBarItem({
      index: 2,
      text: this.i18n.common.more
    })
	},
	computed: {
		...mapGetters({
			openId: 'openId'
		}),
		i18n() {
			return this.$t('index');
		},
		list() {
      let res = []
      res.push({
					name: this.i18n.location,
					value: 'floorLevel'
				})
        res.push({
					name: this.i18n.Categories,
					value: 'categories'
				})
			return res
		},
    adImages () {
      let res = []
      this.ads.forEach((item, index) => {
//         let imgs = []
//         imgs.push(item.logo)
//         res.push(imgs)
          res.push(item.logo)
      })
      return [res]
    },
    closeTip () {
      return this.i18n.adCloseTip
    }
	},
	components: {
		ChooseCade,
		DengLu,
    maskAndContent
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
			top: 77%;
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

	.choose-top {
		width: 100%;
		position: fixed;
		top: 0;
	}
	.choose-content {
	  .is-choose-top {
			position: fixed !important;
			top:0 !important;
			width: 100vw !important;
			z-index: 9999;
			position: -webkit-sticky ;
			position: sticky;

		}
		.is-content-top {
			margin-top: 104upx !important;
		}
		.choose-cade {
			position: absolute;
			top: 0;
			height: 104upx;
			width: 66.67%;
		}
		.promotion-title {
			width: 33.34%;
			float: right;
			height: 104upx;
			line-height: 104upx;
			text-align: center;
			.promotion-icon {
				height: 40upx;
				width: 40upx;
			}
		}
		.promotion-click {
			color: #f0ad4e;
		}
	}
	.search-list {
		height: 100vh;
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
		font-size: 24upx;
		color: #80838f;
	}

	.no_data_container {
		justify-content: center;
		align-items: center;
		height: 100%;
	}
  
  .home-ad {
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
}
.nodata-content {
	height: calc(100vh - 534upx) !important;
}
</style>
