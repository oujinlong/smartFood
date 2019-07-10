<template>
	<view class="order-menu-main">
		<!-- 餐厅信息 -->
		<view class="uni-flex uni-column uni-list-cell-pd order-header" v-bind:style="{backgroundColor: storeColor ? storeColor : '#ce2029'}">
			<view class="flex-item">
				<view class="uni-flex uni-row">
					<view class="text" style="display: flex; justify-content: center;align-items: center;">
						<image :src="storeInfo.logo" style="width: 150upx;height: 150upx;border-radius: 50%;"></image>
					</view>
					<view class="uni-flex uni-column" style="padding-left: 20upx;">
						<view class="title-name">{{ storeInfo.name || '--' }}</view>
						<view class="uni-flex uni-row title-text">{{ i18n.store.Announcement }}: {{ storeInfo.announcement || '--' }}</view>
					</view>
				</view>
			</view>
			<view class="flex-item" style="margin-top: 15upx;" >
				<view class="uni-swiper-msg" style="height: 60upx;" v-if= 'reductionList.length> 0'>
					<view class="uni-swiper-msg-icon"><image src="/static/img/sales.png" mode="widthFix" ></image></view>
					<swiper vertical="true" autoplay="true" circular="true" interval="3000">
						<swiper-item v-for="(item, index) in reductionList" :key="index">
							<navigator style="color: white;font-size: 25upx;">{{ item.name }}</navigator>
						</swiper-item>
					</swiper>
				</view>
        
        <view class="uni-swiper-msg" style="height: 60upx;" v-else>
        </view>
			</view>
		</view>
		<!-- 功能切换 -->
		<wuc-tab :tab-list="tabList" :tabCur.sync="TabCur" @change="tabChange"></wuc-tab>
    <view v-if="TabCur === 0">
      <view class="content">

      <scroll-view class="menu-wrapper" scroll-y :style="'height:'+height+'px'">
        <view ref="menuWrapper">
          <!--  :class="{'current': currentIndex == index}" @click="selectMenu(index,$event)" -->
          <view style="position: relative;" v-bind:style="{color: storeColor ? storeColor : '#ce2029'}" v-for="(item,index) in goods" :key="index" ref="menuList" @click="select(index)"
           :class="{'current': currentIndex === index}">

            <view class="menu-item">
              <view>{{item.typeName}}</view>
              <view>{{item.typeNameCn}}</view>
            </view>
            <text class="allcount" v-if="getAllCount>=item.count&&item.count>0">{{item.count}}</text>
            <!-- <text class="allcount">1</text> -->
          </view>
        </view>
      </scroll-view>
      <!--  @scroll="scroll" -->
      <scroll-view class="foods-wrapper" scroll-y :style="'height:'+height+'px'" :scroll-top="foodSTop">
        <view ref="foodsWrapper">
          <view ref="foodList" class="foods" v-for="(item, i) in goods" :key="i">

            <view class="food-title" style="background: #f3f5f7">
              {{item.typeName}}
            </view>
            <view class="food" v-for="(food, index) in item.goods" :key="index">
              <image :src="food.img" mode="" style="width: 75px;height: 75px;margin-top: 6px;"></image>
              <view class="food-info">
                <text style="font-size: 15px;margin-top: 2px;">{{food.name}}</text>
                <!-- <text style="font-size: 13px;margin: 2px 0;">{{food.description}}</text> -->
               <!-- <text style="font-size: 13px;margin: 2px 0 4px;">{{food.num}}/Month</text>-->

                <!-- 加减 -->
                <view class="food-btm">
                  <text class="food-price" v-bind:style="{color: storeColor ? storeColor : '#ce2029'}"> MYR {{food.money}}</text>
                  <cartcontrol :food="food" @add="addCart" @dec="decreaseCart"></cartcontrol>							
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
      <shop-cart :goods="goods" @add="addCart" @dec="decreaseCart" @delAll="delAll" @next='nextHandle'></shop-cart>
      </view>
    </view>
	
    <view v-if = "TabCur === 1">
      <scroll-view style="height: calc(100vh - 100px);" scroll-y @scrolltolower="loadMoreComments()">
      
      <view class="uni-flex uni-row align-center" style="background-color: white;border-top: lightGray 1px solid;height:160upx">
        <view class="uni-flex uni-column justify-center align-center" style="width: 40%; padding: 12px">
          <view class="scoreTitle">{{scoreInfo.averageScore}}</view>
          <view>Total Score</view>
        </view>
        
        <view style="width: 2upx;border-left: lightGray 1px solid;height: 60%;">
        </view>
        
        <view class="uni-flex uni-row justify-center align-center" style="width: 60%; padding: 12px">
          <view style="margin-right: 20upx;">
             Rate:  
          </view>
          
          <view>
            <uni-rate  disabled = true :value="scoreInfo.averageScore"></uni-rate>
          </view>
          
        </view>  
      </view>
      
       <view class="uni-flex uni-row justify-between align-center" style = "background-color: white;margin-top: 20upx; padding: 30upx;">
        <view> Score: {{scoreInfo.averageScore}}</view>
        <view> Comment(s): {{scoreInfo.totalCount}}</view>
      </view>
      
       <view style="margin-top: 40upx;">
           <view class="uni-flex uni-row"  v-for="(comment,index) in commentList" :key="index" style="padding: 20upx;background-color: white;">
             <image :src="comment.userImg" style="width: 80upx;height: 80upx;border-radius: 40upx;"></image>
             <view class="uni-flex uni-column" style="margin-left: 20upx;">
               <view>{{comment.userName}}</view>
               <uni-rate disabled = true value="3"></uni-rate>
               <view>{{comment.content}}</view>
             </view>
           </view>
       </view>
      </scroll-view>
    </view>
 
    <view v-if = "TabCur === 2">
      <view class="uni-flex uni-row justify-between detailItem">
        
        <view class="uni-flex uni-row align-center">
          <image src="../../../../static/img/time.png" style="width:15px;height:15px"></image>
          <view style="margin-left: 20upx;">{{ i18n.openHours }}:</view>
        </view>
        
        <view class="uni-flex uni-column">
          <view>{{ i18n.Weekday }} {{storeInfo.weekday}}</view>
          <view>{{ i18n.Weekend }} {{storeInfo.weekend}}</view>
        </view>
      </view>
      
       <view class="uni-flex uni-row justify-between align-center detailItem" @click = "clickTel">
        <view class="uni-flex uni-rate align-center">
            <image src="../../../../static/img/phone.png" style="width:15px;height:15px"></image>
          <view style="margin-left: 20upx;">{{storeInfo.tel}}</view>
        </view>
        
					<uni-icon size="20" type="arrowright" color="#80838F" class="arrow-right-icon"></uni-icon>
      </view>
      
      <view class="uni-flex uni-row justify-between align-center detailItem" >
        <view class="uni-flex uni-rate align-center">
            <image src="../../../../static/img/location.png" style="width:20px;height:15px"></image>
          <view style="margin-left: 20upx;">{{storeInfo.address}}</view>
        </view>
      </view>
      
       <view class="uni-flex uni-row justify-between align-center detailItem" @click = "enClick">
        <view class="uni-flex uni-rate align-center">
            <image src="../../../../static/img/pic.png" style="width:20px;height:15px"></image>
          <view style="margin-left: 20upx;">{{ i18n.store.Environment }}</view>
        </view>
              <uni-icon size="20" type="arrowright" color="#80838F" class="arrow-right-icon"></uni-icon>
        
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex';
import WucTab from "@/components/wuc-tab/wuc-tab.vue";
import ShopCart from './cart/shopcart.vue'
import Cartcontrol from './cart/cartcontrol.vue'
import uniRate from "@/components/uni-rate/uni-rate.vue"
import { uniList, uniListItem, uniIcon } from '@dcloudio/uni-ui';

