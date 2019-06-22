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
        <view class="uni-flex uni-row justify-between bottom_border" style="padding: 20upx; min-width: 200upx;" @click='chooseCouponsClickHandle'>
           <label>Coupons</label>
           <label v-if='coupon'>$ -{{coupon.preferential}}</label>
           <view v-else>
              <uni-icon size="20" type="arrowright" color="#80838F" class="arrow-right-icon"></uni-icon>
           </view>
        </view>
        
        <!-- 满减 -->
        <view v-if='reduce' class="uni-flex uni-row justify-between bottom_border" style="padding: 20upx; min-width: 200upx;">
           <label>Online payment discount</label>
           <label>$ -{{reduce.reduction}}</label>
        </view>
           
        <!-- 新用户立减 -->
         <view v-if='storeInfo.xyhOpen === 1 && isNewUser' class="uni-flex uni-row justify-between bottom_border" style="padding: 20upx; min-width: 200upx;">
           <label>New user discount</label>
           <label>$ -{{storeInfo.xyhMoney}}</label>
        </view>
        
        <!-- 税 -->
        <view v-if='taxEnable' class="uni-flex uni-row justify-between" style="padding: 20upx; min-width: 200upx;">
           <label>Taxes</label>
           <label>$ {{tax}}</label>
        </view>
      </view>
      
      <!-- 小计 -->
      <view  class="uni-flex uni-row justify-end align-center bg_white" style="padding: 20upx; min-width: 200upx;margin-top: 40upx;">
         <label style="height: 36upx; line-height: 36upx;font-size: 32upx;">Total:</label>
         <label style="font-size: 36upx; font-weight: 800;margin-left: 30upx;">${{totalAllWithTax}}</label>
      </view>
      
      <!-- 备注 -->
      <view style="font-size: 30upx; font-weight: 600;padding: 10upx 10upx 10upx 24upx;">
        Remark
      </view>
      <view class="uni-flex uni-row align-center bg_white">
        <input placeholder="remark" v-model="remark"  style="margin: 10upx 10upx 10upx 24upx;height: 40upx;"/>
      </view>
      
      <!-- bottom bar -->
      <view class="bottom_bar uni-flex uni-row justify-between align-center">
        <view>
          <label style="color: #ffffff;font-size: 36upx; margin-left: 48upx;">
            ${{totalAllWithTax}}   
          </label>
          <label style="margin-left: 30upx; color: #ffffff;font-size: 38upx;">
            |
          </label>
          <label style="color: #ffffff;font-size: 30upx;margin-left: 30upx;">
            Discount $ -{{totalDiscount}}
          </label>
        </view>
        
        <view class="pay_now_btn uni-flex uni-row justify-center align-center" @click='payClickHandle'>
          Pay Now
        </view>
      </view>
      
      <payment-dialog :visible='showPay' :price='totalAllWithTax' @confirm='paymentConfirm' @hideHandle='hideHandle'></payment-dialog>
  </view>
</template>

