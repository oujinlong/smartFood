<template>
	<view v-if="detail">
     <image :src= "detail.img" class="detailImg"></image>
     <view style="width: 100vw;padding: 20upx;">
       <view style="font-size: 28upx; color: #333333;">{{detail.name}}</view>
       <view style="font-size: 24upx; color: #999999;">{{i18n.orderMenu.monthlySale}} {{detail.xsNum}}      {{i18n.orderMenu.stock}} {{detail.num}}</view>
      <view v-bind:style="{color: storeColor ? storeColor : '#ce2029', fontSize: '18px'}">{{CURRENCY_SYMBOL}} {{detail.money}}</view>
      <view style="width: calc(100% - 40upx);height: 1upx;background-color: rgba(0,0,0,0.2);"></view>
      <view style="font-size: 18px">{{i18n.orderMenu.goodDesc}}</view>
      <view style="font-size: 26upx; color: #999999;">{{i18n.orderMenu.tip}}</view
      <view style="font-size: 28upx; color: #333333;">{{detail.details}}</view>
     </view>
	</view>
</template>

<script>
	import {mapGetters} from 'vuex'
  import CONFIG from '@/utils/config.js'
	export default {
   computed: {
   	...mapGetters({
   	  'userInfo': 'userInfo',
   	  'storeColor': 'storeColor'
   	}),
     i18n() {
       return this.$t('index');
     }
   },
		props: {
			
		},
    onLoad(e) {
      
      uni.setNavigationBarTitle({
      	title: this.i18n.orderMenu.FoodDetail
      })
      
    	const {goodsId} = e
      this.loadGoodsDetail(goodsId)
    },
		data() {
			return {
        CURRENCY_SYMBOL: CONFIG.common.CURRENCY_SYMBOL,
        detail: undefined
			};
		},
		methods: {
      loadGoodsDetail(goodsId) {
        this.$request
        	.get('/entry/wxapp/dishesInfo?goodsId=' + goodsId)
        	.then(res => {
            if (res.code === 0) {
                this.detail = res.dishes
            }
        	})
        	.catch(error => {
        		console.error('error:', error);
        	});
      }
		}
	}
</script>

<style scoped>
	.detailImg {
    width: 100vw;
    height: 1.25 * 100vw;
  }
</style>