export default {
	name: '',
  
	data() {
		return {
			storeInfo: {},
      scoreInfo: undefined,
			storeId: '',
			reductionList: [],
			TabCur: 0,
      goods: [],
      height: 0,
      foodSTop: 0,
      currentIndex: 0,
      commentList: [],
      commentPage: 1,
      isLoadAll: false,
      dishesType: 1,
      tableId: ''
		};
	},
	props: {},
  components: {
    ShopCart,
    WucTab,
    Cartcontrol,
    uniRate,
    uniList, 
    uniListItem,
    uniIcon
  },
  onLoad(e) {
      this.height = Number(uni.getSystemInfoSync().windowHeight) - 55 - 190;
      this.storeId = e.storeId || '';
      this.dishesType = e.dishesType
      this.tableId = e.tableId || ''
       wx.setNavigationBarColor({
      	frontColor: '#ffffff',
        backgroundColor: this.storeColor
      })
  },
  computed: {
		...mapGetters({
		  'userInfo': 'userInfo',
		  'storeColor': 'storeColor'
		}),
    i18n() {
      return this.$t('index');
    },
    getList() {
      let result = [];
      this.goods.forEach((good) => {
        good.goods.forEach((food) => {
          if (food.count) {
            result.push(food)
          }
        })
      })
      // console.log('result', result);
      return result

    },
    // 获得购物车所有商品数量
    getAllCount: function(item) {
      // console.log('item', item)
      let result = [];
      let count = 0;

      for (let i = 0; i < this.goods.length; i++) {
        count = 0;
        this.goods[i].goods.forEach((food) => {
          // console.log('food',food);
          if (food.count >= 0) {
            count += food.count
            this.$set(this.goods[i], 'count', count)
          }
        })
        // console.log('result', count);
        result.push(count)
      }

      result.sort(function(a, b) {
        return a - b;
      })
      count = result[result.length - 1]
      // console.log('result', count);
      return count;
    },
    tabList() {
		  return [
        { name: this.i18n.orderMenu.OrderMenu },
        { name: this.i18n.orderMenu.Reviews },
        { name: this.i18n.orderMenu.Detail }
      ]
    }
		},
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
				userId: this.userInfo.userId,
				storeId: this.storeId
			};
			this.$request
				.get('/entry/wxapp/store', {
					data: param
				})
				.then(res => {
					this.storeInfo = res.store	
				})
				.catch(error => {
					console.error('error:', error)
				});
		},
    queryFoods () {
      this.$request.get('/entry/wxapp/dishes?dishesType=' + this.dishesType + '&storeId=' + this.storeId).then(res => {
        console.log('food res', res)
        this.goods = res.dishes.filter((item) => {
          return item.goods.length > 0
        })
      }).catch(error => {
        uni.showToast({
        	title: error,
          icon: 'none'
        })
      })
    },
    // 点击侧边栏
			select(index) {
				this.currentIndex = index;
				this.setScrollH(index);
			},

			// 设置点击侧边栏右边滚动的高度
			setScrollH: function(index) {
				var that = this;
				let height = 0;
				var query = uni.createSelectorQuery();
				// console.log('query',query);
				let foods = query.selectAll('.foods');
				// console.log('foods', foods);

				this.$nextTick(function() {
					foods.fields({
						size: true
					}, data => {
						if (index == 0) {
							that.foodSTop = 0;
						}
						for (let i = 0; i < index; i++) {

							height += parseInt(data[i].height);
							// console.log('fh', foods);
							that.foodSTop = height;
							// console.log(that.foodSTop)
						}

					}).exec();
				})

			},
			
			addCart: function(item) {
				// console.log('ev', JSON.stringify(item))
				if (item.count >= 0) {
					item.count++
					this.goods.forEach((good) => {
						good.goods.forEach((food) => {
							if (item.name == food.name)
								food.count = item.count
						})
					})
					// console.log('c++', JSON.stringify(item))

				} else {
					this.goods.forEach((good) => {
						good.goods.forEach((food) => {
							if (item.name === food.name)
								this.$set(food, 'count', 1)
							// food.count = 1
							// console.log('add-shop', JSON.stringify(food))
						})
					})
				}

			},
			decreaseCart(item) {
				if (item.count) {
					item.count--
					this.goods.forEach((good) => {
						good.goods.forEach((food) => {
							if (item.name === food.name)
								food.count = item.count
							// console.log('dec-shop', JSON.stringify(this.foods))
						})
					})
				}
			},
			// 清空购物车
			delAll() {
				this.goods.forEach((good) => {
					good.goods.forEach((food) => {
						if (food.count) {
							food.count = 0
							// console.log(JSON.stringify(food));
						}
					})
				})
			},
      nextHandle (items) {
        const goodsInfo = items
        const storeInfo = this.storeInfo
        const tableId = this.tableId
        const selfTakingInfo = {
          storeInfo,
          goodsInfo,
          tableId
        }
        this.$store.commit('setSelfTakingInfo', selfTakingInfo)
        uni.navigateTo({
        	url: '/pages/home/selfTaking/index?dishesType=' + this.dishesType
        })
      },
      queryScore () {
        const storeId = this.storeId
        this.$request.get('/entry/wxapp/averageStorePL?storeId=' + storeId).then(res => {
          this.scoreInfo = res.scoreInfo
        })
      },
      queryComments () {
        this.commentPage = 1
        this.commentList = []
        this.queryCommentsRequest()
      },
      loadMoreComments () {
        if (this.isLoadAll) {return}
        this.commentPage += 1
        this.queryCommentsRequest()
      },
      queryCommentsRequest () {
        const storeId = this.storeId
        this.$request.get('/entry/wxapp/storePL?storeId=' + storeId + '&pageSize=10&pageNo=' + this.commentPage).then(res => {
          if (res.assess.list.length > 0) {
            this.commentList = [...this.commentList, ...res.assess.list]
          } else {
            this.isLoadAll = true
          }
        })
      },
      clickTel() {
      	wx.makePhoneCall({
      		phoneNumber: this.storeInfo.tel
      	});
      },
      enClick () {
        uni.navigateTo({
        	url: '/pages/home/store/aboutUs?storeId=' + this.storeId
        });
      }
	},
	mounted() {
		this.queryStoreInfo();
		this.queryReduction();
    this.queryFoods();
    this.queryScore();
    this.queryComments();
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
.content {
		/* text-align: center; */
		/* height: 400upx; */
		display: flex;
		position: absolute;
		top: 360upx;
		bottom: 55px;
		width: 100%;
		overflow: hidden;
	}

	.current {
		position: relative;
		z-index: 0;
		background-color: #fff;
		color: $theme_color;
	}

	.menu-wrapper {
		text-align: center;
		width: 22%;
		display: flex;
		flex-direction: column;
		background: #f3f5f7;

	}

	.menu-item {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 70px;
    flex-direction: column;
	}

	.allcount {
		position: absolute;
		right: 6px;
		top: 8px;
		display: inline-block;
		padding: 0 4px;
		font-size: 14px;
		line-height: 16px;
		font-weight: 400;
		border-radius: 50%;
		background-color: #f01414;
		color: #ffffff;
	}

	.foods-wrapper {
		margin-left: 4px;
		width: 78%;
	}

	.food,
	.food-btm,
	.content {
		display: flex;
		flex-direction: row;
	}

	.food-title {
		padding: 2px 0;
	}

	.food-info {
		margin-left: 10px;
		margin-right: 16px;
		display: flex;
		flex-direction: column;
		flex: 2;
	}

	.food-btm {
		justify-content: space-between;

	}

	.food-price {
		color: #f01414;
		font-size: 16px;
	}
  
  .scoreTitle {
    color: orange;
    font-size: 22px;
  }
  .detailItem {
    background: white;
    padding: 20upx;
    border-bottom: #fefefe 0.8px solid
  }
  .order-header {
    background-color: #ce2029;padding-bottom: 0upx;
  }
</style>
