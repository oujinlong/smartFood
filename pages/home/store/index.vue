<template>
	<view class="home-container">
		<!-- picture -->
		<uni-swiper-dot :info="info" :current="current" field="content">
			<swiper class="swiper-box" autoplay="true" @change="change" v-if="info.length > 0">
				<swiper-item v-for="(item, index) in info" :key="index">
					<view class="swiper-item"><image :src="item" mode="aspectFill"></image></view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>

		<!-- function -->
		<view class="uni-flex uni-row function-content" style="flex-wrap: wrap;">
			<view class="text function-item" v-if="storeInfo.isYy == 1" @click="goTableReservation()">
				<view class="item-content uni-flex uni-row">
					<view style="flex: 1">
						<view class="item-title">{{ i18n.Reservation }}</view>
						<view class="item-detail">{{ i18n.store.TableReservation }}</view>
					</view>
					<image src="../../../static/img/reservation.png" class="function-icon"></image>
				</view>
			</view>
			<view class="text function-item" v-if="storeInfo.isDn == 1" @click="goScan">
				<view class="item-content uni-flex uni-row">
					<view style="flex: 1">
						<view class="item-title">{{ i18n.DinedIn }}</view>
						<view class="item-detail">{{ i18n.store.ScanQRcode }}</view>
					</view>
					<image src="../../../static/img/qrcode.png" class="function-icon"></image>
				</view>
			</view>
			<view class="text function-item" v-if="storeInfo.isWm == 1" @click="goOrderMenu">
				<view class="item-content uni-flex uni-row">
					<view style="flex: 1">
						<view class="item-title">{{ i18n.SelfTaking }}</view>
						<view class="item-detail">{{ i18n.store.OrderMenu }}</view>
					</view>
					<image src="../../../static/img/orderList.png" class="function-icon"></image>
				</view>
			</view>
			<view class="text function-item" v-if="storeInfo.isPd == 1">
				<view class="item-content uni-flex uni-row">
					<view style="flex: 1">
						<view class="item-title">{{ i18n.store.Payment }}</view>
						<view class="item-detail">{{ i18n.store.Payment }}</view>
					</view>
					<image src="../../../static/img/payment.png" class="function-icon"></image>
				</view>
			</view>
		</view>

		<!--Merchants Info-->
		<view class="uni-list" style="margin-bottom: 20urp;">
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-column" style="width: 100%;">
					<view class="flex-item uni-flex uni-row justify-between" style="color: #596071;margin-bottom: 10upx;">
            <text>{{ i18n.store.MerchantsInfo }}</text>
            <view v-bind:style="{backgroundColor: storeColor ? storeColor : '#ce2029', paddingLeft: '10px', paddingRight: '10px', height: '24px',borderRadius: '12px'}">
              <text style="color: #ffffff;lineHeight: 20px;width: '100%';fontSize:14px">{{merchantClosed ? i18n.merchantCloseStatusClose : i18n.merchantCloseStatusOpen}}</text>
            </view>
          </view>
					<view class="flex-item">
						<view class="uni-flex uni-row">
							<view class="text" style="display: flex; justify-content: center;align-items: center;">
								<image :src="storeInfo.logo" style="width: 150upx;height: 150upx;border-radius: 50%;"></image>
							</view>
							<view class="uni-flex uni-column" style="padding-left: 20upx;">
								<view class="title-name">{{ storeInfo.name || '-' }}</view>
								<view class="uni-flex uni-row title-text">{{ i18n.store.Announcement }}: {{ storeInfo.announcement || '-' }}</view>
							</view>
						</view>
					</view>

          <view class="flex-item"  >
          	<view class="uni-swiper-msg" style="height: 60upx;" v-if= 'reductionList.length> 0'>
          		<view class="uni-swiper-msg-icon"><image src="/static/img/sales2.png" mode="widthFix" ></image></view>
          		<swiper vertical="true" autoplay="true" circular="true" interval="3000">
          			<swiper-item v-for="(item, index) in reductionList" :key="index">
          				<navigator  class="title-content">{{ item.name }}</navigator>
          			</swiper-item>
          		</swiper>
          	</view>
          </view>

				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row">
					<view class="title-content" style="margin-right: 20upx;">{{ i18n.openHours }}:</view>
					<view class="title-content">
						<view class="title-time">{{ i18n.Weekday }} {{ storeInfo.weekday || '-' }}</view>
						<view class="title-time">{{ i18n.Weekend }} {{ storeInfo.weekend || '-' }}</view>
					</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="title-content" style="margin-right: 20upx;">{{ i18n.RestaurantCategory }}:</view>
					<view class="title-content" style="flex: 1;">{{ storeInfo.categoryDesc || '-' }}</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="title-content" style="margin-right: 20upx;">{{ i18n.FloorDirection }}:</view>
					<view class="title-content" style="flex: 1;">{{ storeInfo.floorDesc || '-' }},{{ storeInfo.directionDesc || '-' }}</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd" @click="clickTel()">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="title-content" style="margin-right: 20upx;">{{ i18n.common.Telephone }}:</view>
					<view class="title-content" style="flex: 1;">{{ storeInfo.tel || '-' }}</view>
					<uni-icon size="20" type="arrowright" color="#80838F" class="arrow-right-icon"></uni-icon>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd" @click="addressHandle">
				<view class="uni-flex uni-row" style="width: 100%;">
					<view class="title-content" style="margin-right: 20upx;">{{ i18n.common.Address }}:</view>
					<view class="title-content" style="flex: 1;">{{ storeInfo.address || '-' }}</view>
					<uni-icon size="20" type="arrowright" color="#80838F" class="arrow-right-icon"></uni-icon>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-pd" @click="aboutUsClick">
				<view class="title-content" style="flex: 1;">{{ i18n.common.AboutUs }}:</view>
				<uni-icon size="20" type="arrowright" color="#80838F" class="arrow-right-icon"></uni-icon>
			</view>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import { uniSwiperDot, uniList, uniListItem, uniIcon } from '@dcloudio/uni-ui';
