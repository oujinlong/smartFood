<template>
  <view class="container">
    
     <view class="uni-flex uni-row bg_white">
       <view class='flag'> </view>
       <label class="title">Self-taking</label>
     </view>
     
     <view class="uni-flex uni-row bg_white" style="margin-top: 40upx;">
       <view class="title">
         Self-taking time
       </view>
       
       <view class="uni-flex uni-row" style="text-align: right;flex:1;justify-content: flex-end;">
         <picker mode="time" style="width: 300upx;" :start='currentTime'  @change="bindDateChange">
            <view class="uni-input" >{{currentDate}} {{chooseTime}}</view>
         </picker>
       </view>
     </view>
     
      <view class="uni-flex uni-column bg_white" style="margin-top: 40upx;">
        <!-- 餐厅名字 -->
        <view style="padding: 20upx; text-align: center;font-size: 32upx;font-weight: 800;width: 100%;">
          {{storeInfo.name}}
        </view>
        
        <!-- 点餐明细 -->
        <view v-for="(item, index) in goodsInfo" :key = 'index' class="uni-flex uni-row" style="justify-content: space-between;padding: 10upx 20upx 10upx 20upx;">
            <label>{{item.name}}</label>
            <view >
              <label>x{{item.count}}</label>
              <label style="margin-left: 40upx;">${{(item.money * item.count).toFixed(2)}}</label>
            </view>
        </view>
      </view>
      
      <view class="uni-flex uni-column bg_white" style="margin-top: 40upx;">
        <!-- 优惠券 coupons-->
        <view class="uni-flex uni-row justify-between" style="padding: 20upx; min-width: 200upx;" @click='chooseCouponsClickHandle'>
           <label>Coupons</label>
           <label v-if='coupon'>$ -{{coupon.preferential}}</label>
           <view v-else>
              <uni-icon size="20" type="arrowright" color="#80838F" class="arrow-right-icon"></uni-icon>
           </view>
        </view>
      </view>
  </view>
</template>

<script>
  require('../../../tools/DateTool.js')
  import { mapGetters } from 'vuex'
  import { uniIcon } from '@dcloudio/uni-ui';
  
  export default {
    components: {
      uniIcon
    },
    computed: {
      currentDate () {
        let date = new Date()
        return date.format('yyyy-MM-dd')
      },
      currentTime () {
        let date = new Date()
        return date.format('HH:mm')
      },
      ...mapGetters({
        selfTakingInfo: 'selfTakingInfo'
      }),
      storeInfo () {
        return this.selfTakingInfo.storeInfo
      },
      goodsInfo () {
        return this.selfTakingInfo.goodsInfo
      },
      coupon () {
        return this.selfTakingInfo.coupon
      }
    },
    data () {
      return {
        chooseTime: '',
      }
    },
    onLoad() {
    	let date = new Date()
    	this.chooseTime = date.format('HH:mm')
    },
    methods: {
      bindDateChange(date) {
        const chooseTimeStr = date.detail.value
        this.chooseTime = chooseTimeStr
      },
      chooseCouponsClickHandle () {
        console.log(this.$store.state)
        uni.navigateTo({
          url: '/pages/home/coupons/index'
        })
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .container {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
  
  .bg_white {
    background-color: #ffffff
  }
  
  .flag {
    background-color: $theme-color;
    width: 10upx;
    height: 60upx;
    margin: 10upx 10upx 10upx 24upx;
  }
  
  .title {
    height: 60upx;
    line-height: 60upx;
    margin: 10upx 10upx 10upx 24upx;
    font-weight: 800;
    font-size: 34upx
  }
</style>