<script>
  require('../../../tools/DateTool.js')
  import { mapGetters } from 'vuex'
  import { uniIcon } from '@dcloudio/uni-ui';
  import CONFIG from '@/utils/config.js';
  import {PaymentDialog} from '@/components/paymentDialog'
  export default {
    components: {
      uniIcon,
      PaymentDialog
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
        selfTakingInfo: 'selfTakingInfo',
        'userInfo': 'userInfo'
      }),
      storeInfo () {
        return this.selfTakingInfo.storeInfo
      },
      goodsInfo () {
        return this.selfTakingInfo.goodsInfo
      },
      coupon () {
        return this.selfTakingInfo.coupon
      },
      tax () {
        if (this.totalPrice - this.totalDiscount > 0) {
          let total = ((this.totalPrice - this.totalDiscount) * this.taxRate)
          
          return  ( parseInt( total * 100 ) / 100 ).toFixed(2);
        } else {
          return 0
        }
      },
      totalPrice () {
        let goodsInfo = this.selfTakingInfo.goodsInfo
        let total = 0
        goodsInfo.forEach((item, index) => {
          total += item.money * item.count
        })
          return  total
      },
      totalDiscount () {
        let total = 0
        
        // 优惠券
        let coupon = this.selfTakingInfo.coupon
        if (coupon) {
          total += parseInt(coupon.preferential)
        }
        
        // 满减
        if (this.reduce) {
          total += this.reduce.reduction
        }
        
        // 新用户
        if (this.storeInfo.xyhOpen === 1 && this.isNewUser) {
          total += this.storeInfo.xyhMoney
        }
        
          return  total
      },
      totalAll () {
        let total = (this.totalPrice - this.totalDiscount < 0) ? 0 : (this.totalPrice - this.totalDiscount ).toFixed(2)
          return  ( parseInt( total * 100 ) / 100 ).toFixed(2);
      },
      totalAllWithTax () {
        let total = parseFloat(this.totalAll)  + parseFloat(this.tax)
          return  ( parseInt( total * 100 ) / 100 ).toFixed(2);
      }
    },
    data () {
      return {
        chooseTime: '',
        reduce: undefined,
        isNewUser: false,
        taxEnable: false,
        taxRate: 0,
        remark: '',
        showPay: false
      }
    },
    onLoad() {
    	let date = new Date()
    	this.chooseTime = date.format('HH:mm')
      this.getReduce()
      this.checkNewUser()
      this.getTax()
    },
    methods: {
			hideHandle() {
				this.showPay = false
			},
      bindDateChange(date) {
        const chooseTimeStr = date.detail.value
        this.chooseTime = chooseTimeStr
      },
      chooseCouponsClickHandle () {
        uni.navigateTo({
          url: '/pages/home/coupons/index'
        })
      },
      getReduce () {
        this.$request.get('/entry/wxapp/reduction?storeId=' + this.storeInfo.id).then(res => {
          if (res.code === 0) {
            this.reduceHandle(res.reductions)
          } else {
            uni.showToast({
            	title: res.msg,
              icon: 'none',
              duration:1500
            })
          }
        }).catch(error => {
          console.log(error)
        })
      },
      reduceHandle (data) { 
        let result = undefined
        let resultList = []
        // 找到最近满足 条件的优惠
        data.forEach((item, i) => {
          if (this.totalPrice >= item.full) {
            resultList.push(item)
          }
        })
        // 在满足条件中选择减最多的一个
        resultList.forEach((item, index) => {
          if (result === undefined) {
            result = item
          } else {
            result = result.reduction > item.reduction ? result : item
          }
        })
        this.reduce = result
      },
      checkNewUser () {
        const userId = this.userInfo.userId
        console.log('userId',this.$store.userInfo, userId)
        this.$request.get('/entry/wxapp/checkFirstUser?userId=' + userId + '&sellerId=' + this.storeInfo.id).then(res => {
          if (res.code === 0) {
            this.isNewUser = (res.result === true || res.result === 'true')
          } else {
            uni.showToast({
            	title: res.msg,
              icon: 'none',
              duration:1500
            })
          }
        }).catch(error => {
          console.log(error)
        })
      },
      getTax () {
        this.$request.get('/entry/wxapp/taxRate').then(res => {
          if (res.code === 0) {
            this.taxEnable = true
            this.taxRate = res.taxRate
          } else {
            uni.showToast({
            	title: res.msg,
              icon: 'none',
              duration:1500
            })
          }
        }).catch(error => {
          console.log(error)
        })
      },
      payClickHandle () {
        this.showPay = true
      },
      paymentConfirm (item) {
        const {payIndex} = item
        let sz = []
        this.selfTakingInfo.goodsInfo.forEach((good, index) => {
           const goodInfo = {
            dishesId: good.id,
            img: good.img,
            money: good.money,
            name: good.name,
            num: good.count
          }
          sz.push(goodInfo)
        })
        const params = {
          isYue: payIndex,
          money: this.totalAll,
          taxMoney: this.tax,
          name: this.userInfo.nickName,
          note: this.remark,
          preferential:  this.totalDiscount,
          sellerId: this.selfTakingInfo.storeInfo.id,
          type: 1,
          userId: 40,
          deliveryTime: this.currentDate + ' ' + this.chooseTime,
          tel: 0,
          sz,
          tableId: 0
        }
        const coupon = this.selfTakingInfo.coupon
        if (coupon && coupon.couponsId) {
          params.couponsId = coupon.couponsId
        } else if (coupon && coupon.vouchersId)(
          params.vouchersId = coupon.vouchersId
        )
        console.log(JSON.stringify(params))
        uni.showLoading({
        	icon: 'none'
        })
        this.$request.post('/entry/wxapp/addOrder',
          {data: params}
        ).then(res => {
          uni.hideLoading()
          console.log('res:', res)
          if (res.code === 0) {
            const { orderId } = res
            uni.navigateBack({
            	delta: 1
            })
            uni.navigateTo({
            	'url': '../../order/child/selfTalingOrderDetail?orderId=' + orderId
            })
          }
        }).catch(error => {
          uni.hideLoading()
          console.log('err', error)
        })
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .container {
    display: flex;
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
  .bottom_border {
    border-bottom: lightgray 0.6upx solid;
  }
  .bottom_bar {
    background-color: #47464a;
    height: 90upx;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%
  }
  .pay_now_btn {
    color: #ffffff;
    font-size: 32upx;
    width: 300upx;
    height: 90upx;
    background-color: $theme-color;
    text-align: center;
  }
  </style>

<style lang="scss" type="text/scss" scoped>
.self-container {
	display: flex;
	flex-direction: column;
}

.bg_white {
	background-color: #ffffff;
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
	font-size: 34upx;
}
.bottom_border {
	border-bottom: lightgray 0.6upx solid;
}
.bottom_bar {
	background-color: #47464a;
	height: 90upx;
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
}
.pay_now_btn {
	color: #ffffff;
	font-size: 32upx;
	width: 300upx;
	height: 90upx;
	background-color: $theme-color;
	text-align: center;
}
</style>