import { compact } from 'lodash';
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
			categoriesParam: [],
      reductionList: []
		};
	},
	computed: {
		...mapGetters({
			userInfo: 'userInfo',
      storeColor: 'storeColor'
		}),
    i18n() {
    	return this.$t('index');
    },
    merchantClosed () {
      const storeInfo = this.storeInfo
      if (storeInfo.isRest === 1) {
        return true
      }
    
      const nowDate = new Date()
      const day =  "7123456".charAt(nowDate.getDay());
      const isWeekend = day === '7' || day === '6'
      const timeRangStr = isWeekend ? storeInfo.weekend : storeInfo.weekday
      
      if (timeRangStr) {
         const timeList = timeRangStr.split('-')
         const startTime = timeList[0]
         const endTime = timeList[1]
         
         const startTimeList = startTime.split(':')
         const endTimeList = endTime.split(':')
         
         const startHour = startTimeList[0]
         const startMin = startTimeList[1]
         const endHour = endTimeList[0]
         const endMin = endTimeList[1]
         
         const year = nowDate.getFullYear()
         const month = nowDate.getMonth()
         const day = nowDate.getDate()
        
         const start = year + '/' + month + '/' + day + ' ' + startHour + ':' + startMin + ':00'
         const end = year + '/' + month + '/' + day + ' ' + endHour + ':' + endMin + ':00'
 
         let dateTmp = start.replace(/-/g,'/')
         const startTimeStamp = Date.parse(dateTmp)
         dateTmp = end.replace(/-/g,'/')
         const endTimeStamp = Date.parse(dateTmp)
         const nowTimeStamp = nowDate.getTime()
         return (nowTimeStamp < endTimeStamp && nowTimeStamp > startTimeStamp)
      }
     
      
      return true
    }
	},
	mounted() {
		// this.queryAd();
		this.getConfig();
    this.queryReduction()
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
					this.queryStoreInfo();
				})
				.catch(error => {
					console.error(error);
				});
		},
		queryStoreInfo() {
		  this.info = []
			const param = {
				userId: this.userInfo.userId,
				storeId: this.storeId
			};
			this.$request
				.get('/entry/wxapp/store', {
					data: param
				})
				.then(res => {
					this.storeInfo = res.store;
			var imgTemp = [];
			if (this.storeInfo.img != '' && this.storeInfo.img !=null) {
				imgTemp = this.storeInfo.img.split(',');
			}
			this.info = imgTemp;
					this.info = compact(this.info);
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
					wx.setNavigationBarColor({
						frontColor: '#ffffff',
						backgroundColor: res.store.color
					});
					this.$store.commit('setStoreColor', res.store.color);
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
      if (this.merchantClosed) {
        uni.showToast({
        	title: this.i18n.merchantCloseTip,
          icon: 'none'
        })
        return
      }
			uni.navigateTo({
				url: '/pages/home/child/tableReservation?storeId=' + this.storeId
			});
		},
		goOrderMenu() {
      if (this.merchantClosed) {
        uni.showToast({
       	title: this.i18n.merchantCloseTip,
         icon: 'none'
       })
        return
      }
			uni.navigateTo({
				url: '../child/menu/orderMenu?storeId=' + this.storeId + '&dishesType=1'
			});
		},
		aboutUsClick() {
			uni.navigateTo({
				url: '/pages/home/store/aboutUs?storeId=' + this.storeId
			});
		},
    goScan () {
      if (this.merchantClosed) {
        uni.showToast({
       	title: this.i18n.merchantCloseTip,
         icon: 'none'
       })
        return
      }
      uni.navigateTo({
      	url: '../child/menu/orderMenu?storeId=' + this.storeId + '&dishesType=2&tableId=1'
      });
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
    addressHandle () {
      // https://www.google.com/maps/search/?api=1&query=47.5951518,-122.3316393
      
      // const addresUrl = 'https://www.google.com/maps/search/?api=1&query=47.5951518,-122.3316393'
      const list = this.storeInfo.coordinates.split(',')
      uni.navigateTo({
      	url: '/pages/map/index?lat=' + list[0] + '&lon=' + list[1] + '&name=' + this.storeInfo.name + '&address=' + this.storeInfo.address
      })
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
