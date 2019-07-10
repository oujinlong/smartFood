<template>
	<view>
		<view class="search-container">
			<image :src="backgroundImg" style="width: 100%;height: 100%;"></image>
			<input class="search-input" confirm-type="search" focus :placeholder="i18n.store.KeySearch" placeholder-class="search-placeholder-class" @confirm="searchStoreClick" />
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
									<view class="title-time" style="margin-right: 20upx;">{{ i18n.openHours }}:</view>
									<view style="flex: 1;">
										<view class="title-time">{{ i18n.Weekday }} {{ item.weekday || '-' }}</view>
										<view class="title-time">{{ i18n.Weekend }} {{ item.weekend || '-' }}</view>
									</view>
								</view>
								<view class="title-time">{{ i18n.RestaurantCategory }}: {{ item.categoryDesc || '-' }}</view>
								<view class="title-time">{{ i18n.FloorDirection }}: {{ item.floorDesc || '-' }},{{ item.directionDesc || '-' }}</view>
							</view>
						</view>
					</view>
				</block>
				<view class="no_data_container uni-flex uni-column" v-if="storeList.length == 0">
					<image src="../../../static/img/no-data.png" style="width: 300upx;height: 300upx"></image>
					<view style="justify-content:center;font-size: 40rpx;margin-top: 20rpx ">{{ i18n.Nodata }}</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	name: '',
	data() {
		return {
			storeList: [],
			searchText: '',
			pageSize: 10,
			pageNo: 1,
			currentPageNo: 1,
			totalPage: 0,
			floorLevelParam: [],
			directionParam: [],
			categoriesParam: [],
			backgroundImg: ''
		};
	},
	props: {},
	methods: {
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
				searchText: this.searchText
			};
			this.$request
				.get('/entry/wxapp/searchStore', {
					data: param
				})
				.then(res => {
					res.store.list.forEach(storeItem => {
						let cate = this.getCategoryFilter(storeItem.categories);
						let floor = this.getFloorFilter(storeItem.floorLevel);
						let direction = this.getDirectionFilter(storeItem.direction);
						this.$set(storeItem, 'categoryDesc', cate);
						this.$set(storeItem, 'floorDesc', floor);
						this.$set(storeItem, 'directionDesc', direction);
					});
					this.storeList = [...this.storeList, ...res.store.list];
				})
				.catch(error => {
					console.error('error:', error);
				});
		},
		searchStoreClick(event) {
			this.searchText = event.target.value;
			const param = {
				pageNo: this.pageNo,
				pageSize: this.pageSize,
				searchText: this.searchText
			};
			this.$request
				.get('/entry/wxapp/searchStore', {
					data: param
				})
				.then(res => {
					this.storeList = res.store.list;
					this.currentPageNo = res.store.currPage;
					this.totalPage = res.store.totalPage;
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
					this.storeList = [];
					console.error('error:', error);
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
		storeDetailClick(item) {
			uni.navigateTo({
				url: '/pages/home/store/index?storeId=' + item.id
			});
		},
		getConfig() {
			this.floorLevelParam = [];
			this.directionParam = [];
			this.categoriesParam = [];
			this.$request
				.get('/entry/wxapp/getParams', {
					data: {
						param: 'floorLevel'
					}
				})
				.then(res => {
					this.floorLevelParam = res.params;
				});
			this.$request
				.get('/entry/wxapp/getParams', {
					data: {
						param: 'direction'
					}
				})
				.then(res => {
					this.directionParam = res.params;
				});
			this.$request
				.get('/entry/wxapp/getParams', {
					data: {
						param: 'categories'
					}
				})
				.then(res => {
					this.categoriesParam = res.params;
				});
		},
		querySystem() {
			this.$request
				.get('/entry/wxapp/system')
				.then(res => {
					this.backgroundImg = res.system.linkLogo;
				})
				.catch(error => {
					console.error(error);
				});
		}
	},
	mounted() {
		this.querySystem();
		this.getConfig();
		wx.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: this.systemInfo.color
		});
	},
	computed: {
		...mapGetters({
			systemInfo: 'systemInfo'
		}),
		backgroundColor() {
			return this.systemInfo.color;
		},
    i18n() {
      return this.$t('index');
    }
	},
	components: {}
};
</script>

<style lang="scss">
.search-container {
	text-align: center;
	position: relative;
	height: 400upx;
	.search-input {
		position: absolute;
		width: 80%;
		top: 77%;
		left: 10%;
		background-color: #ffffff;
		padding: 20upx;
		height: 80upx;
		line-height: 80upx;
		border-radius: 40upx;
	}
	.search-placeholder-class {
		line-height: 80upx;
	}
}

.search-list {
	height: calc(100vh - 240upx);
}

.title-name {
	font-size: 30upx;
	height: 30upx;
	text-align: left;
	padding-bottom: 20upx;
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
</style>
